# import os
# import io
# import cv2
# import time
# import json
# import base64
# import numpy as np
# from datetime import datetime
# from threading import Lock, Thread
# from flask import Flask, Response
# from flask_cors import CORS

# # -----------------------------
# # 🔔 SOUND PLAYER
# # -----------------------------
# from playsound import playsound
# import threading

# ALERT_SOUND_PATH = r"E:\Mission_SIH\SRI\Models\alert.mp3"
# last_alert_time = 0
# ALERT_COOLDOWN = 3  # seconds → prevents repeated rapid sound

# def play_alert_sound():
#     global last_alert_time
#     now = time.time()
#     if now - last_alert_time < ALERT_COOLDOWN:
#         return  # prevent spam
#     last_alert_time = now

#     threading.Thread(target=playsound, args=(ALERT_SOUND_PATH,), daemon=True).start()


# # -----------------------------
# # MODELS & DB IMPORTS
# # -----------------------------
# from ultralytics import YOLO
# from pymongo import MongoClient
# import cloudinary
# import cloudinary.uploader

# from FaceRecognition import load_known_faces, recognize_faces

# try:
#     import google.generativeai as genai
#     GEMINI_AVAILABLE = True
# except:
#     GEMINI_AVAILABLE = False


# # =============================================================
# # CONFIG
# # =============================================================
# CAMERA_MAP = {
#     3: 0,  
#     5: 1,  
# }

# YOLO_PERSON_MODEL = "yolov8n.pt"
# YOLO_WEAPON_MODEL = "best_weapon.pt"
# KNOWN_FACE_DIR = "known_faces"

# RECOG_THRESHOLD = 0.45

# MONGO_URI = "mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI"
# MONGO_DB = "SRI"
# MONGO_COLLECTION = "suspect_detections"

# CLOUDINARY_CLOUD_NAME = "dprwjya79"
# CLOUDINARY_API_KEY = "943616652546731"
# CLOUDINARY_API_SECRET = "khRZlG5lvjBiuvzJZZbmdIyf3OE"

# GEMINI_API_KEY = "AIzaSyCHUI_vHgtdHsKAGSjRiex5bgkNq7S1FOY"


# # =============================================================
# # GLOBAL STREAM FRAME STORAGE
# # =============================================================
# STREAM_FRAMES = {
#     0: None,
#     1: None
# }
# stream_lock = Lock()


# # =============================================================
# # SETUP
# # =============================================================
# cloudinary.config(
#     cloud_name=CLOUDINARY_CLOUD_NAME,
#     api_key=CLOUDINARY_API_KEY,
#     api_secret=CLOUDINARY_API_SECRET
# )

# mongo = MongoClient(MONGO_URI)
# collection = mongo[MONGO_DB][MONGO_COLLECTION]

# if GEMINI_AVAILABLE:
#     try:
#         genai.configure(api_key=GEMINI_API_KEY)
#     except:
#         GEMINI_AVAILABLE = False

# known_embeddings, known_names = load_known_faces(KNOWN_FACE_DIR)
# print("Loaded known faces:", known_names)

# yolo_person = YOLO(YOLO_PERSON_MODEL)
# yolo_weapon = YOLO(YOLO_WEAPON_MODEL)

# recorded_suspects = set()
# recorded_lock = Lock()


# # =============================================================
# # HELPERS
# # =============================================================
# def iso_now():
#     return datetime.utcnow().isoformat() + "Z"


# def upload_to_cloud(img):
#     ok, enc = cv2.imencode(".jpg", img)
#     if not ok:
#         return None
#     return cloudinary.uploader.upload(
#         io.BytesIO(enc.tobytes()),
#         resource_type="image",
#         overwrite=True
#     ).get("secure_url")


# def gemini_summary(name, cam_id, details):
#     prompt = (
#         f"Create a short incident summary.\n"
#         f"Suspect: {name}\n"
#         f"Camera: {cam_id}\n"
#         f"Time: {iso_now()}\n"
#         f"Appearance: {details}\n"
#     )
#     if not GEMINI_AVAILABLE:
#         return f"{name} seen at camera {cam_id}. {details}"
#     try:
#         resp = genai.generate_text(model="text-bison-001", input=prompt, max_output_tokens=200)
#         return resp.text if hasattr(resp, "text") else str(resp)
#     except:
#         return f"{name} seen at camera {cam_id}. {details}"


# # =============================================================
# # CAMERA THREAD
# # =============================================================
# def run_camera(cam_index):
#     global STREAM_FRAMES

