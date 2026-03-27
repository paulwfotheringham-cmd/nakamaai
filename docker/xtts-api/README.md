# XTTS API image (Runpod)

FastAPI service: `GET /health`, `POST /tts` with JSON `{ "text": "...", "voice_id": "<stem>" }`.  
Reference speaker files live on a volume mounted at **`/speakers`** (e.g. `werewolf.wav` → `voice_id` `werewolf`).

## 1. Build & push without local Docker (GitHub Actions)

1. Push this repo to GitHub.
2. **Docker Hub**: create an account and an **access token**.  
3. Repo **Settings → Secrets and variables → Actions → Secrets**:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
4. Optional **Variables**: `DOCKERHUB_IMAGE` = `youruser/nakama-xtts-api` (else default is `DOCKERHUB_USERNAME/nakama-xtts-api`).
5. **Actions → “Build and push XTTS API image” → Run workflow** (or push to `main` after changing `docker/xtts-api/`).

First build can take **30–90+ minutes** (large CUDA + Coqui image).

## 2. Runpod

1. **New pod** → use your image, e.g. `docker.io/YOURUSER/nakama-xtts-api:latest`.
2. **GPU** template with enough VRAM for XTTS (often **16GB+** recommended).
3. **Container port**: `8000` → expose HTTP.
4. **Volume** (recommended): mount to **`/speakers`** and upload `*.wav` reference clips there.
5. Copy the pod **public URL** (HTTPS, no trailing slash) into **`XTTS_SERVER_URL`** in `.env.local` and **Vercel** → redeploy the Next app.

## 3. Next.js app

See root **`.env.example`**. The routes **`/api/xtts-tts`** and **`/api/xtts-voices`** proxy to `XTTS_SERVER_URL`.

Your UI must call those routes (or point `fetch` at them) instead of Cartesia when using XTTS.
