# # analyze_sample5.py
# import cv2
# import uuid
# import time
# import requests
# import base64
# import sys
# import json
# from ultralytics import YOLO
# import cloudinary
# import cloudinary.uploader
# from google import genai
# import websockets
# import asyncio
# import threading

# # ------------------------------
# # CONFIG - change if needed
# # ------------------------------
# NODE_BACKEND_URL = "http://localhost:5000"     # <-- Node backend base URL
# WS_URL = "ws://localhost:8080"                 # <-- WebSocket url for real-time events
# FRAME_SKIP = 5                                 # sample every 5th frame
# CLOUDINARY_FOLDER = "events/"

# # ------------------------------
# # GET VIDEO PATH FROM NODE / ARGS
# # ------------------------------
# if len(sys.argv) < 2:
#     print("Error: No video path received")
#     sys.exit(1)

# PATH = sys.argv[1]
# VIDEO_ID = sys.argv[2] if len(sys.argv) > 2 else str(uuid.uuid4())

# print(f"🎬 Processing video: {PATH}")
# print(f"📹 Video ID: {VIDEO_ID}")

# # ------------------------------
# # CLOUDINARY CONFIG
# # ------------------------------
# # (You provided these earlier — consider moving to env vars for production)
# cloudinary.config(
#     cloud_name="dprwjya79",
#     api_key="623441469282272",
#     api_secret="paiJZ5_PRNSQl3SnBWk-S7a1K98"
# )

# # ------------------------------
# # GEMINI CONFIG (genai client)
# # ------------------------------
# API_KEY = "AIzaSyDPw29SEBG0obOPW42dFPEPAi76FqWpNm4"
# client = genai.Client(api_key=API_KEY)

# # ------------------------------
# # YOLO MODEL
# # ------------------------------
# model = YOLO("yolov8n.pt")
# detected_objects = set()

# # ------------------------------
# # WEBSOCKET SENDER
# # ------------------------------
# async def send_websocket_event(event_data):
#     """Send real-time event via WebSocket"""
#     try:
#         async with websockets.connect(WS_URL) as websocket:
#             await websocket.send(json.dumps(event_data))
#             # not expecting reply, just send
#             print("📡 Event sent via WebSocket")
#     except Exception as e:
#         print(f"❌ WebSocket Error: {e}")

# def send_websocket_thread(event_data):
#     """Run WebSocket send in separate thread"""
#     try:
#         asyncio.new_event_loop().run_until_complete(send_websocket_event(event_data))
#     except Exception as e:
#         # already printed in coroutine, but keep safety
#         print(f"❌ WebSocket thread error: {e}")

# # ------------------------------
# # SUMMARY FROM GEMINI
# # ------------------------------
# def summarize_from_bytes(img_bytes):
#     """Return a 4-5 word CCTV-style summary (best-effort) using Gemini"""
#     img_b64 = base64.b64encode(img_bytes).decode("utf-8")

#     try:
#         result = client.models.generate_content(
#             model="models/gemini-2.0-flash-lite",
#             contents=[
#                 {
#                     "role": "user",
#                     "parts": [
#                         {"text": "Give a CCTV-style security summary of this image. Make it 4-5 words only. Focus on suspicious activities, movements, or objects."},
#                         {
#                             "inline_data": {
#                                 "mime_type": "image/jpeg",
#                                 "data": img_b64
#                             }
#                         }
#                     ],
#                 }
#             ],
#         )

#         # result.text usually contains the assistant output
#         summary = (result.text or "").strip()
#         if not summary:
#             return "Activity detected"
#         # reduce to 4-5 words if model returns more
#         words = summary.split()
#         if len(words) <= 5 and len(words) >= 3:
#             return " ".join(words)
#         else:
#             # pick first 5 words fallback
#             return " ".join(words[:5])
#     except Exception as e:
#         print("Gemini Error:", e)
#         return "Movement detected"

# # ------------------------------
# # UPLOAD FRAME TO CLOUDINARY
# # ------------------------------
# def upload_to_cloudinary(frame):
#     """Upload BGR numpy frame to Cloudinary and return (uid, secure_url, img_bytes)"""
#     uid = str(uuid.uuid4())
#     success, buffer = cv2.imencode(".jpg", frame)
#     if not success:
#         return None, None, None
#     img_bytes = buffer.tobytes()

