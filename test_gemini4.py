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

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GENAI_API_KEY}"
resp = requests.post(url, headers=headers, json=payload)
print(f"MODEL gemini-flash-latest: STATUS {resp.status_code}")
print(resp.json())

url2 = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GENAI_API_KEY}"
resp2 = requests.post(url2, headers=headers, json=payload)
print(f"MODEL gemini-2.5-flash: STATUS {resp2.status_code}")
print(resp2.json())
