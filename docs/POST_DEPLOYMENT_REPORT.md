# Post-Deployment Report

## Deployment Summary

Bingo is deployed as a monorepo with a Vercel-hosted Next.js frontend and a Render-hosted FastAPI backend. The application is intended to remain demo-ready and safety-first, with mock AI enabled by default.

## Live URLs

| Service | URL |
| --- | --- |
| Frontend | `https://your-vercel-frontend-url.vercel.app` |
| Backend | `https://bingo-backend-8dub.onrender.com` |
| Backend health | `https://bingo-backend-8dub.onrender.com/health` |
| Backend docs | `https://bingo-backend-8dub.onrender.com/docs` |

## Platform Configuration

| Platform | Required root | Build | Start/output |
| --- | --- | --- | --- |
| Render | `backend` | `pip install -r requirements.txt` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Vercel | `frontend` | `npm run build` | `.next` |

## Environment Summary

Frontend:

- `NEXT_PUBLIC_API_BASE_URL=https://bingo-backend-8dub.onrender.com`
- `NEXT_PUBLIC_APP_MODE=demo`

Backend:

- `APP_ENV=production`
- `AI_PROVIDER=mock`
- `ENABLE_REAL_AI=false`
- `DATABASE_URL=sqlite:///./bingo.db` for demo deployment
- `CORS_ORIGINS=<vercel-url>,http://localhost:3000`
- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAMESITE=none`

Secrets must stay in Vercel and Render environment settings. Do not document real key values in this repository.

## Acceptance Check

Run the deployment smoke test after both services are redeployed:

```powershell
.\scripts\check_deployment.ps1 `
  -FrontendUrl "https://your-vercel-frontend-url.vercel.app" `
  -BackendUrl "https://bingo-backend-8dub.onrender.com"
```

Expected result:

- Backend health passes.
- Backend docs load.
- Mock chat endpoint responds.
- Exercises endpoint responds.
- Demo login succeeds.
- Dashboard summary loads after demo login.
- Safety disclaimer loads.
- Frontend URL returns the Bingo app, not Vercel `404: NOT_FOUND`.

## Local Verification Baseline

Before committing deployment changes, run:

- Backend `pytest`.
- Frontend `npm run typecheck`.
- Frontend `npm run build`.
- Frontend `npm run test:e2e` when Playwright dependencies are available.

## Known Limitations

- Render free services may cold start, so the first request can be slow.
- SQLite is acceptable for demo deployment but should be replaced with managed PostgreSQL before real users.
- Cookie-authenticated unsafe methods still need CSRF protection before production use.
- Real AI remains blocked until clinical, legal, privacy, security, accessibility, and safety reviews are complete.

## Next Actions

1. Commit and push the deployment fix after approval.
2. Redeploy Render and Vercel from `main`.
3. Replace the Vercel placeholder in `CORS_ORIGINS` with the exact deployed frontend URL.
4. Run `scripts/check_deployment.ps1` against the live services.
5. Review Render logs after the first cold start.
