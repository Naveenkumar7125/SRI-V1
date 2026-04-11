import os
import requests
import time
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

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GENAI_API_KEY}"

print("Hitting gemini-2.5-flash endpoint rapidly...")
for i in range(5):
    resp = requests.post(url, headers=headers, json=payload)
    print(f"Request {i+1} STATUS: {resp.status_code}")
    if resp.status_code != 200:
        print("ERROR:", resp.json())
        break
    time.sleep(1) # simulate rapid requests

