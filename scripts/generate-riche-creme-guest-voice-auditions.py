#!/usr/bin/env python3
import base64
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "elevenlabs-riche-creme-guest-auditions-20260716"
FALLBACK_ENV_DIR = Path("/Users/kimberlyflowersmini2/Documents/testimonials - bloomie staffing/railway-vars")

GUESTS = [
    {
        "slug": "guest-01-nora",
        "name": "Nora",
        "seed": 5101,
        "description": (
            "Perfect audio quality. A natural American woman in her early 50s with a warm, grounded, "
            "camera-friendly testimonial voice. She sounds rested, genuine, and comfortable speaking "
            "from her living room on an iPhone tripod. Soft confidence, lightly polished, everyday makeup "
            "energy, kind and relatable, not announcer, not corporate, not theatrical, not elderly. "
            "She should sound like she has been using a rich face cream and is calmly explaining why her "
            "skin feels better."
        ),
        "text": (
            "Honestly, the first thing I noticed was comfort. My cheeks did not feel tight after I put it on.\n\n"
            "And then my makeup started sitting better. It was not a dramatic filter moment. It just looked softer, "
            "more hydrated, and more like me on a good skin day."
        ),
    },
    {
        "slug": "guest-02-elaine",
        "name": "Elaine",
        "seed": 5202,
        "description": (
            "Perfect audio quality. An elegant American woman in her late 50s to early 60s with a clear, bright, "
            "composed testimonial voice. She sounds polished but still like a real customer on a home video call. "
            "Gentle warmth, mature confidence, graceful pacing, subtle smile in the voice, not stiff, not salesy, "
            "not elderly. She can talk naturally about makeup sitting smoother and skin looking fresher."
        ),
        "text": (
            "For me, it was the makeup. Foundation used to catch on dry spots by lunchtime, and I felt like every line "
            "looked louder than it needed to.\n\n"
            "With Riche Creme underneath, my skin looked smoother and calmer. I still looked like myself, just more fresh."
        ),
    },
    {
        "slug": "guest-03-tasha",
        "name": "Tasha",
        "seed": 5303,
        "description": (
            "Perfect audio quality. A Black American woman in her late 40s to early 50s with a warm, expressive, "
            "confident UGC testimonial voice. She is friendly, stylish, and conversational, with grown-woman ease "
            "and a little smile in her delivery. Natural home video-call cadence, believable and trustworthy, not "
            "caricatured, not overly Southern, not announcer, not childish. She sounds happy that her routine feels simpler."
        ),
        "text": (
            "I had too many bottles on my counter, and somehow my skin still looked tired.\n\n"
            "What I liked about Riche Creme is that it made my routine feel finished. Fewer steps, softer-looking skin, "
            "and that little glow I was trying to get all along."
        ),
    },
    {
        "slug": "guest-04-marisol",
        "name": "Marisol",
        "seed": 5404,
        "description": (
            "Perfect audio quality. A warm American woman in her mid-to-late 50s with subtle Latina or Mediterranean "
            "warmth in the voice, but still very clear and natural for a U.S. skincare testimonial. Calm, nurturing, "
            "friendly, and sincere, like she is speaking from her kitchen or living room on an iPhone tripod. Not "
            "announcer, not corporate, not exaggerated accent, not elderly. She sounds rested and pleased with her "
            "night routine results."
        ),
        "text": (
            "I mostly use it at night. I cleanse, press Riche Creme into my cheeks and neck, and keep it simple.\n\n"
            "In the morning, my skin feels softer when I wash my face. It just looks more awake, and that makes me feel better."
        ),
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

    manifest = {
        "modelId": "eleven_ttv_v3",
        "outputFormat": "mp3_44100_128",
        "note": "Generated voice design previews only. Create permanent voices after Kimberly chooses the preferred audition for each guest.",
        "guests": [],
    }

    design_url = "https://api.elevenlabs.io/v1/text-to-voice/design?" + urlencode(
        {"output_format": "mp3_44100_128"}
    )

    for guest in GUESTS:
        guest_dir = OUTPUT_DIR / guest["slug"]
        guest_dir.mkdir(exist_ok=True)

        payload = {
            "voice_description": guest["description"],
            "model_id": "eleven_ttv_v3",
            "text": guest["text"],
            "seed": guest["seed"],
            "guidance_scale": 7,
            "loudness": 0.35,
            "should_enhance": True,
        }
        design = request_json(design_url, api_key, payload)
        previews = design.get("previews") or []
        if not previews:
            raise SystemExit(f"ElevenLabs did not return previews for {guest['name']}.")

        (guest_dir / "voice-description.txt").write_text(guest["description"] + "\n", encoding="utf-8")
        (guest_dir / "audition-script.txt").write_text(guest["text"] + "\n", encoding="utf-8")
        (guest_dir / "voice-design-payload.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        (guest_dir / "voice-design-response.json").write_text(json.dumps(design, indent=2) + "\n", encoding="utf-8")

        preview_records = []
        for index, preview in enumerate(previews, start=1):
            audio_path = guest_dir / f"{guest['slug']}-audition-{index:02d}.mp3"
            audio_path.write_bytes(base64.b64decode(preview["audio_base_64"]))
            record = {
                "index": index,
                "guest": guest["name"],
                "generatedVoiceId": preview["generated_voice_id"],
                "durationSecs": preview.get("duration_secs"),
                "language": preview.get("language"),
                "path": str(audio_path),
            }
            preview_records.append(record)
            (guest_dir / f"{guest['slug']}-audition-{index:02d}.json").write_text(
                json.dumps(record, indent=2) + "\n",
                encoding="utf-8",
            )

        manifest["guests"].append(
            {
                "name": guest["name"],
                "slug": guest["slug"],
                "description": guest["description"],
                "script": guest["text"],
                "previews": preview_records,
            }
        )

    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {manifest_path}")
    for guest in manifest["guests"]:
        print(guest["name"])
        for preview in guest["previews"]:
            print(f"  {preview['index']}: {preview['path']}")


if __name__ == "__main__":
    main()
