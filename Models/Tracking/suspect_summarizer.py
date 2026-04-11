# suspect_summarizer.py
from typing import Iterable
import requests
from google import genai
from google.genai import types

# ================================
# GEMINI CONFIG
# ================================
GEMINI_API_KEY = "AIzaSyCHUI_vHgtdHsKAGSjRiex5bgkNq7S1FOY"
client = genai.Client(api_key=GEMINI_API_KEY)


# ================================
# CREATE INCIDENT SUMMARY FOR SUSPECT DETECTION
# ================================
def summarize_suspect_detection(
    snapshot_url: str,
    suspect_name: str,
    camera_id: str,
    appearance: str,
) -> str:
    """
    Generate a short security-oriented incident summary
    for the FIRST suspect detection frame.

    Returns a short summary (10–15 words).
    """

    base_prompt = (
        "Analyze the attached surveillance image and generate EXACTLY one security observation.\n"
        "Focus strictly on visible posture, actions, behavior, and threat indicators.\n"
        "Do NOT add assumptions or identity claims beyond the given metadata.\n\n"
        f"Camera ID: {camera_id}\n"
        f"Suspect: {suspect_name}\n"
        f"Appearance details: {appearance}\n\n"
        "The final answer must:\n"
        "- Contain ONLY ONE sentence\n"
        "- Be under 15 words\n"
        "- Be security-oriented and objective"
    )

    try:
        # Download snapshot
        resp = requests.get(snapshot_url, timeout=5)
        resp.raise_for_status()
        image_bytes = resp.content

        # Convert to Gemini Image Part
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/jpeg"
        )

        # Gemini multimodal request
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[base_prompt, image_part],
        )

        text = (response.text or "").strip()
        if not text:
            raise ValueError("Gemini returned empty summary")

        return text

    except Exception as e:
        print(f"⚠️ Gemini summary failed: {e}")
        return (
            f"Suspect {suspect_name} detected on camera {camera_id}. "
            f"Appearance: {appearance}"
        )


# ================================
# TITLE GENERATOR
# ================================
def generate_suspect_title(suspect_name: str) -> str:
    """Creates a short title for MongoDB record."""
    return f"{suspect_name} detected"