#     cap = cv2.VideoCapture(cam_index)
#     if not cap.isOpened():
#         print(f"❌ Cannot open camera index {cam_index}")
#         return

#     print(f"🎥 Camera {cam_index} online")

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             continue

#         # -----------------------------
#         # PERSON TRACKING
#         # -----------------------------
#         results = yolo_person.track(frame, persist=True, tracker="bytetrack.yaml", classes=[0], verbose=False)

#         if results and len(results[0].boxes) > 0:
#             for b in results[0].boxes:
#                 x1, y1, x2, y2 = map(int, b.xyxy[0])
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), (30, 255, 255), 2)

#         # -----------------------------
#         # WEAPON DETECTION 🔔 ALERT
#         # -----------------------------
#         weapon_res = yolo_weapon(frame, conf=0.5)
#         for r in weapon_res:
#             for box in r.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
#                 cv2.putText(frame, "WEAPON", (x1, y1 - 6),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

#                 # 🔔 PLAY BUZZER SOUND
#                 play_alert_sound()

#         # -----------------------------
#         # FACE RECOGNITION 🔔 ALERT
#         # -----------------------------
#         faces = recognize_faces(frame, known_embeddings, known_names, threshold=RECOG_THRESHOLD)

#         for name, score, fbox in faces:
#             fx1, fy1, fx2, fy2 = map(int, fbox)

#             cv2.rectangle(frame, (fx1, fy1), (fx2, fy2),
#                           (0, 0, 255) if name != "Unknown" else (170, 170, 170), 2)

#             cv2.putText(frame, name, (fx1, fy1 - 8),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

#             # If known suspect → trigger buzzer
#             if name != "Unknown":
#                 play_alert_sound()

#                 with recorded_lock:
#                     if name not in recorded_suspects:
#                         recorded_suspects.add(name)

#                         crop = frame[max(0, fy1):fy2, max(0, fx1):fx2]
#                         url = upload_to_cloud(crop)
#                         description = gemini_summary(name, cam_index, "Face visible")

#                         collection.insert_one({
#                             "name": name,
#                             "camera_id": cam_index,
#                             "timestamp": iso_now(),
#                             "frame": url,
#                             "description": description
#                         })

#         # -----------------------------
#         # SAVE FRAME TO STREAM BUFFER
#         # -----------------------------
#         with stream_lock:
#             STREAM_FRAMES[cam_index] = frame.copy()


# # =============================================================
# # API SERVER
# # =============================================================
# app = Flask(__name__)
# CORS(app)


# @app.route("/camera_stream/<int:cam_id>")
# def camera_stream(cam_id):

#     if cam_id not in CAMERA_MAP:
#         return "Invalid camera ID", 404

#     backend_idx = CAMERA_MAP[cam_id]

#     def generate():

#         while True:
#             with stream_lock:
#                 frame = STREAM_FRAMES.get(backend_idx)

#             if frame is None:
#                 time.sleep(0.03)
#                 continue

#             ok, jpeg = cv2.imencode(".jpg", frame)
#             if not ok:
#                 continue

#             yield (b"--frame\r\n"
#                    b"Content-Type: image/jpeg\r\n\r\n" +
#                    jpeg.tobytes() +
#                    b"\r\n")

#             time.sleep(0.03)

#     return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


# # =============================================================
# # MAIN
# # =============================================================
# if __name__ == "__main__":
#     for cam in CAMERA_MAP.values():
#         Thread(target=run_camera, args=(cam,), daemon=True).start()

#     print("🚀 Backend running on http://localhost:5005")
#     app.run(host="0.0.0.0", port=5005, threaded=True)


# server.py (modified — integrated summarizer + persistent suspect tracking)
import os
import io
import cv2
import time
import json
import base64
import numpy as np
from datetime import datetime, timezone
from threading import Lock, Thread
from flask import Flask, Response
from flask_cors import CORS

# -----------------------------
# 🔔 SOUND PLAYER
# -----------------------------
from playsound import playsound
import threading

ALERT_SOUND_PATH = r"E:\Mission_SIH\SRI\Models\alert.mp3"
last_alert_time = 0
ALERT_COOLDOWN = 3  # seconds → prevents repeated rapid sound

def play_alert_sound():
    global last_alert_time
    now = time.time()
    if now - last_alert_time < ALERT_COOLDOWN:
        return  # prevent spam
    last_alert_time = now
    threading.Thread(target=playsound, args=(ALERT_SOUND_PATH,), daemon=True).start()


# -----------------------------
# MODELS & DB IMPORTS
# -----------------------------
from ultralytics import YOLO
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader

# FaceRecognition module (user's file)
from FaceRecognition import load_known_faces, recognize_faces

