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
