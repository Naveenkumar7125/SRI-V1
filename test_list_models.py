import os
import requests
from dotenv import load_dotenv

load_dotenv("backend/.env")
GENAI_API_KEY = os.environ.get("API_KEY")

if not GENAI_API_KEY:
    print("API_KEY not found in .env")
else:
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GENAI_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if 'models' in data:
        for m in data['models']:
            print(f"Name: {m.get('name')}, version: {m.get('version')}, support: {m.get('supportedGenerationMethods')}")
    else:
        print("Error listing models:", data)
