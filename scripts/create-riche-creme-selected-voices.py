#!/usr/bin/env python3
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
AUDITION_DIR = ROOT / "output" / "elevenlabs-riche-creme-guest-auditions-20260716"
MANIFEST_PATH = AUDITION_DIR / "manifest.json"
OUTPUT_PATH = AUDITION_DIR / "selected-voices.json"
DOC_PATH = ROOT / "docs" / "riche-creme-guest-voices.md"
FALLBACK_ENV_DIR = Path("/Users/kimberlyflowersmini2/Documents/testimonials - bloomie staffing/railway-vars")

SELECTIONS = {
    "guest-01-nora": 1,
    "guest-02-elaine": 2,
    "guest-03-tasha": 1,
    "guest-04-marisol": 3,
}


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
        raise SystemExit(f"ElevenLabs create voice failed: HTTP {exc.code}\n{details}") from exc


def main() -> None:
    api_key = load_api_key()
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    selected_records = []

    for guest in manifest["guests"]:
        slug = guest["slug"]
        selected_index = SELECTIONS[slug]
        selected_preview = next(
            preview for preview in guest["previews"] if preview["index"] == selected_index
        )
        played_not_selected = [
            preview["generatedVoiceId"]
            for preview in guest["previews"]
            if preview["index"] != selected_index
        ]
        voice_name = f"Petalcore Riche Creme Guest - {guest['name']}"
        payload = {
            "voice_name": voice_name,
            "voice_description": guest["description"],
            "generated_voice_id": selected_preview["generatedVoiceId"],
            "played_not_selected_voice_ids": played_not_selected,
            "labels": {
                "brand": "Petalcore Beauty",
                "campaign": "Riche Creme Live Shopping",
                "guest": guest["name"],
                "gender": "female",
                "language": "English",
                "use_case": "live shopping testimonial",
            },
        }
        created = request_json("https://api.elevenlabs.io/v1/text-to-voice", api_key, payload)
        selected_records.append(
            {
                "guest": guest["name"],
                "slug": slug,
                "selectedAudition": selected_index,
                "voiceName": voice_name,
                "voiceId": created["voice_id"],
                "generatedVoiceId": selected_preview["generatedVoiceId"],
                "auditionPath": selected_preview["path"],
                "voiceDescription": guest["description"],
                "auditionScript": guest["script"],
                "elevenLabsResponse": {
                    "name": created.get("name"),
                    "category": created.get("category"),
                    "labels": created.get("labels"),
                    "previewUrl": created.get("preview_url"),
                },
            }
        )

    output = {
        "note": "Permanent ElevenLabs voices created from Kimberly's selected auditions: 1,2,1,3.",
        "ttsDefaults": {
            "modelId": "eleven_v3",
            "outputFormat": "mp3_44100_128",
            "voiceSettings": {
                "stability": 0.45,
                "similarity_boost": 0.85,
                "style": 0.34,
                "use_speaker_boost": True,
                "speed": 0.96,
            },
        },
        "voices": selected_records,
    }
    OUTPUT_PATH.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Riche Creme Guest Voices",
        "",
        "Permanent ElevenLabs voices created from the selected audition set: `1,2,1,3`.",
        "",
        "| Guest | Selected audition | ElevenLabs voice name | Voice ID |",
        "| --- | ---: | --- | --- |",
    ]
    for record in selected_records:
        lines.append(
            f"| {record['guest']} | {record['selectedAudition']} | {record['voiceName']} | `{record['voiceId']}` |"
        )
    lines.extend(
        [
            "",
            "Default generation settings:",
            "",
            "```json",
            json.dumps(output["ttsDefaults"], indent=2),
            "```",
            "",
            "Audition MP3s remain local in `output/elevenlabs-riche-creme-guest-auditions-20260716/` because `output/` is gitignored.",
        ]
    )
    DOC_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT_PATH}")
    print(f"Wrote {DOC_PATH}")
    for record in selected_records:
        print(f"{record['guest']}: {record['voiceId']} ({record['voiceName']})")


if __name__ == "__main__":
    main()
