# Render Deployment Fix

## Executive Summary

Render failed because the service was building from the repository root while the Python application lives in `backend/`. The backend is valid: `backend/requirements.txt` exists, `backend/app/main.py` exposes the FastAPI `app`, and the correct import path is `app.main:app`.

The professional fix is to deploy Render with `backend` as the service root. A root-level `render.yaml` has also been added as a guardrail so Blueprint-based deployments use the correct directory automatically.

## Incident Signature

```text
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
Build failed.
```

This happens when Render runs:

```text
pip install -r requirements.txt
```

from the repository root instead of `backend/`.

## Required Render Settings

| Setting | Value |
| --- | --- |
| Service Type | Web Service |
| Repository | `GhariebML/Bingo` |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |
| Health URL | `https://bingo-backend-8dub.onrender.com/health` |

## Required Environment Variables

```env
APP_ENV=production
AI_PROVIDER=mock
ENABLE_REAL_AI=false
DATABASE_URL=sqlite:///./bingo.db
CORS_ORIGINS=https://YOUR-VERCEL-FRONTEND-URL.vercel.app,http://localhost:3000
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=none
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
HF_TOKEN=
HF_MODEL=
```

Do not add real provider keys or set `ENABLE_REAL_AI=true` until clinical, legal, privacy, security, accessibility, and safety reviews are complete.

## Repository Safeguard

`render.yaml` defines the backend service with:

```yaml
rootDir: backend
buildCommand: pip install -r requirements.txt
startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
healthCheckPath: /health
```

Manual Render services should still set Root Directory to `backend` in the dashboard.

## Local Verification

Run from the repository root:

```powershell
cd backend
python -m pip install -r requirements.txt
python -c "from app.main import app; print(app)"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

In another terminal:

```powershell
Invoke-WebRequest http://localhost:8000/health
```

Expected response:

```json
{"status":"ok","service":"bingo-api"}
```

## Post-Deploy Acceptance Criteria

- Render build completes without `requirements.txt` errors.
- `/health` returns HTTP 200.
- `/docs` loads.
- `/api/v1/chat` responds using the mock provider.
- Render logs do not show missing package, import path, or real-AI credential errors.

## Rollback

If deployment fails after applying these settings, revert only the Render dashboard configuration to the last known working service settings. Do not remove the safety defaults and do not enable real AI as a workaround.
