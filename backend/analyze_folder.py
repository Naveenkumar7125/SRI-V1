# import os
# import sys

# folder_name = sys.argv[1]
# folder_path = f"uploads/{folder_name}/"

# print(f"Scanning folder: {folder_name}")

# videos = [
#     f for f in os.listdir(folder_path)
#     if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv"))
# ]

# for video in videos:
#     print(f"Analyzing video: {video}")

# print("Finished analyzing all videos.")


# import os
# import sys

# # Validate input
# if len(sys.argv) < 2:
#     print("Folder name not provided")
#     sys.exit(1)

# folder_name = sys.argv[1]

# # Get absolute backend directory path
# base_dir = os.path.dirname(os.path.abspath(__file__))

# # Correct full folder path inside backend/uploads
# folder_path = os.path.join(base_dir, "uploads", folder_name)

# print(f"Scanning folder: {folder_name}")
# print(f"Full path: {folder_path}")

# # Check folder exists
# if not os.path.exists(folder_path):
#     print("Folder not found!")
#     sys.exit(1)

# # List all videos
# videos = [
#     f for f in os.listdir(folder_path)
#     if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv"))
# ]

# # Print all videos
# for video in videos:
#     print(f"Analyzing video: {video}")

# print("Finished analyzing all videos.")


import sys
print("PYTHON EXECUTABLE:", sys.executable)

import sys
import os
import time
import uuid
import json
import base64
import threading
import requests
import asyncio
# import websockets

from dotenv import load_dotenv

import cv2


load_dotenv()

# Inject Custom ML Paths
import sys
sys.path.append(r"d:\SIH_2025\SRI_v1\Models\Tracking")

try:
    from FaceRecognition import load_known_faces, recognize_faces
    print("⏳ Initializing DeepFace Resnet / MTCNN models. Loading targeted faces...")
    KNOWN_FACES_DIR = r"d:\SIH_2025\SRI_v1\Models\Tracking\known_faces"
    known_embeddings, known_names = load_known_faces(KNOWN_FACES_DIR)
    FACE_REC_AVAILABLE = True
    print(f"✅ Securely loaded {len(known_names)} Target Encodings: {known_names}")
except Exception as e:
    print("[ERROR] Face Recognition initialization failed:", e)
    FACE_REC_AVAILABLE = False

# Cloudinary
import cloudinary
import cloudinary.uploader

# Gemini Configuration
GENAI_API_KEY = os.environ.get("API_KEY")
GENAI_AVAILABLE = bool(GENAI_API_KEY)
if not GENAI_AVAILABLE:
    print("GENAI_API_KEY NOT SET in environment!")

# -------------------------
# CONFIG
# -------------------------
BACKEND_URL = "http://localhost:5000"
PUSH_FRAME_ENDPOINT = f"{BACKEND_URL}/api/push-frame"

# --- NEW ENDPOINT ONLY FOR INIT ---
INIT_VIDEO_ENDPOINT = f"{BACKEND_URL}/api/init-video"

ANALYSIS_COMPLETE_ENDPOINT = f"{BACKEND_URL}/api/analysis-complete"
WS_URL = "ws://localhost:8080"

CLOUDINARY_CLOUD = "dprwjya79"
CLOUDINARY_API_KEY = "623441469282272"
CLOUDINARY_API_SECRET = "paiJZ5_PRNSQl3SnBWk-S7a1K98"
CLOUDINARY_FOLDER = "events/"

GENAI_API_KEY = os.environ.get("API_KEY")

FRAME_SKIP = 1
THROTTLE_SECONDS = 4.0
# -------------------------

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)



# ---------------------------------------------------------
# Helper: INIT CALL – Creates folder & video only ONCE
# ---------------------------------------------------------
# def init_video_on_backend():
#     """
#     Calls backend in INIT mode → gets folderId & videoId.
#     """
#     try:
#         payload = {"mode": "init"}
#         resp = requests.post(PUSH_FRAME_ENDPOINT, json=payload)
#         data = resp.json()

#         print("🆕 INIT RESPONSE:", data)
#         return data["folderId"], data["videoId"]
#     except Exception as e:
#         print("❌ INIT error:", e)
#         return None, None

# -------------------------
# Helper: Push one frame
# -------------------------
def post_frame(folder_id, video_id, timestamp, duration, image_url, summary):
    payload = {
        "mode": "frame",
        "folderId": folder_id,
        "videoId": video_id,
        "timestamp": timestamp,
        "duration": duration,
        "imageUrl": image_url,
        "shortSummary": summary,
    }

    try:
        resp = requests.post(PUSH_FRAME_ENDPOINT, json=payload)
        if resp.status_code in (200, 201):
            print("✅ Frame pushed:", timestamp)
            return True
        else:
            print("❌ Push failed:", resp.text)
            return False
    except Exception as e:
        print("❌ Push error:", e)
        return False

# -------------------------
# Upload image
# -------------------------
def upload_frame_to_cloudinary(frame_bgr):
    try:
        ret, buf = cv2.imencode('.jpg', frame_bgr)
        if not ret:
            return None, None, None
        img_bytes = buf.tobytes()
        uid = str(uuid.uuid4())
        res = cloudinary.uploader.upload(
            img_bytes,
            folder=CLOUDINARY_FOLDER,
            public_id=uid,
            resource_type="image"
        )
        return uid, res.get("secure_url"), img_bytes
    except Exception as e:
        print("❌ Cloudinary error:", e)
        return None, None, None

