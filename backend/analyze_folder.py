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
import os
import time
import uuid
import json
import base64
import threading
import requests
import asyncio
import websockets

from dotenv import load_dotenv

import cv2


load_dotenv()

# Optional YOLO
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except Exception:
    YOLO_AVAILABLE = False

# Cloudinary
import cloudinary
import cloudinary.uploader

# Gemini
try:
    from google import genai
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False

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

FRAME_SKIP = 15
THROTTLE_SECONDS = 0.15
# -------------------------

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

if GENAI_AVAILABLE:
    client = genai.Client(api_key=GENAI_API_KEY)

if YOLO_AVAILABLE:
    try:
        model = YOLO("yolov8n.pt")
    except Exception:
        YOLO_AVAILABLE = False

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
# Short summary using Gemini
# -------------------------
def summarize_from_bytes(img_bytes):
    if not GENAI_AVAILABLE:
        return "Activity detected"

    try:
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        result = client.models.generate_content(
            model="models/gemini-2.0-flash-lite",
            contents=[{
                "role": "user",
                "parts": [
                    {"text": "Give a CCTV-style short summary in 4-5 words."},
                    {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
                ]
            }],
        )
        text = result.text.strip()
        words = text.split()
        return " ".join(words[:5])
    except:
        return "Activity detected"

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

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1
        if frame_idx % interval != 0:
            continue

        # ---- TIMESTAMP AND FRAME DURATION ----
        current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        ts = current_frame / fps

        timestamp = format_time_hhmmss(ts)
        duration = format_duration(interval / fps)

        # ---- YOLO ----
        annotated = frame.copy()
        if YOLO_AVAILABLE:
            try:
                result = model(frame)
                annotated = result[0].plot()
            except:
                annotated = frame.copy()

        # ---- CLOUDINARY UPLOAD ----
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
