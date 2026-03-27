"""
FastAPI XTTS v2 wrapper. Mount voice reference WAVs at SPEAKER_DIR (e.g. /speakers).
Expects POST /tts JSON: { "text": "...", "voice_id": "name_without_suffix" } → audio/wav
"""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

SPEAKER_DIR = Path(os.environ.get("SPEAKER_DIR", "/speakers")).resolve()
MODEL_NAME = os.environ.get(
    "XTTS_MODEL_NAME", "tts_models/multilingual/multi-dataset/xtts_v2"
)
DEFAULT_LANG = os.environ.get("XTTS_LANG", "en")

app = FastAPI(title="XTTS API", version="1.0.0")


class TtsBody(BaseModel):
    text: str = Field(..., min_length=1, max_length=500_000)
    voice_id: str = Field(..., min_length=1, max_length=512)


_tts = None


def _load_tts():
    global _tts
    if _tts is None:
        import torch
        from TTS.api import TTS

        device = "cuda" if torch.cuda.is_available() else "cpu"
        _tts = TTS(model_name=MODEL_NAME, progress_bar=False)
        _tts.to(device)
    return _tts


def _resolve_speaker_wav(voice_id: str) -> Path:
    # voice_id may be "werewolf" -> /speakers/werewolf.wav
    base = SPEAKER_DIR / voice_id
    if base.is_file():
        return base
    w = SPEAKER_DIR / f"{voice_id}.wav"
    if w.is_file():
        return w
    raise HTTPException(
        status_code=404,
        detail=f"No speaker file for '{voice_id}' under {SPEAKER_DIR}",
    )


@app.get("/health")
def health():
    return {"ok": True, "speaker_dir": str(SPEAKER_DIR)}


@app.post("/tts")
def synthesize(body: TtsBody):
    speaker_wav = _resolve_speaker_wav(body.voice_id.strip())
    out = Path("/tmp/xtts_out.wav")
    try:
        tts = _load_tts()
        tts.tts_to_file(
            text=body.text,
            file_path=str(out),
            speaker_wav=str(speaker_wav),
            language=DEFAULT_LANG,
        )
        data = out.read_bytes()
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e)) from e
    finally:
        if out.exists():
            try:
                out.unlink()
            except OSError:
                pass

    return Response(content=data, media_type="audio/wav")
