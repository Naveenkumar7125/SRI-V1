import os
import cv2
import torch
import numpy as np
from facenet_pytorch import InceptionResnetV1, MTCNN
from sklearn.metrics.pairwise import cosine_similarity

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# ---------------------------
# Known Faces
# ---------------------------
def load_known_faces(folder_path):
    known_embeddings, known_names = [], []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
            path = os.path.join(folder_path, filename)
            image = cv2.imread(path)
            if image is None: continue
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            boxes, _ = mtcnn.detect(image_rgb)
            if boxes is not None:
                for box in boxes:
                    face_tensor = extract_face(image_rgb, box)
                    if face_tensor is not None:
                        embedding = compute_embedding(face_tensor)
                        if embedding is not None:
                            known_embeddings.append(embedding)
                            known_names.append(os.path.splitext(filename)[0])
    return known_embeddings, known_names

def extract_face(image, box):
    x1, y1, x2, y2 = [max(0, int(c)) for c in box]
    face = image[y1:y2, x1:x2]
    if face.size == 0: return None
    face_resized = cv2.resize(face, (160, 160))
    face_tensor = torch.tensor(face_resized).permute(2,0,1).unsqueeze(0).float()/255.0
    return face_tensor.to(device)

def compute_embedding(face_tensor):
    with torch.no_grad():
        return resnet(face_tensor).cpu().numpy().flatten()

def recognize_faces(image, known_embeddings, known_names, threshold=0.45):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    boxes, _ = mtcnn.detect(image_rgb)
    results = []
    if boxes is not None:
        for box in boxes:
            face_tensor = extract_face(image_rgb, box)
            if face_tensor is not None:
                embedding = compute_embedding(face_tensor)
                sims = [cosine_similarity([embedding],[k])[0,0] for k in known_embeddings]
                idx = np.argmax(sims)
                score = sims[idx]
                name = known_names[idx] if score > threshold else "Unknown"
                results.append((name, score, box))
    return results