#     try:
#         response = cloudinary.uploader.upload(
#             img_bytes,
#             folder=CLOUDINARY_FOLDER,
#             public_id=uid,
#             resource_type="image"
#         )
#         return uid, response.get("secure_url"), img_bytes
#     except Exception as e:
#         print("Cloudinary Upload Error:", e)
#         return None, None, None

# # ------------------------------
# # AUX: time formatting
# # ------------------------------
# def format_video_time(seconds):
#     """Return HH:MM:SS string for a given seconds"""
#     return time.strftime('%H:%M:%S', time.gmtime(seconds))

# def format_duration(seconds):
#     """Return duration string like '5s' or '1.2s' (keeps one decimal if fraction)"""
#     if seconds is None:
#         return "0s"
#     if seconds.is_integer():
#         return f"{int(seconds)}s"
#     else:
#         return f"{round(seconds,1)}s"

# # ------------------------------
# # SEND FRAME TO NODE BACKEND
# # ------------------------------
# def send_frame_to_node(unique_id, image_url, short_summary, timestamp_str, duration_str, video_time):
#     """
#     Sends payload to Node backend matching frameSchema:
#     { timestamp, duration, imageUrl, shortSummary }
#     Additional metadata videoId, videoName included for reference.
#     """
#     payload = {
#         "timestamp": timestamp_str,
#         "duration": duration_str,
#         "imageUrl": image_url,
#         "shortSummary": short_summary,
#         # extra fields for backend bookkeeping
#         "videoId": VIDEO_ID,
#         "videoName": PATH.split('/')[-1],
#         "frameId": unique_id,
#         "capturedAt": time.strftime('%Y-%m-%d %H:%M:%S')
#     }

#     try:
#         resp = requests.post(f"{NODE_BACKEND_URL}/api/frames", json=payload, timeout=10)
#         if resp.status_code in (200, 201):
#             print(f"✅ Frame stored in DB: {timestamp_str} -> {short_summary}")
#         else:
#             print(f"❌ Failed storing frame: {resp.status_code} - {resp.text}")
#     except requests.exceptions.RequestException as e:
#         print(f"❌ Network error sending to backend: {e}")

#     # Always send websocket event (frontend display)
#     ws_data = {
#         "type": "NEW_FRAME",
#         "frame": payload
#     }
#     threading.Thread(target=send_websocket_thread, args=(ws_data,), daemon=True).start()

# # ------------------------------
# # MAIN VIDEO ANALYSIS (every 5th frame)
# # ------------------------------
# def analyze_video():
#     cap = cv2.VideoCapture(PATH)
#     if not cap.isOpened():
#         print(f"❌ Error: Could not open video file {PATH}")
#         return

#     fps = cap.get(cv2.CAP_PROP_FPS) or 0
#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
#     duration_seconds = (total_frames / fps) if fps > 0 else 0
#     sample_interval_seconds = (FRAME_SKIP / fps) if fps > 0 else 0

#     print(f"📊 Video Info: {fps:.2f} FPS, {total_frames} frames, {duration_seconds:.2f} seconds")
#     print(f"🔁 Sampling every {FRAME_SKIP} frames -> ~{format_duration(sample_interval_seconds)} between samples")

#     frame_count = 0
#     processed_count = 0

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         frame_count += 1

#         # Sample every FRAME_SKIP frame
#         if frame_count % FRAME_SKIP != 0:
#             continue

#         processed_count += 1

#         # compute timestamp for this frame
#         current_frame_index = cap.get(cv2.CAP_PROP_POS_FRAMES)
#         current_time_sec = current_frame_index / fps if fps > 0 else 0
#         timestamp_str = format_video_time(current_time_sec)
#         duration_str = format_duration(sample_interval_seconds)

#         print(f"\n🔎 Processing sample #{processed_count} at {timestamp_str} (frame {int(current_frame_index)})")