# Try to import the uploaded summarizer (preferred)
try:
    import suspect_summarizer as summarizer   # uses new google-genai style in file
    SUMMARIZER_AVAILABLE = True
except Exception as e:
    print("[WARN] suspect_summarizer import failed:", e)
    SUMMARIZER_AVAILABLE = False
    summarizer = None

# Fallback summarizer (local)
def local_summary_text(name, cam_id, details):
    return f"{name} seen at camera {cam_id}. {details}"

# =============================================================
# CONFIG
# =============================================================
CAMERA_MAP = {
    3: 0,  # frontend camera id -> backend capture index
    5: 1,
}

YOLO_PERSON_MODEL = "yolov8n.pt"
YOLO_WEAPON_MODEL = "best_weapon.pt"
KNOWN_FACE_DIR = "known_faces"

RECOG_THRESHOLD = 0.45

MONGO_URI = "mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI"
MONGO_DB = "SRI"
MONGO_COLLECTION = "suspect_detections"

CLOUDINARY_CLOUD_NAME = "dprwjya79"
CLOUDINARY_API_KEY = "943616652546731"
CLOUDINARY_API_SECRET = "khRZlG5lvjBiuvzJZZbmdIyf3OE"

# =============================================================
# GLOBAL STREAM FRAME STORAGE
# =============================================================
STREAM_FRAMES = {
    0: None,
    1: None
}
stream_lock = Lock()

# =============================================================
# SETUP
# =============================================================
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

mongo = MongoClient(MONGO_URI)
collection = mongo[MONGO_DB][MONGO_COLLECTION]

# Load known faces
known_embeddings, known_names = load_known_faces(KNOWN_FACE_DIR)
print("[INFO] Loaded known faces:", known_names)

# YOLO models
yolo_person = YOLO(YOLO_PERSON_MODEL)
yolo_weapon = YOLO(YOLO_WEAPON_MODEL)

# Shared global first-detection set
recorded_suspects = set()
recorded_lock = Lock()

# Per-backend persistent mapping: backend_index -> { track_id: name }
# This ensures that once a track_id is attached to a name, it remains labelled
track_name_map = {}           # backend_idx -> { tid: name }
track_map_lock = Lock()

# =============================================================
# HELPERS
# =============================================================
def iso_now():
    # timezone-aware UTC ISO timestamp
    return datetime.now(timezone.utc).isoformat()

def upload_to_cloud(img, public_id=None):
    ok, enc = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    if not ok:
        return None
    try:
        res = cloudinary.uploader.upload(
            io.BytesIO(enc.tobytes()),
            resource_type="image",
            public_id=public_id,
            overwrite=True
        )
        return res.get("secure_url")
    except Exception as e:
        print("[ERROR] Cloudinary upload failed:", e)
        return None

