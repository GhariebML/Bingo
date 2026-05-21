# OpenClaw Prompt — Bingo Full MVP Upgrade

## Project Context

You are a senior full-stack engineer, AI product architect, UI/UX designer, and AI safety engineer.

We are working on a project called:

**Bingo — AI Mental Wellness Companion**

Current project path:

```powershell
C:\Users\Admin\Downloads\Bingo\bingo-ai-mental-wellness
```

Current status:

- The project scaffold is already created.
- Frontend is running at: `http://localhost:3000`
- Backend health endpoint is running at: `http://localhost:8000/health`
- Backend tests passed before.
- Frontend typecheck/build passed before.
- The current UI has basic pages: Chat, Dashboard, Journal, Exercises, Safety, Settings.
- The current UI is functional but still looks simple and needs stronger product design.
- The current chat uses mock AI responses and needs to become more professional and realistic.
- There are Bingo image assets inside the project folder or parent Bingo folder. Inspect the project and available assets carefully, then use the Bingo images professionally in the frontend UI.

---

## Important Rules

- Inspect the full project first.
- Do not overwrite important files blindly.
- Do not delete existing assets.
- Do not commit or push anything.
- Do not expose any API keys.
- Keep the app safe: Bingo is not a therapist, doctor, emergency responder, or crisis line.
- The final system should work locally end-to-end with frontend and backend.
- If real AI API keys are missing, use a safe mock provider automatically.
- Make the code clean, modular, documented, and ready for future production development.

---

## Main Goal

Turn the current scaffold into a polished, connected MVP where:

1. The frontend calls the backend chat API.
2. The backend agent returns professional supportive responses.
3. Safety guardrails are applied before and after AI generation.
4. The UI looks beautiful, calming, modern, and branded with Bingo images.
5. The dashboard, journal, exercises, safety, and settings pages feel like one complete product.

---

# Part 1 — Project Inspection

First, inspect:

- frontend structure
- backend structure
- docs folder
- assets/public folder
- parent Bingo folder if needed
- available Bingo images
- current routes
- current components
- current backend services
- current tests

Then write a short internal plan before editing.

Do not move existing files unless necessary.

---

# Part 2 — Frontend Design Upgrade

Improve the UI/UX professionally.

Use a calm mental wellness visual identity inspired by ocean, sky, sand, and Bingo.

## Suggested Color Palette

```text
Deep Ocean Blue: #083A5C
Ocean Navy: #062B44
Soft Sky Blue: #DDF4FF
Calm Mint: #B8EBD9
Warm Sand: #F7E8C9
Soft Cream: #FFF9EF
White Cards: #FFFFFF
Text Dark: #102A43
Muted Text: #52677A
Safety Soft Red: #FFE8E8
Safety Red: #D64545
```

## Design Requirements

- Add a more professional landing/home section if missing.
- Improve navbar spacing, active states, and responsive behavior.
- Use Bingo image assets in:
  - landing hero
  - chat assistant avatar
  - empty states
  - dashboard wellness card
  - exercises page illustration
  - safety page friendly visual
- Create or improve reusable UI components:
  - AppShell
  - Navbar
  - PageHeader
  - Card
  - Button
  - Badge
  - Input/Textarea
  - ChatBubble
  - BingoAvatar
  - SafetyNotice
  - EmptyState
  - StatCard
  - ExerciseCard
- Add gradients, shadows, spacing, and rounded cards professionally.
- Improve mobile responsiveness.
- Avoid clutter.
- Make the app presentation-ready.

## Image Asset Requirement

Use the Bingo images from inside the project or parent Bingo folder.

If images are not already in `frontend/public`, copy selected images into:

```text
frontend/public/bingo/
```

Use clear filenames such as:

```text
bingo-hero.png
bingo-avatar.png
bingo-calm.png
bingo-ocean.png
bingo-support.png
```

Reference them using the Next.js `Image` component where appropriate.

---

# Part 3 — Real Frontend-Backend Connection

Currently the chat may be static or mostly mock-based. Make it truly connected.

## Frontend Requirements