#         # run YOLO (you already had this)
#         try:
#             results = model(frame)
#             annotated = results[0].plot() if results and results[0] is not None else frame.copy()
#         except Exception as e:
#             print("YOLO error:", e)
#             annotated = frame.copy()

#         # detect objects set (for optional use)
#         current_objects = set()
#         try:
#             if results and results[0].boxes is not None:
#                 for box in results[0].boxes:
#                     class_id = int(box.cls)
#                     object_name = model.names[class_id]
#                     current_objects.add(object_name)
#         except Exception as e:
#             print("Error parsing YOLO boxes:", e)

#         # upload annotated frame
#         uid, img_url, img_bytes = upload_to_cloudinary(annotated)
#         if not img_url:
#             print("Skipping: upload failed")
#             continue

#         # generate short 4-5 word summary
#         summary = summarize_from_bytes(img_bytes)
#         # ensure short summary length <= ~5 words - fallback trimming
#         s_words = summary.split()
#         if len(s_words) > 5:
#             short_summary = " ".join(s_words[:5])
#         else:
#             short_summary = summary

#         # send to backend (DB) and websocket
#         send_frame_to_node(uid, img_url, short_summary, timestamp_str, duration_str, current_time_sec)

#         # small throttle to avoid overwhelming services
#         time.sleep(0.15)

#         # progress print
#         if processed_count % 20 == 0:
#             progress_pct = (current_frame_index / total_frames) * 100 if total_frames > 0 else 0
#             print(f"📈 Processed {processed_count} samples — progress: {progress_pct:.1f}%")

#     cap.release()

#     # send analysis complete
#     try:
#         complete_data = {
#             "videoId": VIDEO_ID,
#             "videoName": PATH.split('/')[-1],
#             "totalSamples": processed_count,
#             "videoDuration": f"{duration_seconds:.2f}s",
#             "completedAt": time.strftime('%Y-%m-%d %H:%M:%S'),
#         }
#         # Node endpoint for completion (optional)
#         try:
#             r = requests.post(f"{NODE_BACKEND_URL}/api/analysis-complete", json=complete_data, timeout=10)
#             if r.status_code in (200,201):
#                 print("💾 Analysis completion stored in database")
#             else:
#                 print(f"❌ Analysis completion store failed: {r.status_code}")
#         except Exception as e:
#             print(f"❌ Failed to POST analysis-complete: {e}")

#         # websocket notification
#         ws_data = {"type": "ANALYSIS_COMPLETE", "data": complete_data}
#         threading.Thread(target=send_websocket_thread, args=(ws_data,), daemon=True).start()

#         print(f"🎉 Analysis complete! Processed {processed_count} samples")
#     except Exception as e:
#         print("❌ Error sending analysis complete:", e)


# if __name__ == "__main__":
#     try:
#         analyze_video()
#     except KeyboardInterrupt:
#         print("⏹️ Analysis interrupted by user")
#         try:
#             requests.post(f"{NODE_BACKEND_URL}/api/analysis-interrupted",
#                           json={"videoId": VIDEO_ID, "status": "interrupted", "interruptedAt": time.strftime('%Y-%m-%d %H:%M:%S')},
#                           timeout=5)
#         except Exception as e:
#             print("❌ Failed to send interrupted status:", e)
#     except Exception as e:
#         print(f"💥 Analysis failed: {e}")
#         try:
#             requests.post(f"{NODE_BACKEND_URL}/api/analysis-error",
#                           json={"videoId": VIDEO_ID, "error": str(e), "failedAt": time.strftime('%Y-%m-%d %H:%M:%S')},
#                           timeout=5)
#         except Exception as e2:
#             print(f"❌ Failed to send error status: {e2}")


print("File received")









#!/usr/bin/env python3
# python/analyze_video.py
"""
Usage:
  python analyze_video.py /full/path/to/uploads/video.mp4 <folderId_optional> <videoId_optional>

This script:
 - samples every 5th frame
 - uploads sampled frames to Cloudinary
 - generates a 4-5 word summary using Gemini (genai)
 - posts each frame to backend POST /api/push-frame (matching your frameSchema)
 - sends real-time events to WebSocket at ws://localhost:8080
 - posts analysis completion to /api/analysis-complete
"""

