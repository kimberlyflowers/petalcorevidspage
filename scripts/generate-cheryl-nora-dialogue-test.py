#!/usr/bin/env python3
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "riche-creme-dialogue-tests" / "cheryl-nora-002"
FALLBACK_ENV_DIR = Path("/Users/kimberlyflowersmini2/Documents/testimonials - bloomie staffing/railway-vars")

CHERYL_FINAL_VOICE_ID = "xOCHfbq27mSubcbvpiiv"
NORA_VOICE_ID = "XFGMLu5K9PoKI0oN5jnN"

INPUTS = [
    {
        "speaker": "Cheryl",
        "voice_id": CHERYL_FINAL_VOICE_ID,
        "text": "[warm, listening] Nora, I'm so glad you're here. You told me your cheeks and around your mouth still felt tight after your whole routine. What was that like before Riche Creme?",
    },
    {
        "speaker": "Nora",
        "voice_id": NORA_VOICE_ID,
        "text": "[natural, relieved] Yeah, that was it. My skin didn't always look awful, but it felt uncomfortable. I'd wash my face, put on products, and an hour later my cheeks felt tight again.",
    },
    {
        "speaker": "Cheryl",
        "voice_id": CHERYL_FINAL_VOICE_ID,
        "text": "[gently affirming] That's such a real thing. It's not always dramatic. It's just your face never feels fully comfortable. So when you first pressed this cream in, what changed?",
    },
    {
        "speaker": "Nora",
        "voice_id": NORA_VOICE_ID,
        "text": "[small smile in the voice] First, comfort. It felt rich, but it spread easily. I pressed it into my cheeks and around my mouth, and my skin finally felt cared for instead of tight.",
    },
    {
        "speaker": "Cheryl",
        "voice_id": CHERYL_FINAL_VOICE_ID,
        "text": "[softly excited] And when you look at your after photo, what do you notice?",
    },
    {
        "speaker": "Nora",
        "voice_id": NORA_VOICE_ID,
        "text": "[honest testimonial tone] My skin looks softer. More hydrated. Still like me, just more rested. And my makeup didn't catch on those dry-looking areas the same way.",
    },
    {
        "speaker": "Cheryl",
        "voice_id": CHERYL_FINAL_VOICE_ID,
        "text": "[confident, to the live audience] That's the story right there. Easy to use, feels great, skin feels nourished, and visually it looks better. If Nora's story sounds like your skin, Riche Creme is pinned below.",
    },
]


def load_env_file(path: Path) -> dict[str, str]:
    values = {}
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def load_api_key() -> str:
    for key_name in ("ELEVENLABS_API_KEY", "XI_API_KEY"):
        value = os.environ.get(key_name)
        if value:
            return value

    candidates = [FALLBACK_ENV_DIR / "all-prefixed.env"]
    services_dir = FALLBACK_ENV_DIR / "services"
    if services_dir.exists():
        candidates.extend(sorted(services_dir.glob("*.env")))

    for path in candidates:
        values = load_env_file(path)
        for key_name in ("ELEVENLABS_API_KEY", "XI_API_KEY"):
            if values.get(key_name):
                return values[key_name]

    raise SystemExit("ELEVENLABS_API_KEY or XI_API_KEY was not found.")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    api_key = load_api_key()
    payload = {
        "inputs": [{"text": item["text"], "voice_id": item["voice_id"]} for item in INPUTS],
        "model_id": "eleven_v3",
        "language_code": "en",
        "seed": 710202,
        "settings": {
            "stability": 0.42,
            "similarity_boost": 0.86,
            "style": 0.34,
            "use_speaker_boost": True,
            "speed": 0.97,
        },
    }
    url = "https://api.elevenlabs.io/v1/text-to-dialogue?" + urlencode(
        {"output_format": "mp3_44100_128"}
    )
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=240) as response:
            audio = response.read()
    except HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"ElevenLabs dialogue generation failed: HTTP {exc.code}\n{details}") from exc

    audio_path = OUTPUT_DIR / "cheryl-nora-dialogue-test-002.mp3"
    audio_path.write_bytes(audio)

    script_text = "\n\n".join(f"{item['speaker']}: {item['text']}" for item in INPUTS)
    (OUTPUT_DIR / "dialogue-script.txt").write_text(script_text + "\n", encoding="utf-8")
    (OUTPUT_DIR / "dialogue-script.json").write_text(
        json.dumps({"characters": len(script_text), **payload}, indent=2) + "\n",
        encoding="utf-8",
    )

    print(audio_path)
    print(OUTPUT_DIR / "dialogue-script.txt")


if __name__ == "__main__":
    main()
