#!/usr/bin/env bash
# Coqui XTTS uses phonemizer → espeak-ng. If the binary is missing (old image), install it at boot.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
if ! command -v espeak-ng >/dev/null 2>&1; then
  echo "[entrypoint] espeak-ng not found; installing..."
  apt-get update -qq
  apt-get install -y --no-install-recommends espeak-ng
fi
exec python -m uvicorn server:app --host 0.0.0.0 --port 8000