# import sys
# import os
# import time
# import uuid
# import json
# import base64
# import threading
# import requests
# import asyncio
# import websockets

# import cv2

# # Optional, comment if you don't use YOLO
# try:
#     from ultralytics import YOLO
#     YOLO_AVAILABLE = True
# except Exception:
#     YOLO_AVAILABLE = False

# # Cloudinary
# import cloudinary
# import cloudinary.uploader

# # Gemini/genai (Google)
# # If you don't have this package or key, comment out summarize_from_bytes and use a stub.
# try:
#     from google import genai
#     GENAI_AVAILABLE = True
# except Exception:
#     GENAI_AVAILABLE = False

# # -------------------------
# # CONFIG — change to env vars if needed
# # -------------------------
# BACKEND_URL = "http://localhost:5000"            # your Node backend
# PUSH_FRAME_ENDPOINT = f"{BACKEND_URL}/api/push-frame"
# ANALYSIS_COMPLETE_ENDPOINT = f"{BACKEND_URL}/api/analysis-complete"
# WS_URL = "ws://localhost:8080"

# CLOUDINARY_CLOUD = "dprwjya79"
# CLOUDINARY_API_KEY = "623441469282272"
# CLOUDINARY_API_SECRET = "paiJZ5_PRNSQl3SnBWk-S7a1K98"
# CLOUDINARY_FOLDER = "events/"

# # Gemini/genai
# GENAI_API_KEY = "AIzaSyDPw29SEBG0obOPW42dFPEPAi76FqWpNm4"  # change or move to env

# # Processing
# FRAME_SKIP = 15  # every 5th frame
# THROTTLE_SECONDS = 0.15  # small delay between uploads to avoid bursts
# # -------------------------

# # Init Cloudinary
# cloudinary.config(
#     cloud_name=CLOUDINARY_CLOUD,
#     api_key=CLOUDINARY_API_KEY,
#     api_secret=CLOUDINARY_API_SECRET
# )

# # Init genai client if available
# if GENAI_AVAILABLE:
#     client = genai.Client(api_key=GENAI_API_KEY)

# # Init YOLO if available
# if YOLO_AVAILABLE:
#     try:
#         model = YOLO("yolov8n.pt")  # ensure model file exists or adjust
#     except Exception as e:
#         print("⚠️ YOLO init failed:", e)
#         YOLO_AVAILABLE = False
# else:
#     model = None

# # -------------------------
# # Helpers
# # -------------------------
# def format_time_hhmmss(seconds):
#     return time.strftime('%H:%M:%S', time.gmtime(seconds))

# def format_duration(seconds):
#     if seconds is None:
#         return "0s"
#     if int(seconds) == seconds:
#         return f"{int(seconds)}s"
#     return f"{round(seconds,1)}s"

# def upload_frame_to_cloudinary(frame_bgr):
#     """
#     frame_bgr: OpenCV BGR numpy array
#     returns: (uid, secure_url, img_bytes) or (None, None, None)
#     """
#     try:
#         ret, buf = cv2.imencode('.jpg', frame_bgr, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
#         if not ret:
#             return None, None, None
#         img_bytes = buf.tobytes()
#         uid = str(uuid.uuid4())
#         res = cloudinary.uploader.upload(
#             img_bytes,
#             folder=CLOUDINARY_FOLDER,
#             public_id=uid,
#             resource_type="image"
#         )
#         return uid, res.get("secure_url"), img_bytes
#     except Exception as e:
#         print("❌ Cloudinary upload error:", e)
#         return None, None, None

# def summarize_from_bytes(img_bytes):
#     """
#     Best-effort 4-5 word summary using Gemini/genai.
#     If genai not available, return a simple placeholder.
#     """
#     if not GENAI_AVAILABLE:
#         return "Activity detected"

#     try:
#         img_b64 = base64.b64encode(img_bytes).decode("utf-8")
#         result = client.models.generate_content(
#             model="models/gemini-2.0-flash-lite",
#             contents=[{
#                 "role": "user",
#                 "parts": [
#                     {"text": "Give a CCTV-style short summary of this image in 4-5 words. Focus on suspicious activities, movements, or objects."},
#                     {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
#                 ]
#             }],
#         )
#         text = (result.text or "").strip()
#         if not text:
#             return "Activity detected"
#         words = text.split()
#         if 3 <= len(words) <= 5:
#             return " ".join(words)
#         return " ".join(words[:5])
#     except Exception as e:
#         print("❌ Gemini/genai error:", e)
#         return "Movement detected"

