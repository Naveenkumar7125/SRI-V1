"""
suspect_tracker.py

Single-file tracker that:
 - Loads your FaceRecognition.py (MTCNN + InceptionResNetV1)
 - Runs YOLOv8 person tracking per camera
 - When a known suspect is first observed anywhere:
     * Captures the frame (draws only suspect face + person bbox)
     * Uploads the image to Cloudinary
     * Summarizes the frame via Gemini (if available) or local fallback
     * Stores a document in MongoDB collection `suspect_detections`

Dependencies:
 - ultralytics (YOLOv8)
 - pymongo
 - cloudinary
 - google.generativeai (optional; fallback is local)
 - OpenCV, numpy, scikit-learn (face module already uses sklearn)
 - Your FaceRecognition.py should define load_known_faces(...) and recognize_faces(...)
"""

import os
import io
import cv2
import time
import json
import base64
import numpy as np
from datetime import datetime
from threading import Lock

# YOLO
from ultralytics import YOLO

# MongoDB
from pymongo import MongoClient

# Cloudinary
import cloudinary
import cloudinary.uploader

# Try to import the user face-recognition module (must be in same folder)
from FaceRecognition import load_known_faces, recognize_faces  # uses known_faces folder

# Optional: Gemini (Google generative API) - if present we'll use it, otherwise fallback
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except Exception:
    GEMINI_AVAILABLE = False

# -----------------------------
#  CONFIG (change to env vars if preferred)
# -----------------------------
CAMERA_SOURCES = [0,1]            # adjust as needed (can be indices or video paths)
KNOWN_FACE_DIR = "known_faces"
YOLO_MODEL_PATH = "yolov8n.pt"     # path to yolov8 model
OUTPUT_DIR = "output_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# MongoDB (user provided)
MONGO_URI = "mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI?retryWrites=true&w=majority&appName=NK"
MONGO_DB = "SRI"
MONGO_COLLECTION = "suspect_detections"   # new collection

# Cloudinary (user provided)
CLOUDINARY_CLOUD_NAME = "dprwjya79"
CLOUDINARY_API_KEY = "943616652546731"
CLOUDINARY_API_SECRET = "khRZlG5lvjBiuvzJZZbmdIyf3OE"

# Gemini API key (user provided) — optional; if omitted, local summary used
GEMINI_API_KEY = "AIzaSyCHUI_vHgtdHsKAGSjRiex5bgkNq7S1FOY"

# Recognition threshold (same as your FaceRecognition default)
RECOG_THRESHOLD = 0.45

# -----------------------------
#  SETUP: Cloudinary / Mongo / Known faces / YOLO
# -----------------------------
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]
collection = db[MONGO_COLLECTION]  # automatically created on first insert

# Configure Gemini if available
if GEMINI_AVAILABLE:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print("[WARN] Gemini configure failed:", e)
        GEMINI_AVAILABLE = False

# Load known faces (embeddings + names)
print("[INFO] Loading known faces...")
known_embeddings, known_names = load_known_faces(KNOWN_FACE_DIR)
print(f"[INFO] Loaded known names: {known_names}")

# -----------------------------
#  Shared state across camera trackers
# -----------------------------
# recorded_suspects holds suspect names we already saved/uploaded (global first-detection control)
recorded_suspects = set()
recorded_lock = Lock()

# -----------------------------
#  Utility functions
# -----------------------------
def iso_now():
    return datetime.utcnow().isoformat() + "Z"