def make_mask_for_person_and_face(frame, person_xy, face_xy, label=None):
    """
    Return a mask image (same size as frame) that contains only the person and face regions,
    with bounding boxes and label drawn. Useful for uploading the 'evidence' snapshot.
    """
    h, w = frame.shape[:2]
    mask = np.zeros_like(frame)
    x1, y1, x2, y2 = person_xy
    fx1, fy1, fx2, fy2 = face_xy

    # clip coords
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(w-1, x2), min(h-1, y2)
    fx1, fy1 = max(0, fx1), max(0, fy1)
    fx2, fy2 = min(w-1, fx2), min(h-1, fy2)

    # copy regions
    try:
        mask[y1:y2, x1:x2] = frame[y1:y2, x1:x2]
    except Exception:
        pass
    try:
        mask[fy1:fy2, fx1:fx2] = frame[fy1:fy2, fx1:fx2]
    except Exception:
        pass

    # draw boxes + label
    cv2.rectangle(mask, (x1, y1), (x2, y2), (0, 0, 255), 2)  # person red
    cv2.rectangle(mask, (fx1, fy1), (fx2, fy2), (255, 0, 0), 2)  # face blue
    if label:
        cv2.putText(mask, label, (fx1, max(fy1-8, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
    return mask

def gemini_appearance_summary(image_url, name, cam_id):
    """
    Calls Gemini to describe dress, colors, and full appearance 
    based only on the uploaded snapshot.
    """
    prompt = (
        "Analyze the suspect in the attached surveillance image and describe ONLY the visible outfit, "
        "dress type, clothing colors, accessories, and distinctive appearance features.\n"
        "Do NOT guess identity or give irrelevant details.\n"
        f"Camera: {cam_id}\n"
        f"Suspect: {name}\n"
        "Return 1–2 short sentences describing clothing and appearance."
    )

    try:
        response = summarizer.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt, summarizer.types.Part.from_uri(image_url, mime_type="image/jpeg")]
        )
        return response.text.strip()
    except Exception as e:
        print("[WARN] Gemini summarization failed:", e)
        return f"Clothing/appearance of {name} captured from camera {cam_id}."


def generate_summary_and_store(name, backend_idx, frame, person_xy=None, face_xy=None, details_text=None):
    """
    Called when a first-detection of a known suspect occurs.
    Uploads a focused mask image, calls the summarizer (or fallback),
    and inserts a MongoDB document.
    """
    # Create masked evidence image
    if person_xy is not None and face_xy is not None:
        mask_img = make_mask_for_person_and_face(frame, person_xy, face_xy, label=name)
    elif face_xy is not None:
        fx1, fy1, fx2, fy2 = face_xy
        mask_img = np.zeros_like(frame)
        mask_img[fy1:fy2, fx1:fx2] = frame[fy1:fy2, fx1:fx2]
        cv2.rectangle(mask_img, (fx1, fy1), (fx2, fy2), (255,0,0), 2)
        cv2.putText(mask_img, name, (fx1, max(fy1-8, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
    else:
        # full frame fallback
        mask_img = frame.copy()

    public_id = f"suspect_{name}_{int(time.time())}"
    url = upload_to_cloud(mask_img, public_id=public_id)

    # Prepare details text (appearance) if not provided
    if details_text is None:
        if person_xy is not None:
            x1, y1, x2, y2 = person_xy
            person_crop = frame[y1:y2, x1:x2] if (y2>y1 and x2>x1) else None
            details_text = describe_appearance(person_crop)
        else:
            details_text = "appearance not available"

    # Generate description using summarizer (if available) or fallback
    description = None
    title = f"{name} detected"
    # if SUMMARIZER_AVAILABLE and summarizer is not None:
    #     try:
    #         # summarizer.summarize_suspect_detection expects a snapshot_url; we uploaded above
    #         if url is not None:
    #             description = summarizer.summarize_suspect_detection(url, name, str(backend_idx), details_text)
    #             title = summarizer.generate_suspect_title(name)
    #         else:
    #             description = local_summary_text(name, backend_idx, details_text)
    #     except Exception as e:
    #         print("[WARN] Summarizer failed:", e)
    #         description = local_summary_text(name, backend_idx, details_text)
    # else:
    #     description = local_summary_text(name, backend_idx, details_text)
    
    # Generate appearance-based summary using Gemini only
    description = gemini_appearance_summary(url, name, backend_idx)
    title = f"{name} detected"


    # Insert into MongoDB
    doc = {
        "camera_id": str(backend_idx),
        "timestamp": iso_now(),
        "frame": url,
        "description": description,
        "title": title,
        "name": name,
        "details": details_text
    }
    try:
        collection.insert_one(doc)
        print(f"[DB] Inserted document for {name}")
    except Exception as e:
        print("[ERROR] MongoDB insert failed:", e)

# Reuse describe_appearance from your tracker file (copied here)
def describe_appearance(person_crop):
    if person_crop is None or person_crop.size == 0:
        return "appearance: not available"
    h, w = person_crop.shape[:2]
    upper = person_crop[0:max(1, h//2), :, :]
    lower = person_crop[max(0, h//2):h, :, :]
    def color_name_from_bgr(bgr_patch):
        hsv = cv2.cvtColor(bgr_patch, cv2.COLOR_BGR2HSV)
        hue = int(np.mean(hsv[:,:,0]))
        sat = int(np.mean(hsv[:,:,1]))
        val = int(np.mean(hsv[:,:,2]))
        if sat < 30 and val > 100:
            return "white/grey"
        if val < 60:
            return "black/dark"
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

# =============================================================
# CAMERA THREAD
# =============================================================
def run_camera(cam_index):
    global STREAM_FRAMES, track_name_map

    # ensure track map exists
    with track_map_lock:
        track_name_map.setdefault(cam_index, {})

    cap = cv2.VideoCapture(cam_index)
    if not cap.isOpened():
        print(f"❌ Cannot open camera index {cam_index}")
        return

    print(f"🎥 Camera {cam_index} online")

    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.01)
            continue

        # -----------------------------
        # PERSON TRACKING (ByteTrack via YOLO)
        # -----------------------------
        results = yolo_person.track(frame, persist=True, tracker="bytetrack.yaml", classes=[0], verbose=False)

        # Build person_boxes list with track ids
        person_boxes = []
        if results and len(results) > 0 and hasattr(results[0], "boxes") and results[0].boxes is not None:
            boxes = results[0].boxes
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

        # -----------------------------
        # WEAPON DETECTION (separate model)
        # -----------------------------
        weapon_res = yolo_weapon(frame, conf=0.5)
        for r in weapon_res:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                cv2.putText(frame, "WEAPON", (x1, y1 - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                play_alert_sound()

        # -----------------------------
        # FACE RECOGNITION
        # -----------------------------
        face_results = recognize_faces(frame, known_embeddings, known_names, threshold=RECOG_THRESHOLD)
        # face_results -> list of (name, score, box)

        # Associate faces to person boxes
        for name, score, fbox in face_results:
            fx1, fy1, fx2, fy2 = map(int, fbox)
            if name == "Unknown":
                # don't draw or record unknown faces per requirement
                continue

            # find the person box that fully contains this face bbox (prefer)
            matched_person = None
            matched_person_xy = None
            matched_tid = None
            for pb in person_boxes:
                x1, y1, x2, y2 = pb["xy"]
                if fx1 >= x1 and fy1 >= y1 and fx2 <= x2 and fy2 <= y2:
                    matched_person = pb
                    matched_person_xy = pb["xy"]
                    matched_tid = pb["track_id"]
                    break

            # If matched to a person track -> LOCK mapping tid -> name
            if matched_person is not None and matched_tid is not None:
                with track_map_lock:
                    track_name_map.setdefault(cam_index, {})
                    # Lock track id to name (once per tid)
                    if matched_tid not in track_name_map[cam_index]:
                        track_name_map[cam_index][matched_tid] = name
                        print(f"[INFO] Locked track {matched_tid} -> {name} on cam {cam_index}")

            # First-detection logic (global): upload / summarize / DB insert
            with recorded_lock:
                if name not in recorded_suspects:
                    print(f"[ALERT] First detection of {name} on camera {cam_index}")
                    recorded_suspects.add(name)
                    # create mask image focused on person+face if possible
                    if matched_person_xy is not None:
                        person_xy = matched_person_xy
                        face_xy = (fx1, fy1, fx2, fy2)
                        generate_summary_and_store(name, cam_index, frame, person_xy=person_xy, face_xy=face_xy)
                    else:
                        # face-only case
                        generate_summary_and_store(name, cam_index, frame, person_xy=None, face_xy=(fx1, fy1, fx2, fy2))

                    # Alert for known suspect
                    play_alert_sound()

        # -----------------------------
        # DRAW ONLY boxes for recognized suspects (persistent via track_name_map)
        # -----------------------------
        # For each person box, draw only if tid is mapped to a known name
        for pb in person_boxes:
            tid = pb["track_id"]
            if tid is None:
                continue
            name = None
            with track_map_lock:
                name = track_name_map.get(cam_index, {}).get(tid)
            if name:
                x1, y1, x2, y2 = pb["xy"]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, name, (x1, max(y1 - 10, 0)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        # Also draw face boxes only for recognized faces (already filtered above)
        for name, score, fbox in face_results:
            if name == "Unknown":
                continue
            fx1, fy1, fx2, fy2 = map(int, fbox)
            cv2.rectangle(frame, (fx1, fy1), (fx2, fy2), (255, 0, 0), 2)
            cv2.putText(frame, name, (fx1, max(fy1 - 10, 0)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # -----------------------------
        # Save frame to stream buffer for API
        # -----------------------------
        with stream_lock:
            STREAM_FRAMES[cam_index] = frame.copy()

# =============================================================
# API SERVER
# =============================================================
app = Flask(__name__)
CORS(app)

@app.route("/camera_stream/<int:cam_id>")
def camera_stream(cam_id):

    if cam_id not in CAMERA_MAP:
        return "Invalid camera ID", 404

    backend_idx = CAMERA_MAP[cam_id]

    def generate():
        while True:
            with stream_lock:
                frame = STREAM_FRAMES.get(backend_idx)
            if frame is None:
                time.sleep(0.03)
                continue
            ok, jpeg = cv2.imencode(".jpg", frame)
            if not ok:
                continue
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" +
                   jpeg.tobytes() +
                   b"\r\n")
            time.sleep(0.03)
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

# =============================================================
# MAIN
# =============================================================
if __name__ == "__main__":
    # start camera threads for each backend capture index
    for cam in set(CAMERA_MAP.values()):
        t = Thread(target=run_camera, args=(cam,), daemon=True)
        t.start()
    print("🚀 Backend running on http://localhost:5005")
    app.run(host="0.0.0.0", port=5005, threaded=True)