# # Websocket sending in separate thread
# async def _ws_send(payload):
#     try:
#         async with websockets.connect(WS_URL) as ws:
#             await ws.send(json.dumps(payload))
#     except Exception as e:
#         print("❌ WebSocket send error:", e)

# def send_ws(payload):
#     try:
#         threading.Thread(target=lambda: asyncio.new_event_loop().run_until_complete(_ws_send(payload)), daemon=True).start()
#     except Exception as e:
#         print("❌ WS thread start error:", e)

# def post_frame_to_backend(folder_id, video_id, timestamp, duration, image_url, short_summary):
#     payload = {
#         "folderId": folder_id,
#         "videoId": video_id,
#         "timestamp": timestamp,
#         "duration": duration,
#         "imageUrl": image_url,
#         "shortSummary": short_summary
#     }
#     try:
#         resp = requests.post(PUSH_FRAME_ENDPOINT, json=payload, timeout=15)
#         if resp.status_code in (200, 201):
#             # broadcast to WS as well (backend may broadcast too, but we send immediate event)
#             send_ws({"type": "NEW_FRAME", "frame": payload, "folderId": folder_id, "videoId": video_id})
#             print("✅ Pushed frame to backend:", timestamp, short_summary)
#             return True
#         else:
#             print("❌ Backend push failed:", resp.status_code, resp.text)
#             return False
#     except Exception as e:
#         print("❌ Error posting to backend:", e)
#         return False

# # -------------------------
# # Main analysis
# # -------------------------
# def analyze_video(video_path, folder_id=None, video_id=None):
#     if not os.path.exists(video_path):
#         print("❌ Video path not found:", video_path)
#         return

#     print("🎬 Starting analysis for:", video_path)
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         print("❌ Could not open video")
#         return

#     fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
#     duration_seconds = total_frames / fps if fps > 0 else 0
#     sample_interval = FRAME_SKIP
#     sample_interval_seconds = (FRAME_SKIP / fps) if fps > 0 else 0

#     print(f"📊 FPS: {fps:.2f}, total_frames: {total_frames}, duration: {duration_seconds:.2f}s")
#     print(f"🔁 Sampling every {FRAME_SKIP} frames (~{sample_interval_seconds:.2f}s)")

#     frame_count = 0
#     processed = 0

#     try:
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break
#             frame_count += 1

#             # process every FRAME_SKIP-th frame
#             if frame_count % sample_interval != 0:
#                 continue

#             current_frame_index = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
#             current_time_sec = current_frame_index / fps if fps > 0 else 0.0
#             timestamp = format_time_hhmmss(current_time_sec)
#             duration = format_duration(sample_interval_seconds)

#             print(f"\n🔎 Sample #{processed+1} - frame {current_frame_index} @ {timestamp}")

#             annotated = frame.copy()

#             # YOLO detection (optional)
#             objects = set()
#             if YOLO_AVAILABLE and model is not None:
#                 try:
#                     results = model(frame)
#                     if results and results[0] is not None:
#                         annotated = results[0].plot()  # annotated image
#                         if results[0].boxes is not None:
#                             for box in results[0].boxes:
#                                 # may need `.cls` property depending on ultralytics version
#                                 try:
#                                     cid = int(box.cls)
#                                     name = model.names[cid] if hasattr(model, "names") else str(cid)
#                                     objects.add(name)
#                                 except Exception:
#                                     pass
#                 except Exception as e:
#                     print("⚠️ YOLO inference error:", e)
#                     annotated = frame.copy()

#             # upload annotated frame
#             uid, image_url, img_bytes = upload_frame_to_cloudinary(annotated)
#             if not image_url:
#                 print("⚠️ Skipping frame, cloud upload failed")
#                 continue