# -------------------------
# Short summary using Gemini (REST API)
# -------------------------
def summarize_from_bytes(img_bytes):
    if not GENAI_AVAILABLE:
        return "No summary: Gemini API key not available"

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GENAI_API_KEY}"
        
        headers = {"Content-Type": "application/json"}
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        
        prompt = "Provide a meaningful, concise, and insightful summary of this CCTV frame in 1-2 sentences. Focus on identifying specific actions, individuals, objects, and any potential security threats. Avoid vague language."
        
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inlineData": {"mimeType": "image/jpeg", "data": img_b64}}
                ]
            }]
        }
        
        resp = requests.post(url, headers=headers, json=payload)
        resp_data = resp.json()
        
        if resp.status_code == 200:
            return resp_data["candidates"][0]["content"]["parts"][0]["text"].strip()
        else:
            print("GEMINI API ERROR (REST):", resp_data)
            error_msg = resp_data.get("error", {}).get("message", "Model returned error.")
            if "quota" in error_msg.lower():
                return f"Google API Quota Exceeded. Please try again later."
            return f"API Error: {error_msg[:80]}..."
            
    except Exception as e:
        print("GEMINI API ERROR:", e)
        return f"Summary failed: {str(e)[:50]}"

# -------------------------
# Time formatting
# -------------------------
def format_time_hhmmss(sec):
    return time.strftime('%H:%M:%S', time.gmtime(sec))

def format_duration(sec):
    return f"{round(sec,1)}s"


# -------------------------
# MAIN ANALYSIS FOR A SINGLE VIDEO
# -------------------------
def analyze_video(path, folder_name):
    print("🎬 ANALYZING:", path)

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        print("❌ Cannot open video")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    interval = FRAME_SKIP

    video_name = os.path.basename(path)

    frame_idx = 0
    pushed = 0
    seen_faces = set()  # Global session HashSet to aggressively prevent duplicate processing

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1
        
        # --- PUSH REAL-TIME PROGRESS ---
        if frame_idx % 10 == 0:
            prog = int((frame_idx / total_frames) * 100) if total_frames > 0 else 0
            print(json.dumps({
                "type": "progress",
                "progress": min(prog, 99),
                "videoName": video_name
            }))
            sys.stdout.flush()
        if frame_idx != 1 and frame_idx % interval != 0:
            continue

        # ---- TIMESTAMP AND FRAME DURATION ----
        current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        ts = current_frame / fps

        timestamp = format_time_hhmmss(ts)
        duration = format_duration(interval / fps)

        # ---- TARGETED FACE RECOGNITION ALGORITHM ----
        annotated = frame.copy()
        target_detected = False
        
        if FACE_REC_AVAILABLE:
            results = recognize_faces(frame, known_embeddings, known_names, threshold=0.45)
            # Extrapolate explicitly identified targets
            detected_targets = [res for res in results if res[0] != "Unknown"]
            
            for name, score, box in detected_targets:
                # Always accurately map and draw boxes for everyone in the frame natively
                x1, y1, x2, y2 = [int(v) for v in box]
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(annotated, f"{name} ({score:.2f})", (x1, max(y1-10, 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                
                # But rigorously throttle and ONLY send to Google API if it's a completely NEW Face
                if name not in seen_faces:
                    seen_faces.add(name)
                    target_detected = True

        # ---- HASHSET SILENT REJECTION ----
        # If no targeted faces were found in this frame (or they've already been logged earlier), skip!
        if not target_detected:
            continue

        # ---- SECURE CLOUDINARY UPLOAD ----
        uid, img_url, img_bytes = upload_frame_to_cloudinary(annotated)
        if not img_url:
            continue

        # ---- GEMINI SUMMARY ----
        summary = summarize_from_bytes(img_bytes)

        # ---- SEND LIVE FRAME EVENT TO BACKEND ----
        payload = {
            "folderName": folder_name,
            "videoName": video_name,
            "timestamp": timestamp,
            "duration": duration,
            "imageUrl": img_url,
            "shortSummary": summary
        }

        # POST TO BACKEND
        # print("Pushing...")
        # requests.post("http://localhost:5000/api/live-frame", json=payload)
        
        # DEBUG PRINT
        print("\n--------------------------------")
        print("📤 SENDING LIVE FRAME TO BACKEND")
        print("--------------------------------")
        print(json.dumps(payload, indent=4))
        print("--------------------------------\n")
        
        # SEND
        requests.post("http://localhost:5000/api/live-frame", json=payload)

        pushed += 1
        time.sleep(THROTTLE_SECONDS)

    cap.release()
    print("🎉 COMPLETED. Frames pushed:", pushed)

    # ---- FINAL SUMMARY ----
    final_data = {
        "folderName": folder_name,
        "videoName": video_name,
        "duration": format_time_hhmmss(total_frames / fps),
        "finalSummary": f"{pushed} events analyzed"
    }

    requests.post("http://localhost:5000/api/analysis-complete", json=final_data)




# ---------------------------------------------------------
# NEW FUNCTION: ANALYZE ALL VIDEOS IN THE FOLDER
# ---------------------------------------------------------
def analyze_folder(folder_name):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    folder_path = os.path.join(base_dir, "uploads", folder_name)

    print("📁 Scanning folder:", folder_path)

    videos = [
        f for f in os.listdir(folder_path)
        if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv"))
    ]

    for video in videos:
        video_path = os.path.join(folder_path, video)
        analyze_video(video_path, folder_name)




# -------------------------
# ENTRY POINT (UPDATED)
# -------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze.py <folderName>")
        sys.exit()

    folder_name = sys.argv[1]
    analyze_folder(folder_name)



print("HI")