The Chat page should call the backend endpoint:

```http
POST http://localhost:8000/api/v1/chat
```

or the existing backend chat route if already defined.

Use environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Add frontend API client in:

```text
frontend/src/lib/api.ts
```

Add typed interfaces in:

```text
frontend/src/types/chat.ts
```

Add a clean `useChat` hook:

```text
frontend/src/hooks/useChat.ts
```

The Chat page should:

- show initial Bingo greeting
- allow user input
- display user messages
- display Bingo responses from backend
- show loading state
- handle backend errors gracefully
- show safety disclaimer
- show quick-start prompts

Quick-start prompts should send real messages to backend:

- I feel anxious
- I am overthinking
- I had a bad day
- I need motivation
- Help me calm down
- I need to make a difficult decision

---

# Part 4 — Backend Agent System

Improve the backend AI agent architecture.

Create or improve:

```text
backend/app/services/agent_service.py
backend/app/services/chat_service.py
backend/app/services/safety_service.py
backend/app/ai/providers/base.py
backend/app/ai/providers/mock_provider.py
backend/app/ai/providers/openai_provider.py
backend/app/ai/providers/openrouter_provider.py
backend/app/ai/guardrails/crisis_detector.py
backend/app/ai/guardrails/response_validator.py
backend/app/ai/prompts/system_prompt.md
backend/app/ai/prompts/crisis_prompt.md
```

## Agent Behavior

Bingo should respond as a warm AI mental wellness companion.

Response structure:

1. Validate the user’s feeling.
2. Briefly reflect the problem.
3. Ask one gentle question.
4. Suggest one small safe next step.

Tone:

- warm
- calm
- non-judgmental
- emotionally intelligent
- simple language
- not too long
- practical
- never dramatic
- never medicalizing

Bingo must never:

- claim to be a licensed therapist
- diagnose the user
- prescribe medication
- replace professional therapy
- replace emergency care
- provide harmful instructions
- encourage dependency on the chatbot

Supported categories:

- anxiety
- overthinking
- sadness
- stress
- lack of motivation
- loneliness
- decision-making
- bad day
- study/work pressure
- general emotional support
- crisis/high-risk messages

## AI Provider Behavior

If no real provider key exists:

- use `mock_provider` automatically
- return high-quality deterministic supportive responses based on user intent

If provider keys exist later:

- allow switching through `.env`:

```env
AI_PROVIDER=mock | openai | openrouter
OPENAI_API_KEY=
OPENAI_MODEL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

Do not make real API calls unless keys and provider are explicitly configured.

---

# Part 5 — Safety and Crisis Handling

Strengthen safety.

Add crisis detection for messages involving:

- self-harm
- suicide
- wanting to die
- harming others
- abuse
- immediate danger
- overdose
- severe crisis wording

## When Crisis Is Detected

- do not continue normal coaching
- do not provide analysis or debate
- return a short crisis-safe message
- encourage contacting local emergency services immediately
- encourage reaching out to a trusted person now
- suggest moving away from anything that could be used for harm
- keep tone warm and urgent
- do not include harmful details

Crisis response example:

```text
I’m really sorry you’re feeling this. Your safety matters most right now. Please contact local emergency services immediately, or reach out to someone you trust and stay with them. If you can, move away from anything you could use to hurt yourself. You don’t have to handle this alone.
```

## Response Validation

Add response validation to:

- remove diagnostic claims
- remove medication advice
- prevent harmful details
- make sure safety disclaimer is respected

Add tests for:

- normal chat response
- overthinking response
- anxiety response
- crisis detection
- crisis-safe response
- no diagnosis
- no medication advice
- backend health

---

# Part 6 — Dashboard Page Improvement

Improve Dashboard.

It should show:

- mood check-ins count
- journal entries count
- exercises tried
- mood trend mock chart or clean progress bars
- most common emotion tags
- suggested exercise based on current mood
- Today’s reflection card
- Bingo image/illustration card

Use mock data for now, but structure code so later it can connect to backend.

Make it visually beautiful and consistent.

---

# Part 7 — Journal Page Improvement

Improve Journal page.

Add:

- journal entry form
- prompt cards:
  - What happened today?
  - What emotion was strongest?
  - What thought kept repeating?
  - What is one small step I can take?
- emotion tags:
  - calm
  - anxious
  - sad
  - stressed
  - hopeful
  - tired
  - grateful
  - confused
- mock saved entries
- optional AI reflection button placeholder

If backend journal routes exist:

- connect frontend to backend where possible.

If not fully ready:

- keep local mock state but create API-ready structure.

---

# Part 8 — Exercises Page Improvement

Improve Exercises page with interactive cards.

Exercises:

1. 4-7-8 breathing
2. 5-4-3-2-1 grounding
3. Thought reframing
4. Worry parking
5. One small step planning
6. Calm body scan
7. Study/work reset

Each exercise card should include:

- title
- time estimate
- purpose
- steps
- Start exercise button
- calm visual style

Optional:

- Add a simple breathing timer component if easy.
- Add recommended for anxiety/stress/overthinking tags.

---

# Part 9 — Safety Page Improvement

Improve Safety page to be very clear and professional.

Sections:

- What Bingo can help with
- What Bingo cannot do
- Crisis guidance
- Privacy and data note
- When to seek professional help
- Emergency disclaimer

Use friendly language and safety-first design.

Add Bingo image but keep page serious and trustworthy.

---

# Part 10 — Settings Page Improvement

Improve Settings page.

Add UI controls/placeholders for:

- preferred language: English / Arabic / Both
- response style: short / balanced / detailed
- crisis resources region placeholder
- data privacy options placeholder
- export journal placeholder
- reset mock data placeholder

No need for full persistence yet, but structure it cleanly.

---

# Part 11 — Backend API Requirements

Ensure backend has working endpoints:

## Health

```http
GET /health
```

## Chat

```http
POST /api/v1/chat
```

Request:

```json
{
  "message": "I am overthinking",
  "mood": "anxious",
  "conversation_id": "optional"
}
```

Response:

```json
{
  "reply": "...",
  "risk_level": "low | medium | high | crisis",
  "category": "overthinking",
  "suggested_exercise": "Worry parking",
  "safety_triggered": false
}
```

## Exercises

```http
GET /api/v1/exercises
```

Returns list of exercises.

## Mood Trend

```http
GET /api/v1/mood/mock-trend
```

Returns mock mood trend.

## Journal

```http
POST /api/v1/journal
```

Creates mock journal entry or returns placeholder success.

Make sure CORS allows the frontend local origin:

```text
http://localhost:3000
```

---

# Part 12 — Documentation

Create or update:

```text
docs/FULL_SYSTEM_REPORT.md
docs/AGENT_DESIGN.md
docs/AI_SAFETY_REVIEW.md
docs/FRONTEND_BACKEND_INTEGRATION.md
docs/NEXT_STEPS.md
```

## FULL_SYSTEM_REPORT.md Should Include

- project overview
- architecture
- frontend pages
- backend services
- safety design
- how to run
- what is mock now
- what is ready for real AI integration
- future roadmap

---

# Part 13 — Verification

After all changes, run:

## Backend

```powershell
cd C:\Users\Admin\Downloads\Bingo\bingo-ai-mental-wellness\backend
pytest
```

## Frontend

```powershell
cd C:\Users\Admin\Downloads\Bingo\bingo-ai-mental-wellness\frontend
npm run typecheck
npm run build
```

If either fails:

- fix the issue
- rerun until clean

Then start or confirm servers:

## Backend Server

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Server

```powershell
npm run dev
```

---

# Part 14 — Final Response Format

When finished, report:

1. Summary of improvements
2. Files changed/created
3. Backend endpoints added/verified
4. Frontend pages improved
5. Bingo images used and where
6. Safety improvements
7. Test/build results
8. How to run the project
9. Remaining recommended next steps
10. Confirm no commit or push was made

---

## Final Reminder

Do not commit.  
Do not push.  
Do not use real API calls unless explicitly configured.  
Make the MVP polished, integrated, safe, and demo-ready.