#             # get short summary
#             short_summary = summarize_from_bytes(img_bytes)
#             # ensure 4-5 words max
#             sw = short_summary.split()
#             if len(sw) > 5:
#                 short_summary = " ".join(sw[:5])

#             # post to backend
#             success = post_frame_to_backend(folder_id, video_id, timestamp, duration, image_url, short_summary)
#             if success:
#                 processed += 1

#             time.sleep(THROTTLE_SECONDS)

#             # progress logging
#             if processed % 20 == 0 and processed > 0:
#                 progress_pct = (current_frame_index / total_frames * 100) if total_frames > 0 else 0
#                 print(f"📈 Processed {processed} frames — progress: {progress_pct:.1f}%")

#     except KeyboardInterrupt:
#         print("⏹️ Analysis interrupted by user")
#     except Exception as e:
#         print("❌ Analysis error:", e)
#     finally:
#         cap.release()

#     # send analysis complete to backend
#     complete_payload = {
#         "videoId": video_id,
#         "videoName": os.path.basename(video_path),
#         "totalSamples": processed,
#         "videoDuration": f"{duration_seconds:.2f}s",
#         "completedAt": time.strftime('%Y-%m-%d %H:%M:%S')
#     }
#     try:
#         r = requests.post(ANALYSIS_COMPLETE_ENDPOINT, json=complete_payload, timeout=10)
#         if r.status_code in (200,201):
#             print("💾 Analysis completion stored in backend")
#         else:
#             print("⚠️ Analysis-complete store failed:", r.status_code, r.text)
#     except Exception as e:
#         print("❌ Error posting analysis-complete:", e)

#     # also send complete event on websocket
#     send_ws({"type": "ANALYSIS_COMPLETE", "data": complete_payload})

#     print(f"🎉 Analysis finished — total frames pushed: {processed}")

# # -------------------------
# # CLI entry
# # -------------------------
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Usage: python analyze_video.py /path/to/video.mp4 [folderId] [videoId]")
#         sys.exit(1)

#     video_path = sys.argv[1]
#     folder_id = sys.argv[2] if len(sys.argv) > 2 else None
#     video_id = sys.argv[3] if len(sys.argv) > 3 else None

#     analyze_video(video_path, folder_id, video_id)




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

import cv2

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

GENAI_API_KEY = "AIzaSyDPw29SEBG0obOPW42dFPEPAi76FqWpNm4"

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
def init_video_on_backend():
    """
    Calls backend in INIT mode → gets folderId & videoId.
    """
    try:
        payload = {"mode": "init"}
        resp = requests.post(PUSH_FRAME_ENDPOINT, json=payload)
        data = resp.json()

        print("🆕 INIT RESPONSE:", data)
        return data["folderId"], data["videoId"]
    except Exception as e:
        print("❌ INIT error:", e)
        return None, None

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
# MAIN ANALYSIS
# -------------------------
def analyze_video(path):
    print("🎬 ANALYZING:", path)

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        print("❌ Cannot open video")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    interval = FRAME_SKIP

    # ---- NEW LOGIC ----
    # Perform INIT ONLY once at video start
    folder_id, video_id = init_video_on_backend()

    if not folder_id or not video_id:
        print("❌ Cannot continue without folder/video ID")
        return

    frame_idx = 0
    pushed = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        if frame_idx % interval != 0:
            continue

        current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        ts = current_frame / fps

        timestamp = format_time_hhmmss(ts)
        duration = format_duration(interval / fps)

        # Optional YOLO
        annotated = frame.copy()
        if YOLO_AVAILABLE:
            try:
                result = model(frame)
                annotated = result[0].plot()
            except:
                annotated = frame.copy()

        uid, img_url, img_bytes = upload_frame_to_cloudinary(annotated)
        if not img_url:
            continue

        summary = summarize_from_bytes(img_bytes)

        post_frame(folder_id, video_id, timestamp, duration, img_url, summary)
        pushed += 1
        time.sleep(THROTTLE_SECONDS)

    cap.release()
    print("🎉 COMPLETED. Frames pushed:", pushed)

# -------------------------
# ENTRY POINT
# -------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py video.mp4")
        sys.exit()

    analyze_video(sys.argv[1])
