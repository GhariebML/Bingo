# Deployment Troubleshooting

Use this runbook after pushing the deployment fix and redeploying Vercel and Render.

## Quick Triage

| Symptom | Most likely cause | First check |
| --- | --- | --- |
| Render cannot find `requirements.txt` | Render root directory is wrong | Render Root Directory must be `backend` |
| Render import error for `app.main` | Start command is running outside `backend` | Service root and start command |
| Vercel shows `404: NOT_FOUND` | Vercel deployed repo root instead of frontend | Vercel Root Directory must be `frontend` |
| Browser blocks API calls | Missing deployed frontend origin in CORS | Render `CORS_ORIGINS` |
| Frontend calls localhost | Vercel API env var is wrong or stale | `NEXT_PUBLIC_API_BASE_URL` and redeploy |
| Real AI credentials error | Real AI enabled accidentally | `AI_PROVIDER=mock`, `ENABLE_REAL_AI=false` |

## Render: requirements.txt Not Found

Error:

```text
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

Resolution:

- Set Render Root Directory to `backend`.
- Keep Build Command as `pip install -r requirements.txt`.
- Keep Start Command as `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Confirm `backend/requirements.txt` exists on the deployed GitHub branch.

## Render: App Import Failed

Resolution:

- Confirm Render is running from `backend`.
- Confirm `backend/app/main.py` contains the exported `app`.
- Run this locally from `backend`:

```powershell
python -c "from app.main import app; print(app)"
```

## Vercel: 404 NOT_FOUND

Resolution:

- Set Vercel Root Directory to `frontend`.
- Set Framework Preset to `Next.js`.
- Set Install Command to `npm install`.
- Set Build Command to `npm run build`.
- Set Output Directory to `.next`.
- Confirm `frontend/src/app/page.tsx` exists.
- Redeploy after changing project settings.

## Frontend Calls Localhost in Production

Resolution:

- Set Vercel `NEXT_PUBLIC_API_BASE_URL=https://bingo-backend-8dub.onrender.com`.
- Redeploy Vercel after changing the variable.
- Confirm browser network requests no longer target `localhost`.

## CORS Blocked in Browser

Resolution:

- Set Render `CORS_ORIGINS` to include the exact Vercel origin and local development:

```env
CORS_ORIGINS=https://YOUR-VERCEL-FRONTEND-URL.vercel.app,http://localhost:3000
```

- Do not use wildcard `*` in production unless it is explicitly temporary and documented.
- Redeploy Render after changing backend environment variables.

## Demo Login or Dashboard Fails

Resolution:

- For separate Vercel and Render domains, set:

```env
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=none
```

- Confirm Vercel is using HTTPS.
- Confirm the backend response includes the session cookie.

## Real AI Accidentally Enabled

Resolution:

- Keep Render environment variables:

```env
AI_PROVIDER=mock
ENABLE_REAL_AI=false
```

- Remove real provider keys until safety, clinical, legal, privacy, security, and accessibility reviews are complete.

## End-to-End Smoke Check

Run:

```powershell
.\scripts\check_deployment.ps1 `
  -FrontendUrl "https://YOUR-VERCEL-FRONTEND-URL.vercel.app" `
  -BackendUrl "https://bingo-backend-8dub.onrender.com"
```

The script checks backend health, API docs, mock chat, exercises, demo login, dashboard summary, safety disclaimer, and the frontend URL.
