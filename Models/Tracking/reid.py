import torch
import torchvision.transforms as T
from PIL import Image
import numpy as np
import torchreid

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load OSNet (best lightweight ReID)
model = torchreid.models.build_model(
    name="osnet_x1_0",
    num_classes=1000,
    pretrained=True
)
model.eval().to(device)

transform = T.Compose([
    T.Resize((256, 128)),
    T.ToTensor(),
    T.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

def extract_reid_embedding(frame, box):
    x1, y1, x2, y2 = map(int, box)
    crop = frame[y1:y2, x1:x2]

    if crop.size == 0:
        return None

    img = Image.fromarray(crop[:, :, ::-1])  # BGR → RGB
    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        emb = model(img).cpu().numpy().flatten()

    # Normalize embedding
    return emb / np.linalg.norm(emb)
