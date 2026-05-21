# Bingo - AI Mental Wellness Companion

Bingo is a warm, safety-first web application for emotional support, stress reflection, journaling, mood tracking, and guided mental wellness exercises.

Important: Bingo is not a licensed therapist, does not diagnose mental disorders, and does not prescribe medication. If someone may be in immediate danger, the product must switch to crisis-safe response mode and encourage contacting local emergency services and a trusted person immediately.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Python FastAPI
- Database: PostgreSQL for production
- AI: Provider abstraction for OpenAI, OpenRouter, and Hugging Face, currently mocked
- DevOps: Docker Compose, GitHub Actions, security scan workflow

## Quick Start

```powershell
cd bingo-ai-mental-wellness
Copy-Item .env.example .env
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item backend/.env.example backend/.env
.\scripts\run_dev.ps1
```

Manual backend setup:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Manual frontend setup:

```powershell
cd frontend
npm install
npm run dev
```

## Local URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

## Deployment

Bingo is deployed as a monorepo:

- Frontend: Vercel project rooted at `frontend`
- Backend: Render Web Service rooted at `backend`
- Database: SQLite for demo deployment; managed PostgreSQL before real production users
- AI: Mock provider by default. Real providers require `ENABLE_REAL_AI=true`, a configured provider key, and completed safety, clinical, legal, privacy, security, and accessibility reviews.

Render backend settings:

```text
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Health Check Path: /health
```

Vercel frontend settings:

```text
Root Directory: frontend
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Required frontend environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://bingo-backend-8dub.onrender.com
NEXT_PUBLIC_APP_MODE=demo
```

Required backend environment variables:

```env
APP_ENV=production
AI_PROVIDER=mock
ENABLE_REAL_AI=false
DATABASE_URL=sqlite:///./bingo.db
CORS_ORIGINS=https://YOUR-VERCEL-FRONTEND-URL.vercel.app,http://localhost:3000
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=none
```

Deployment links:

- Frontend: <Vercel URL>
- Backend: https://bingo-backend-8dub.onrender.com
- Backend health: https://bingo-backend-8dub.onrender.com/health
- Backend docs: https://bingo-backend-8dub.onrender.com/docs

Primary deployment runbooks:

- `docs/RENDER_DEPLOYMENT_FIX.md`
- `docs/VERCEL_DEPLOYMENT_FIX.md`
- `docs/DEPLOYMENT_TROUBLESHOOTING.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/POST_DEPLOYMENT_REPORT.md`

## Repository Layout

- `frontend/` - Next.js user interface
- `backend/` - FastAPI services, AI guardrails, schemas, tests
- `docs/` - product, architecture, safety, and deployment documentation
- `data/` - sample seed data and safety examples
- `scripts/` - setup and local development helpers

## Safety Principles

- Never claim to be a therapist or medical professional.
- Never diagnose conditions or prescribe medication.
- Never provide instructions for self-harm, violence, abuse, or evading help.
- Escalate crisis language to crisis-safe response mode.
- Encourage emergency services and trusted-person contact when immediate danger is present.

See `docs/AI_SAFETY_GUIDELINES.md` for the detailed policy.
