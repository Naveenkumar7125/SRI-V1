import os
import requests
from dotenv import load_dotenv

load_dotenv("backend/.env")
GENAI_API_KEY = os.environ.get("API_KEY")

img_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

payload = {
    "contents": [{
        "parts": [
            {"text": "What is this?"},
            {"inline_data": {"mime_type": "image/png", "data": img_b64}}
        ]
    }]
}
headers = {"Content-Type": "application/json"}

for model in ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-pro-vision"]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GENAI_API_KEY}"
    resp = requests.post(url, headers=headers, json=payload)
    print(f"MODEL {model}: STATUS DOCODE {resp.status_code}")
    if resp.status_code == 200:
        print("WORKS!")
        break
    else:
        print(resp.json())

