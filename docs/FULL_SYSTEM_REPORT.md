# Bingo Full System Report

## Project Overview
Bingo is an AI mental wellness companion MVP for calm reflection, journaling, mood awareness, and short wellness exercises. It is explicitly not a therapist, doctor, emergency responder, or crisis line.

## Architecture
- Frontend: Next.js, TypeScript, Tailwind, reusable UI components, local API client.
- Backend: FastAPI with versioned routes, provider abstraction, agent service, safety service, and guardrails.
- AI mode: mock provider by default. Real providers are disabled unless keys and provider configuration are explicitly added later.

## Frontend Pages
- Home: branded onboarding and welcome flow using Bingo ocean imagery.
- Chat: connected to `POST /api/v1/chat`, quick prompts, loading states, errors, safety notice, Bingo avatar.
- Dashboard: mock mood trend, stats, tags, suggested exercise, daily reflection.
- Journal: prompts and emotion tags with API-ready structure.
- Exercises: seven guided exercise cards with steps and start actions.
- Safety: crisis guidance, boundaries, privacy note, professional-help guidance.
- Settings: language, response style, region, privacy, export, and reset placeholders.

## Backend Services
- `agent_service.py` coordinates supportive response generation.
- `ai_service.py` selects mock/openai/openrouter providers but only uses real providers when explicitly configured.
- `mock_provider.py` returns deterministic responses by category.
- `safety_service.py`, `crisis_detector.py`, and `response_validator.py` apply pre/post generation guardrails.

## Safety Design
Crisis language triggers a crisis-safe response and bypasses normal coaching. Response validation removes prohibited diagnostic, medication, and therapy-replacement claims. The UI repeats that Bingo is supportive only and not emergency care.

## How To Run
```powershell
cd C:\Users\Admin\Downloads\Bingo\bingo-ai-mental-wellness
.\scripts\run_dev.ps1
```

## Mock Now
Chat responses, mood trends, journal persistence, settings, and exercise progress are mocked.

## Ready For Real AI Integration
The provider interface and environment settings are in place for future OpenAI/OpenRouter integration after safety, privacy, and legal review.

## Future Roadmap
Add auth, database persistence, telemetry-free safety logging, region-specific crisis resources, stronger classifiers, clinician/legal review, and production deployment hardening.
