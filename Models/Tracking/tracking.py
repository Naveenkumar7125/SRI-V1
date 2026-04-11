import os
import cv2
import numpy as np
from collections import defaultdict, deque
from datetime import datetime

from ultralytics import YOLO

# Your face recognition module
from FaceRecognition import load_known_faces, recognize_faces

# ---------------------------------------------------
# CONFIG
# ---------------------------------------------------
CAMERA_SOURCES = [0, 1]          # multi-cam: change/add indices as needed
KNOWN_FACE_DIR = "known_faces"   # folder containing suspect images
OUTPUT_DIR = "output_videos"     # folder to store output videos
os.makedirs(OUTPUT_DIR, exist_ok=True)

# YOLO model path (you can change to yolov8s.pt / yolov8m.pt)
YOLO_MODEL_PATH = "yolov8n.pt"

# Trail length per tracked ID
MAX_TRAIL_LEN = 50


# ---------------------------------------------------
# LOAD KNOWN FACES (SUSPECTS)
# ---------------------------------------------------
print("[INFO] Loading known faces from:", KNOWN_FACE_DIR)
known_embeddings, known_names = load_known_faces(KNOWN_FACE_DIR)
print("[INFO] Loaded suspects:", known_names)


# ---------------------------------------------------
# CAMERA TRACKER CLASS
# ---------------------------------------------------
class CameraTracker:
    def __init__(self, cam_index, known_embeddings, known_names):
        self.cam_index = cam_index
        self.known_embeddings = known_embeddings
        self.known_names = known_names

        # Open video capture
        self.cap = cv2.VideoCapture(cam_index)
        if not self.cap.isOpened():
            print(f"[WARN] Could not open camera {cam_index}")

        # Set desired resolution if you want (optional)
        # self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        # self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        # Create YOLO model instance **per camera** to avoid mixing trackers
        self.model = YOLO(YOLO_MODEL_PATH)

        # Track → name and name → track (first-detection assignment)
        self.track_to_name = {}   # track_id -> suspect_name
        self.name_to_track = {}   # suspect_name -> track_id

        # Trail history
        self.centroid_history = defaultdict(lambda: deque(maxlen=MAX_TRAIL_LEN))

        # Video writer (initialized lazily on first frame)
        self.writer = None
        self.out_path = None

        # Window name
        self.window_name = f"Camera {cam_index}"

    def init_writer(self, frame):
        """Initialize VideoWriter for this camera when first frame is available."""
        if self.writer is not None:
            return

        h, w = frame.shape[:2]
        fps = self.cap.get(cv2.CAP_PROP_FPS)
        if fps is None or fps <= 0:
            fps = 25  # default fallback

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.out_path = os.path.join(OUTPUT_DIR, f"cam{self.cam_index}_{timestamp}.mp4")

        self.writer = cv2.VideoWriter(self.out_path, fourcc, fps, (w, h))
        print(f"[INFO] Recording for camera {self.cam_index} -> {self.out_path}")

    def read_and_process(self):
        """Read frame from cam, process, show, write to file.
        Returns False if stream is finished, True otherwise."""
        if not self.cap.isOpened():
            return False

        ret, frame = self.cap.read()
        if not ret:
            return False

        # Initialize writer on first good frame
        self.init_writer(frame)

        processed_frame = self.process_frame(frame)

        # Show and save
        cv2.imshow(self.window_name, processed_frame)
        if self.writer is not None:
            self.writer.write(processed_frame)

        return True

    def process_frame(self, frame):
        """Run YOLO tracking + face recognition + matching + drawing."""
        # -------------------------------------------------------
        # 1. YOLOv8 person tracking
        # -------------------------------------------------------
        results = self.model.track(
            frame,
            persist=True,
            tracker="bytetrack.yaml",
            classes=[0],  # person class
            conf=0.5,
            verbose=False
        )

        if not results or results[0].boxes is None:
            # Still run face drawing so you can see faces alone if needed
            face_results = recognize_faces(frame, self.known_embeddings, self.known_names)
            frame = self.draw_faces(frame, face_results)
            return frame

        boxes = results[0].boxes

        # -------------------------------------------------------
        # 2. Face recognition on this frame
        # -------------------------------------------------------
        face_results = recognize_faces(frame, self.known_embeddings, self.known_names)
        # face_results: [(name, score, box), ...]

        # -------------------------------------------------------
        # 3. Associate suspects with track IDs (first assignment only)
        # -------------------------------------------------------
        for box in boxes:
            if box.id is None:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            track_id = int(box.id[0])

            # Compute centroid for trail
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            self.centroid_history[track_id].append((cx, cy))

            # If this track ID does NOT have a name yet, try to match
            if track_id not in self.track_to_name:
                # Check each detected face
                for name, score, fbox in face_results:
                    if name == "Unknown":
                        continue  # Skip unknown faces

                    # If we already assigned this suspect to another track, skip
                    if name in self.name_to_track:
                        continue

                    fx1, fy1, fx2, fy2 = map(int, fbox)

                    # Check if the face box is inside the person box
                    if fx1 >= x1 and fy1 >= y1 and fx2 <= x2 and fy2 <= y2:
                        # Assign suspect to this track
                        self.track_to_name[track_id] = name
                        self.name_to_track[name] = track_id
                        print(f"[MATCH] Camera {self.cam_index}: {name} -> Track {track_id}")
                        break

        # -------------------------------------------------------
        # 4. Draw person boxes + trails
        # -------------------------------------------------------
        frame = self.draw_tracks(frame, boxes)

        # -------------------------------------------------------
        # 5. Draw face boxes
        # -------------------------------------------------------
        frame = self.draw_faces(frame, face_results)

        return frame

    def draw_tracks(self, frame, boxes):
        for box in boxes:
            if box.id is None:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            track_id = int(box.id[0])

            # Determine if this is a known suspect
            if track_id in self.track_to_name:
                name = self.track_to_name[track_id]
                label = f"{name} (ID:{track_id})"
                color = (0, 0, 255)
            else:
                label = f"Person {track_id}"
                color = (0, 255, 255)  # GREEN for normal person

            # Draw bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # Draw label
            cv2.putText(
                frame,
                label,
                (x1, max(y1 - 10, 0)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

            # Draw centroid trail
            pts = self.centroid_history[track_id]
            for i in range(1, len(pts)):
                cv2.line(frame, pts[i - 1], pts[i], color, 2)

        return frame

    def draw_faces(self, frame, face_results):
        """Draw face bounding boxes and names (from FaceRecognition)."""
        for name, score, fbox in face_results:
            fx1, fy1, fx2, fy2 = map(int, fbox)
            face_color = (255, 0, 0) if name != "Unknown" else (200, 200, 200)

            cv2.rectangle(frame, (fx1, fy1), (fx2, fy2), face_color, 2)
            text = f"{name}"
            cv2.putText(
                frame,
                text,
                (fx1, max(fy1 - 10, 0)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                face_color,
                2
            )

        return frame

    def release(self):
        if self.cap is not None:
            self.cap.release()
        if self.writer is not None:
            self.writer.release()
        cv2.destroyWindow(self.window_name)
        if self.out_path:
            print(f"[INFO] Saved video for camera {self.cam_index} -> {self.out_path}")


# ---------------------------------------------------
# MAIN
# ---------------------------------------------------
def main():
    # Create one tracker per camera
    trackers = [CameraTracker(idx, known_embeddings, known_names) for idx in CAMERA_SOURCES]

    print("[INFO] Press ESC to quit all cameras.")

    while True:
        any_active = False

        for tracker in trackers:
            ok = tracker.read_and_process()
            if ok:
                any_active = True

        if not any_active:
            print("[INFO] No active camera streams left. Exiting.")
            break

        # ESC to exit
        if cv2.waitKey(1) & 0xFF == 27:
            print("[INFO] ESC pressed. Exiting.")
            break

    # Cleanup
    for tracker in trackers:
        tracker.release()

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
