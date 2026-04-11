import os
import base64
import requests

GENAI_API_KEY = "AIzaSyARw966TfWVlXPpRqW7l8vFExZJ-qCBXm8"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GENAI_API_KEY}"

# Dummy 1x1 black pixel image base64
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
resp = requests.post(url, headers=headers, json=payload)
print("STATUS CODE:", resp.status_code)
print("RESPONSE:", resp.json())
