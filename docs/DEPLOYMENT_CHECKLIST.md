# Deployment Checklist

Use this checklist for the Vercel frontend and Render backend release. Keep the project in demo mode until the safety review gates are complete.

## Pre-Deploy

- [ ] Latest deployment fixes are committed and pushed to `main`.
- [ ] No `.env`, API keys, SQLite databases, build artifacts, reports, or caches are committed.
- [ ] `AI_PROVIDER=mock` and `ENABLE_REAL_AI=false` remain the production defaults.
- [ ] `backend/requirements.txt` exists on GitHub.
- [ ] `frontend/src/app/page.tsx` exists on GitHub.

## Render Backend

- [ ] Service type is Web Service.
- [ ] Repo is `GhariebML/Bingo`.
- [ ] Branch is `main`.
- [ ] Root Directory is `backend`.
- [ ] Runtime is `Python 3`.
- [ ] Build Command is `pip install -r requirements.txt`.
- [ ] Start Command is `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- [ ] Health Check Path is `/health`.
- [ ] `APP_ENV=production`.
- [ ] `AI_PROVIDER=mock`.
- [ ] `ENABLE_REAL_AI=false`.
- [ ] `DATABASE_URL=sqlite:///./bingo.db` for demo, or a managed PostgreSQL URL before real users.
- [ ] `CORS_ORIGINS` includes the exact Vercel URL and `http://localhost:3000`.
- [ ] `AUTH_COOKIE_SECURE=true`.
- [ ] `AUTH_COOKIE_SAMESITE=none`.

## Vercel Frontend

- [ ] Repo is `GhariebML/Bingo`.
- [ ] Branch is `main`.
- [ ] Root Directory is `frontend`.
- [ ] Framework Preset is `Next.js`.
- [ ] Install Command is `npm install`.
- [ ] Build Command is `npm run build`.
- [ ] Output Directory is `.next`.
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://bingo-backend-8dub.onrender.com`.
- [ ] `NEXT_PUBLIC_APP_MODE=demo`.

## Smoke Test

- [ ] Render `/health` returns 200.
- [ ] Render `/docs` loads.
- [ ] Vercel home page loads instead of `404: NOT_FOUND`.
- [ ] Frontend browser requests target the Render backend, not localhost.
- [ ] Mock chat endpoint responds.
- [ ] Exercises endpoint responds.
- [ ] Demo login works.
- [ ] Dashboard summary loads after demo login.
- [ ] Safety disclaimer endpoint responds.

## Safety Gate

- [ ] UI clearly states Bingo is not therapy, medical care, emergency support, or a crisis line.
- [ ] Crisis guidance is visible.
- [ ] Crisis inputs return crisis-safe responses.
- [ ] Safety guardrails run before provider calls.
- [ ] Real AI remains disabled.
- [ ] No user-facing copy claims diagnosis, medication advice, or emergency-service replacement.

## Before Real Users

- [ ] Move from SQLite to managed PostgreSQL.
- [ ] Add CSRF protection for cookie-authenticated unsafe methods.
- [ ] Complete clinical, legal, privacy, security, and accessibility reviews.
- [ ] Run the full end-to-end deployment check script against live URLs.