def upload_image_to_cloudinary(bgr_image, public_id=None):
    """
    Upload image (BGR numpy) to Cloudinary and return secure_url.
    """
    # convert to JPEG bytes
    success, enc = cv2.imencode(".jpg", bgr_image, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    if not success:
        raise RuntimeError("Failed to encode image for upload")
    img_bytes = enc.tobytes()
    # Cloudinary upload from bytes
    res = cloudinary.uploader.upload(
        io.BytesIO(img_bytes),
        resource_type="image",
        public_id=public_id,
        overwrite=True
    )
    return res.get("secure_url")

def describe_appearance(person_crop):
    """
    Quick heuristic description:
     - Compute average color of upper half (shirt) and lower half (pants)
     - Return text like 'shirt: red-ish, pants: blue-ish'
    """
    if person_crop is None or person_crop.size == 0:
        return "appearance: not available"
    h, w = person_crop.shape[:2]
    # upper half and lower half
    upper = person_crop[0:max(1, h//2), :, :]
    lower = person_crop[max(0, h//2):h, :, :]
    def color_name_from_bgr(bgr_patch):
        # convert to HSV and get hue mean
        hsv = cv2.cvtColor(bgr_patch, cv2.COLOR_BGR2HSV)
        hue = int(np.mean(hsv[:,:,0]))
        sat = int(np.mean(hsv[:,:,1]))
        val = int(np.mean(hsv[:,:,2]))
        # rough mapping
        if sat < 30 and val > 100:
            return "white/grey"
        if val < 60:
            return "black/dark"
        # hue ranges (approx)
        if hue < 10 or hue > 160:
            return "red"
        if 10 <= hue < 25:
            return "orange"
        if 25 <= hue < 45:
            return "yellow"
        if 45 <= hue < 85:
            return "green"
        if 85 <= hue < 130:
            return "blue"
        if 130 <= hue < 160:
            return "purple/magenta"
        return "unknown-color"
    shirt = color_name_from_bgr(upper)
    pants = color_name_from_bgr(lower) if lower.size>0 else "unknown"
    return f"shirt: {shirt}, pants: {pants}"

def gemini_summary_prompt(camera_id, timestamp, name, details):
    return (f"Create a concise, clear incident summary for storage in a police log.\n"
            f"Camera: {camera_id}\nTime(UTC): {timestamp}\nSuspect name: {name}\nObserved details: {details}\n"
            f"Make a short title (<=6 words) and a brief description (1-2 sentences).")

def call_gemini_summary(prompt):
    """
    Try to call Gemini (google.generativeai). If not possible, raise an exception.
    """
    if not GEMINI_AVAILABLE:
        raise RuntimeError("Gemini client not available")
    try:
        # API usage may vary; we'll use a safe `genai` call pattern if available.
        # If the library version differs you may need to adapt this call.
        resp = genai.generate_text(
            model="text-bison-001",  # older name - if your environment uses different model, change accordingly
            input=prompt,
            max_output_tokens=200
        )
        # If response is dict-like
        text = ""
        if isinstance(resp, dict) and "content" in resp:
            text = resp["content"]
        else:
            # Many versions return different structures — try attribute access
            text = getattr(resp, "text", None) or getattr(resp, "output", None) or str(resp)
        return text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini call failed: {e}")

# -----------------------------
#  CameraTracker class
# -----------------------------
class CameraTracker:
    def __init__(self, cam_index, known_embeddings, known_names, shared_recorded, lock, model_path=YOLO_MODEL_PATH):
        self.cam_index = cam_index
        self.known_embeddings = known_embeddings
        self.known_names = known_names
        self.shared_recorded = shared_recorded
        self.lock = lock

        self.cap = cv2.VideoCapture(cam_index)
        if not self.cap.isOpened():
            print(f"[WARN] Could not open camera {cam_index}")

        self.model = YOLO(model_path)

        # writer
        self.writer = None
        self.out_path = None

        # local per-camera mapping track->name
        self.track_to_name = {}
        self.name_to_track = {}

        # lazy init window title
        self.window_name = f"Camera {cam_index}"

    def init_writer(self, frame):
        if self.writer is not None:
            return
        h, w = frame.shape[:2]
        fps = self.cap.get(cv2.CAP_PROP_FPS)
        if fps is None or fps <= 0:
            fps = 25
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.out_path = os.path.join(OUTPUT_DIR, f"cam{self.cam_index}_{ts}.mp4")
        self.writer = cv2.VideoWriter(self.out_path, fourcc, fps, (w, h))
        print(f"[INFO] Recording camera {self.cam_index} -> {self.out_path}")

    def read_and_process(self):
        if not self.cap or not self.cap.isOpened():
            return False
        ret, frame = self.cap.read()
        if not ret:
            return False
        self.init_writer(frame)
        processed = self.process_frame(frame)
        cv2.imshow(self.window_name, processed)
        if self.writer is not None:
            self.writer.write(processed)
        return True

    def process_frame(self, frame):
        # Run person tracker
        # Use only person class = 0
        results = self.model.track(frame, persist=True, tracker="bytetrack.yaml", classes=[0], conf=0.5, verbose=False)
        # face recognition
        face_results = recognize_faces(frame, self.known_embeddings, self.known_names, threshold=RECOG_THRESHOLD)
        # face_results -> list of (name, score, box)
        # If face_results has known names, try to match to person boxes
        person_boxes = []
        if results and len(results) > 0 and hasattr(results[0], "boxes") and results[0].boxes is not None:
            boxes = results[0].boxes
            # boxes.xyxy, boxes.id
            for b in boxes:
                try:
                    xy = b.xyxy[0].cpu().numpy() if hasattr(b.xyxy[0], "cpu") else b.xyxy[0]
                except Exception:
                    xy = b.xyxy[0]
                x1, y1, x2, y2 = map(int, xy)
                track_id = None
                try:
                    track_id = int(b.id[0])
                except Exception:
                    track_id = None
                person_boxes.append({"xy": (x1, y1, x2, y2), "track_id": track_id})
        # Associate faces to person boxes; if a known face appears inside a person box, handle first-detection logic
        for name, score, fbox in face_results:
            if name == "Unknown":
                continue
            fx1, fy1, fx2, fy2 = map(int, fbox)
            # find person box that contains the whole face bounding box
            matched_person = None
            for pb in person_boxes:
                x1, y1, x2, y2 = pb["xy"]
                if fx1 >= x1 and fy1 >= y1 and fx2 <= x2 and fy2 <= y2:
                    matched_person = pb
                    break
            # If there's no person box (face alone), still allow capture (body unknown)
            # But user wanted both face and body bbox — so prefer person box; if none, still save face+body=None
            if matched_person is not None:
                # LOCK TRACK ID for future tracking even if face not visible
                tid = matched_person["track_id"]
                if tid is not None:
                    self.track_to_name[tid] = name

                # If this suspect not recorded earlier globally, record now
                with self.lock:
                    already = name in self.shared_recorded
                    if not already:
                        print(f"[ALERT] First detection of {name} on camera {self.cam_index}")
                        # prepare capture image: draw only person and face box on a clean copy
                        capture = frame.copy()
                        # black out everything first for clarity (optional) -> user requested only two boxes shown
                        # We'll mask everything except face and person bbox region for clarity
                        mask = np.zeros_like(capture)
                        x1,y1,x2,y2 = matched_person["xy"]
                        # copy person region
                        mask[y1:y2, x1:x2] = capture[y1:y2, x1:x2]
                        # ensure face region copied as well (in case face is slightly outside)
                        mask[fy1:fy2, fx1:fx2] = capture[fy1:fy2, fx1:fx2]
                        # draw bounding boxes in color on mask
                        cv2.rectangle(mask, (x1, y1), (x2, y2), (0,0,255), 2)    # person red
                        cv2.rectangle(mask, (fx1, fy1), (fx2, fy2), (255,0,0), 2)  # face blue
                        # place label
                        cv2.putText(mask, name, (fx1, max(fy1-10,0)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
                        # Now upload mask to cloud
                        try:
                            cloud_url = upload_image_to_cloudinary(mask, public_id=f"suspect_{name}_{int(time.time())}")
                        except Exception as e:
                            cloud_url = None
                            print("[ERROR] Cloudinary upload failed:", e)
                        # Prepare appearance details (crop person region)
                        person_crop = frame[y1:y2, x1:x2] if (y2>y1 and x2>x1) else None
                        details_text = describe_appearance(person_crop)
                        # Summarize using Gemini if available (fallback to local summary)
                        title = f"{name} detected"
                        summary = ""
                        prompt = gemini_summary_prompt(self.cam_index, iso_now(), name, details_text)
                        if GEMINI_AVAILABLE:
                            try:
                                summary_raw = call_gemini_summary(prompt)
                                summary = summary_raw
                            except Exception as e:
                                print("[WARN] Gemini summarization failed, using fallback:", e)
                                summary = f"{name} seen on camera {self.cam_index} at {iso_now()}. {details_text}"
                        else:
                            summary = f"{name} seen on camera {self.cam_index} at {iso_now()}. {details_text}"
                        # Insert to MongoDB
                        doc = {
                            "camera_id": str(self.cam_index),
                            "timestamp": iso_now(),
                            "frame": cloud_url,
                            "description": summary,
                            "title": title,
                            "name": name,
                            "details": details_text
                        }
                        try:
                            collection.insert_one(doc)
                            print(f"[DB] Inserted document for {name}")
                        except Exception as e:
                            print("[ERROR] MongoDB insert failed:", e)
                        # mark as recorded
                        self.shared_recorded.add(name)
            else:
                # No person box matched — we can optionally still save the face crop only.
                with self.lock:
                    already = name in self.shared_recorded
                    if not already:
                        print(f"[ALERT] First detection of {name} (face-only) on camera {self.cam_index}")
                        fx1, fy1, fx2, fy2 = map(int, fbox)
                        mask = np.zeros_like(frame)
                        # copy face region
                        mask[fy1:fy2, fx1:fx2] = frame[fy1:fy2, fx1:fx2]
                        cv2.rectangle(mask, (fx1, fy1), (fx2, fy2), (255,0,0), 2)
                        cv2.putText(mask, name, (fx1, max(fy1-10, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
                        try:
                            cloud_url = upload_image_to_cloudinary(mask, public_id=f"suspect_{name}_{int(time.time())}")
                        except Exception as e:
                            cloud_url = None
                            print("[ERROR] Cloudinary upload failed:", e)
                        person_crop = None
                        details_text = describe_appearance(person_crop)
                        title = f"{name} detected"
                        if GEMINI_AVAILABLE:
                            try:
                                summary_raw = call_gemini_summary(gemini_summary_prompt(self.cam_index, iso_now(), name, details_text))
                                summary = summary_raw
                            except Exception as e:
                                summary = f"{name} seen on camera {self.cam_index} at {iso_now()}. {details_text}"
                        else:
                            summary = f"{name} seen on camera {self.cam_index} at {iso_now()}. {details_text}"
                        doc = {
                            "camera_id": str(self.cam_index),
                            "timestamp": iso_now(),
                            "frame": cloud_url,
                            "description": summary,
                            "title": title,
                            "name": name,
                            "details": details_text
                        }
                        try:
                            collection.insert_one(doc)
                            print(f"[DB] Inserted document for {name} (face-only)")
                        except Exception as e:
                            print("[ERROR] MongoDB insert failed:", e)
                        self.shared_recorded.add(name)
        # Draw all usual overlays for display (but per your request when saving we only uploaded face+body)
        # We'll draw person boxes and face boxes for visualization locally
        # Draw person boxes yellow for normal person
        # Draw boxes ONLY for recognized suspects
        for pb in person_boxes:
            tid = pb["track_id"]
            if tid in self.track_to_name:
                name = self.track_to_name[tid]
                x1, y1, x2, y2 = pb["xy"]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,0,255), 2)
                cv2.putText(frame, name, (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,255), 2)
    # ELSE: Do not draw anything for unknown people

        for name, score, fbox in face_results:
            if name == "Unknown":
                continue
            fx1, fy1, fx2, fy2 = map(int, fbox)
            cv2.rectangle(frame, (fx1, fy1), (fx2, fy2), (255,0,0), 2)
        return frame

    def release(self):
        if self.cap:
            self.cap.release()
        if self.writer:
            self.writer.release()
        cv2.destroyWindow(self.window_name)

# -----------------------------
#  MAIN
# -----------------------------
def main():
    trackers = []
    for idx in CAMERA_SOURCES:
        trackers.append(CameraTracker(idx, known_embeddings, known_names, recorded_suspects, recorded_lock))
    print("[INFO] Press ESC to quit.")
    while True:
        active = False
        for t in trackers:
            ok = t.read_and_process()
            if ok:
                active = True
        if not active:
            print("[INFO] No active streams. Exiting.")
            break
        # quit on ESC
        if cv2.waitKey(1) & 0xFF == 27:
            print("[INFO] ESC pressed, exiting.")
            break
    # cleanup
    for t in trackers:
        t.release()
    mongo_client.close()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
