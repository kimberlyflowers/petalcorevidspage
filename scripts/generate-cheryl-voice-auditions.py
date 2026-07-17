#!/usr/bin/env python3
import base64
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "elevenlabs-cheryl-host-auditions-20260717-v2"
FALLBACK_ENV_DIR = Path("/Users/kimberlyflowersmini2/Documents/testimonials - bloomie staffing/railway-vars")

VOICE_DESCRIPTION = (
    "Perfect audio quality. A natural Black American woman in her mid-to-late 40s or early 50s with a "
    "warm, clear skincare live-shopping host voice. She visually reads polished, elegant, and confident: "
    "a stylish beauty founder sitting in a warm neutral living room, wearing chocolate satin, gold jewelry, "
    "soft glam makeup, and smooth shoulder-length black hair. Her voice should match that presence: "
    "mature, grounded, graceful, and trustworthy, with calm grown-woman confidence and a real conversational "
    "smile. She is the host guiding the room, not a customer testimonial. She speaks directly to women over "
    "45 with gentle authority, natural contractions, and relaxed pacing. Not announcer, not theatrical, "
    "not influencer-y, not overly bubbly, not young, not elderly, not a caricature, no fake Southern accent, "
    "no forced slang, no exaggerated cultural performance."
)

AUDITION_TEXT = (
    "Nora, I'm so glad you're here. You told me your cheeks and around your mouth felt tight even after "
    "you did your whole routine. What was that like before Riche Creme?\n\n"
    "That's such a real thing. It's not always dramatic. It's just that your face never feels fully "
    "comfortable. So when you first pressed the cream in, what changed?\n\n"
    "That's the whole story right there. Easy to use, feels good, skin feels nourished, and visually it "
    "looks better. If Nora's story sounds like your skin, Riche Creme is pinned below."
)


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


def request_json(url: str, api_key: str, payload: dict) -> dict:
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=180) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"ElevenLabs voice design failed: HTTP {exc.code}\n{details}") from exc


def main() -> None:
    api_key = load_api_key()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "voice_description": VOICE_DESCRIPTION,
        "model_id": "eleven_ttv_v3",
        "text": AUDITION_TEXT,
        "seed": 7417,
        "guidance_scale": 8,
        "loudness": 0.25,
        "should_enhance": True,
    }
    design_url = "https://api.elevenlabs.io/v1/text-to-voice/design?" + urlencode(
        {"output_format": "mp3_44100_128"}
    )
    design = request_json(design_url, api_key, payload)
    previews = design.get("previews") or []
    if not previews:
        raise SystemExit("ElevenLabs did not return Cheryl previews.")

    (OUTPUT_DIR / "voice-description.txt").write_text(VOICE_DESCRIPTION + "\n", encoding="utf-8")
    (OUTPUT_DIR / "audition-script.txt").write_text(AUDITION_TEXT + "\n", encoding="utf-8")
    (OUTPUT_DIR / "voice-design-payload.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    (OUTPUT_DIR / "voice-design-response.json").write_text(json.dumps(design, indent=2) + "\n", encoding="utf-8")

    manifest = {
        "host": "Cheryl",
        "modelId": "eleven_ttv_v3",
        "outputFormat": "mp3_44100_128",
        "voiceDescription": VOICE_DESCRIPTION,
        "auditionScript": AUDITION_TEXT,
        "previews": [],
    }
    for index, preview in enumerate(previews, start=1):
        audio_path = OUTPUT_DIR / f"cheryl-host-audition-{index:02d}.mp3"
        audio_path.write_bytes(base64.b64decode(preview["audio_base_64"]))
        record = {
            "index": index,
            "generatedVoiceId": preview["generated_voice_id"],
            "durationSecs": preview.get("duration_secs"),
            "language": preview.get("language"),
            "path": str(audio_path),
        }
        manifest["previews"].append(record)
        (OUTPUT_DIR / f"cheryl-host-audition-{index:02d}.json").write_text(
            json.dumps(record, indent=2) + "\n",
            encoding="utf-8",
        )

    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {manifest_path}")
    for preview in manifest["previews"]:
        print(f"{preview['index']}: {preview['path']}")


if __name__ == "__main__":
    main()
