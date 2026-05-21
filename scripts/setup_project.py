"""Create the Bingo monorepo scaffold.

The script is intentionally idempotent: existing files are not overwritten unless
their content is identical to the generated starter content.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_text(encoding="utf-8", errors="ignore") != content:
        return
    target.write_text(content, encoding="utf-8", newline="\n")


def write_json(path: str, data: object) -> None:
    write(path, json.dumps(data, indent=2) + "\n")


README = """# Bingo - AI Mental Wellness Companion

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
"""


DOCS = {
    "PROJECT_OVERVIEW.md": "# Project Overview\n\nBingo is an AI mental wellness companion focused on reflective support, journaling, mood tracking, and practical exercises. It is designed as a supportive tool, not a clinical service.\n",
    "PRODUCT_REQUIREMENTS.md": "# Product Requirements\n\n## Core Features\n\n- Warm AI chat with safety boundaries\n- Mood tracking and trends\n- Private journaling\n- Guided grounding, breathing, and reflection exercises\n- Crisis-safe response mode\n- Settings for data, privacy, and personalization\n\n## Non-goals\n\n- Diagnosis\n- Medication advice\n- Therapy replacement\n- Emergency service replacement\n",
    "SYSTEM_ARCHITECTURE.md": "# System Architecture\n\nThe monorepo separates the Next.js frontend from the FastAPI backend. The backend exposes versioned REST APIs, routes requests through service modules, applies AI guardrails before and after model calls, and stores production data in PostgreSQL.\n\n## Backend Flow\n\n1. API route receives validated schema.\n2. Service layer evaluates safety risk.\n3. Crisis detector can force crisis-safe mode.\n4. AI service returns a mock provider response for now.\n5. Response validator removes unsafe claims and applies boundaries.\n",
    "AI_SAFETY_GUIDELINES.md": "# AI Safety Guidelines\n\nBingo must not present itself as a licensed therapist, diagnose mental disorders, prescribe medication, or provide harmful instructions.\n\n## Crisis Handling\n\nIf a user expresses self-harm, suicide, harming others, abuse, or immediate danger, Bingo must switch to crisis-safe response mode. The response should be calm, direct, and brief: encourage contacting local emergency services now, reaching a trusted person, and moving away from immediate means of harm when possible.\n\n## Prohibited Content\n\n- Step-by-step self-harm or violence instructions\n- Encouragement of harm\n- Diagnostic labels as facts\n- Medication prescriptions or dosage changes\n- Claims of guaranteed outcomes\n",
    "PROMPT_DESIGN.md": "# Prompt Design\n\nPrompts live in `backend/app/ai/prompts`. The system prompt defines scope and boundaries. The crisis prompt is used only when the detector flags immediate safety risk. Specialized prompts support journaling, CBT-style reflection, and grounding exercises without clinical claims.\n",
    "API_DOCUMENTATION.md": "# API Documentation\n\nBase path: `/api/v1`\n\n- `GET /health` - service health\n- `POST /api/v1/chat` - mock supportive chat response\n- `POST /api/v1/mood` - record mood entry\n- `POST /api/v1/journal` - create journal entry\n- `GET /api/v1/exercises` - list guided exercises\n- `POST /api/v1/safety/check` - classify safety risk\n",
    "DATABASE_SCHEMA.md": "# Database Schema\n\nPlanned tables: users, chat_sessions, chat_messages, mood_entries, journal_entries, exercises, safety_events. Initial SQLAlchemy models are placeholders so the team can add migrations once persistence requirements are finalized.\n",
    "USER_FLOWS.md": "# User Flows\n\n## Chat\n\nUser opens chat, sees safety banner, sends message, backend checks crisis risk, receives supportive response or crisis-safe response.\n\n## Journal\n\nUser writes private reflection, optionally selects mood, and saves entry for later review.\n\n## Mood\n\nUser records mood label and intensity. Dashboard summarizes recent trend.\n",
    "DEPLOYMENT_GUIDE.md": "# Deployment Guide\n\nUse Docker Compose locally. For production, deploy frontend and backend separately, provision PostgreSQL, set environment variables, enable HTTPS, configure logs, and run security scans in CI before release.\n",
    "ROADMAP.md": "# Roadmap\n\n## Phase 1\n\n- Scaffold app and safety architecture\n- Mock AI providers\n- Initial UI and API modules\n\n## Phase 2\n\n- Authentication and persistence\n- Real provider integration behind safety checks\n- Observability and audit logs\n\n## Phase 3\n\n- Clinical review, localization, accessibility review, production hardening\n",
}


FRONTEND_PAGES = {
    "page.tsx": ("Welcome to Bingo", "A calm workspace for reflection, mood tracking, journaling, and safe support.", "Start with chat"),
    "chat/page.tsx": ("Chat", "Talk through stress, emotions, and next gentle steps with mock AI support.", "Send message"),
    "dashboard/page.tsx": ("Dashboard", "Review mood trends, journal progress, and recent reflections.", "View insights"),
    "journal/page.tsx": ("Journal", "Capture private reflections and notice patterns over time.", "Save entry"),
    "exercises/page.tsx": ("Exercises", "Practice grounding, breathing, and values-based reflection.", "Begin exercise"),
    "settings/page.tsx": ("Settings", "Manage preferences, data choices, and safety resources.", "Save settings"),
    "safety/page.tsx": ("Safety", "Bingo supports reflection but is not a therapist or emergency service.", "Review guidance"),
    "auth/login/page.tsx": ("Log in", "Return to your private wellness workspace.", "Continue"),
    "auth/register/page.tsx": ("Create account", "Set up a private account for mood and journal history.", "Create account"),
}


BACKEND_INIT = "# Package marker for Bingo backend.\n"


def main() -> None:
    for directory in [
        "docs", "frontend/public/illustrations", "frontend/src/app/auth/login",
        "frontend/src/app/auth/register", "frontend/src/app/chat", "frontend/src/app/dashboard",
        "frontend/src/app/journal", "frontend/src/app/exercises", "frontend/src/app/safety",
        "frontend/src/app/settings", "frontend/src/components/ui", "frontend/src/components/layout",
        "frontend/src/components/chat", "frontend/src/components/journal", "frontend/src/components/dashboard",
        "frontend/src/lib", "frontend/src/hooks", "frontend/src/types", "frontend/src/styles",
        "backend/app/api/v1", "backend/app/core", "backend/app/models", "backend/app/schemas",
        "backend/app/services", "backend/app/ai/prompts", "backend/app/ai/guardrails",
        "backend/app/ai/memory", "backend/app/ai/providers", "backend/app/db/migrations",
        "backend/app/utils", "backend/tests", "scripts", "data", "design/wireframes",
        "design/assets", ".github/workflows", ".github/ISSUE_TEMPLATE",
    ]:
        (ROOT / directory).mkdir(parents=True, exist_ok=True)

    write("README.md", README)
    write("LICENSE", "MIT License\n\nCopyright (c) 2026 Bingo contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction.\n")
    write(".gitignore", "node_modules/\n.next/\n.venv/\n__pycache__/\n.pytest_cache/\n.env\n.env.local\n*.pyc\n.DS_Store\ncoverage/\ndist/\n")
    write(".env.example", "POSTGRES_DB=bingo\nPOSTGRES_USER=bingo\nPOSTGRES_PASSWORD=change-me\nDATABASE_URL=postgresql+psycopg://bingo:change-me@localhost:5432/bingo\n")
    write("Makefile", ".PHONY: backend frontend test\nbackend:\n\tcd backend && uvicorn app.main:app --reload\nfrontend:\n\tcd frontend && npm run dev\ntest:\n\tcd backend && pytest\n")
    write("docker-compose.yml", """services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bingo
      POSTGRES_USER: bingo
      POSTGRES_PASSWORD: change-me
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  backend:
    build: ./backend
    env_file: ./backend/.env.example
    ports:
      - "8000:8000"
    depends_on:
      - postgres
  frontend:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8000
volumes:
  postgres_data:
""")

    for name, content in DOCS.items():
        write(f"docs/{name}", content)

    write("docs/IMPLEMENTATION_REPORT.md", """# Implementation Report

Created a professional starter monorepo for Bingo - AI Mental Wellness Companion.

## Included

- Next.js + TypeScript + Tailwind frontend scaffold
- FastAPI backend with health endpoint and versioned API routes
- Mock AI provider abstraction for OpenAI, OpenRouter, and Hugging Face
- Crisis detector and response validator guardrails
- Chat, mood, journal, exercise, and safety service modules
- PostgreSQL-ready Docker Compose setup
- GitHub Actions for frontend CI, backend CI, and security scanning
- Issue templates, PR template, docs, sample data, and PowerShell scripts

## Safety Notes

The current backend returns mock AI responses only. The crisis detector performs keyword-based risk detection as a starter layer. Before production use, replace it with a layered safety system, clinical review, abuse testing, and audited incident logging.
""")

    write("frontend/package.json", json.dumps({
        "name": "bingo-frontend", "version": "0.1.0", "private": True,
        "scripts": {"dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint", "typecheck": "tsc --noEmit"},
        "dependencies": {"@types/node": "^20.12.12", "@types/react": "^19.2.15", "@types/react-dom": "^19.2.3", "next": "^16.2.6", "react": "^19.2.6", "react-dom": "^19.2.6", "lucide-react": "^0.468.0"},
        "devDependencies": {"autoprefixer": "^10.4.19", "eslint": "^9.39.4", "eslint-config-next": "^16.2.6", "postcss": "^8.4.38", "tailwindcss": "^3.4.3", "typescript": "^5.4.5"}
    }, indent=2) + "\n")
    write("frontend/next.config.ts", "import type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n")
    write("frontend/tsconfig.json", json.dumps({"compilerOptions": {"target": "es5", "lib": ["dom", "dom.iterable", "esnext"], "allowJs": True, "skipLibCheck": True, "strict": True, "noEmit": True, "esModuleInterop": True, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": True, "isolatedModules": True, "jsx": "preserve", "incremental": True, "plugins": [{"name": "next"}], "paths": {"@/*": ["./src/*"]}}, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"]}, indent=2) + "\n")
    write("frontend/tailwind.config.ts", "import type { Config } from 'tailwindcss';\n\nconst config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { calm: '#2F6F73', sage: '#8AA399', coral: '#D97862', ink: '#172326' } } }, plugins: [] };\nexport default config;\n")
    write("frontend/postcss.config.js", "module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n")
    write("frontend/.env.example", "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n")
    write("frontend/public/logo.svg", "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\"><rect width=\"120\" height=\"120\" rx=\"24\" fill=\"#2F6F73\"/><circle cx=\"60\" cy=\"48\" r=\"20\" fill=\"#F7F1E8\"/><path d=\"M32 78c14 18 42 22 56 0\" fill=\"none\" stroke=\"#F7F1E8\" stroke-width=\"8\" stroke-linecap=\"round\"/></svg>\n")

    write("frontend/src/app/globals.css", "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { background: #f7f4ef; color: #172326; }\na { color: inherit; text-decoration: none; }\n")
    write("frontend/src/app/layout.tsx", "import './globals.css';\nimport type { Metadata } from 'next';\nimport { Navbar } from '@/components/layout/Navbar';\n\nexport const metadata: Metadata = { title: 'Bingo', description: 'AI mental wellness companion' };\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang=\"en\"><body><Navbar /><main className=\"mx-auto max-w-6xl px-4 py-8\">{children}</main></body></html>;\n}\n")
    for path, (title, body, action) in FRONTEND_PAGES.items():
        write(f"frontend/src/app/{path}", f"import {{ Card }} from '@/components/ui/Card';\nimport {{ Button }} from '@/components/ui/Button';\n\nexport default function Page() {{\n  return <section className=\"grid gap-6 lg:grid-cols-[1.1fr_0.9fr]\">\n    <div className=\"space-y-5\">\n      <p className=\"text-sm font-semibold uppercase tracking-wide text-calm\">Bingo</p>\n      <h1 className=\"text-4xl font-bold text-ink\">{title}</h1>\n      <p className=\"max-w-2xl text-lg text-slate-700\">{body}</p>\n      <Button>{action}</Button>\n    </div>\n    <Card title=\"Safety boundary\">\n      <p>Bingo offers supportive reflection, not therapy, diagnosis, medication advice, or emergency care.</p>\n    </Card>\n  </section>;\n}}\n")

    components = {
        "ui/Button.tsx": "export function Button({ children, type = 'button' }: { children: React.ReactNode; type?: 'button' | 'submit' }) { return <button type={type} className=\"rounded-md bg-calm px-4 py-2 font-semibold text-white hover:bg-ink\">{children}</button>; }\n",
        "ui/Card.tsx": "export function Card({ title, children }: { title?: string; children: React.ReactNode }) { return <div className=\"rounded-lg border border-sage/40 bg-white p-5 shadow-sm\">{title ? <h2 className=\"mb-3 text-lg font-semibold text-ink\">{title}</h2> : null}<div className=\"text-slate-700\">{children}</div></div>; }\n",
        "ui/Input.tsx": "export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className=\"w-full rounded-md border border-sage/50 px-3 py-2 outline-none focus:ring-2 focus:ring-calm\" />; }\n",
        "ui/Modal.tsx": "export function Modal({ children }: { children: React.ReactNode }) { return <div className=\"rounded-lg border bg-white p-6 shadow-lg\">{children}</div>; }\n",
        "ui/Spinner.tsx": "export function Spinner() { return <span className=\"inline-block h-5 w-5 animate-spin rounded-full border-2 border-calm border-t-transparent\" />; }\n",
        "layout/Navbar.tsx": "import Link from 'next/link';\nconst links = ['chat','dashboard','journal','exercises','safety','settings'];\nexport function Navbar() { return <nav className=\"border-b bg-white\"><div className=\"mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4\"><Link className=\"font-bold text-calm\" href=\"/\">Bingo</Link>{links.map((link) => <Link key={link} className=\"text-sm capitalize text-slate-700 hover:text-calm\" href={`/${link}`}>{link}</Link>)}</div></nav>; }\n",
        "layout/Sidebar.tsx": "export function Sidebar() { return <aside className=\"space-y-2 text-sm text-slate-700\">Wellness tools</aside>; }\n",
        "layout/Footer.tsx": "export function Footer() { return <footer className=\"py-6 text-sm text-slate-500\">Bingo is not a therapy or emergency service.</footer>; }\n",
        "chat/ChatWindow.tsx": "import { ChatMessage } from './ChatMessage';\nexport function ChatWindow() { return <div className=\"space-y-3\"><ChatMessage role=\"assistant\" content=\"I can help you reflect safely. What feels most present right now?\" /></div>; }\n",
        "chat/ChatMessage.tsx": "export function ChatMessage({ role, content }: { role: 'user' | 'assistant'; content: string }) { return <div className={role === 'user' ? 'text-right' : 'text-left'}><p className=\"inline-block rounded-lg bg-white px-4 py-2 shadow-sm\">{content}</p></div>; }\n",
        "chat/ChatInput.tsx": "import { Button } from '@/components/ui/Button';\nexport function ChatInput() { return <form className=\"flex gap-2\"><input className=\"flex-1 rounded-md border px-3 py-2\" placeholder=\"Share what is on your mind\" /><Button type=\"submit\">Send</Button></form>; }\n",
        "chat/MoodSelector.tsx": "export function MoodSelector() { return <div className=\"flex gap-2\">{['Calm','Stressed','Sad','Hopeful'].map((m) => <button className=\"rounded-md border px-3 py-1\" key={m}>{m}</button>)}</div>; }\n",
        "chat/SafetyBanner.tsx": "export function SafetyBanner() { return <div className=\"rounded-md border border-coral bg-orange-50 p-3 text-sm\">If you are in immediate danger, contact local emergency services now.</div>; }\n",
        "journal/JournalEditor.tsx": "export function JournalEditor() { return <textarea className=\"min-h-48 w-full rounded-md border p-3\" placeholder=\"Write privately...\" />; }\n",
        "journal/JournalCard.tsx": "export function JournalCard({ title }: { title: string }) { return <article className=\"rounded-lg border bg-white p-4\"><h3 className=\"font-semibold\">{title}</h3></article>; }\n",
        "dashboard/MoodChart.tsx": "export function MoodChart() { return <div className=\"h-40 rounded-md bg-sage/20 p-4\">Mood trend placeholder</div>; }\n",
        "dashboard/ProgressCards.tsx": "export function ProgressCards() { return <div className=\"grid gap-3 sm:grid-cols-3\"><div>3 journals</div><div>5 moods</div><div>2 exercises</div></div>; }\n",
        "dashboard/InsightPanel.tsx": "export function InsightPanel() { return <section className=\"rounded-lg bg-white p-4\">Recent reflections will appear here.</section>; }\n",
    }
    for path, content in components.items():
        write(f"frontend/src/components/{path}", content)

    for name in ["api", "auth", "constants", "validators", "utils"]:
        write(f"frontend/src/lib/{name}.ts", "export const placeholder = true;\n")
    for name in ["useChat", "useMood", "useJournal"]:
        write(f"frontend/src/hooks/{name}.ts", "export function hookPlaceholder() { return { loading: false }; }\n")
    for name in ["chat", "user", "journal", "mood"]:
        write(f"frontend/src/types/{name}.ts", "export type Id = string;\n")
    write("frontend/src/styles/theme.ts", "export const theme = { colors: { calm: '#2F6F73', sage: '#8AA399', coral: '#D97862' } };\n")

    write("backend/requirements.txt", "fastapi>=0.111.0\nuvicorn[standard]>=0.29.0\npydantic-settings>=2.2.1\nsqlalchemy>=2.0.30\npsycopg[binary]>=3.1.18\npytest>=8.2.0\nhttpx>=0.27.0\n")
    write("backend/pyproject.toml", "[project]\nname = \"bingo-backend\"\nversion = \"0.1.0\"\ndescription = \"FastAPI backend for Bingo\"\nrequires-python = \">=3.11\"\n\n[tool.pytest.ini_options]\npythonpath = [\".\"]\ntestpaths = [\"tests\"]\n")
    write("backend/.env.example", "APP_NAME=Bingo API\nENVIRONMENT=local\nDATABASE_URL=postgresql+psycopg://bingo:change-me@localhost:5432/bingo\nAI_PROVIDER=mock\nOPENAI_API_KEY=\nOPENROUTER_API_KEY=\nHUGGINGFACE_API_KEY=\n")
    write("backend/Dockerfile", "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY app ./app\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n")
    for pkg in ["app", "app/api", "app/api/v1", "app/core", "app/models", "app/schemas", "app/services", "app/ai", "app/ai/guardrails", "app/ai/memory", "app/ai/providers", "app/db", "app/utils"]:
        write(f"backend/{pkg}/__init__.py", BACKEND_INIT)

    write("backend/app/config.py", "from pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    app_name: str = 'Bingo API'\n    environment: str = 'local'\n    database_url: str = 'sqlite:///./bingo.db'\n    ai_provider: str = 'mock'\n\nsettings = Settings()\n")
    write("backend/app/main.py", "from fastapi import FastAPI\nfrom app.api.health import router as health_router\nfrom app.api.v1.router import router as v1_router\n\napp = FastAPI(title='Bingo API', version='0.1.0')\napp.include_router(health_router)\napp.include_router(v1_router, prefix='/api/v1')\n")
    write("backend/app/api/health.py", "from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get('/health')\ndef health() -> dict[str, str]:\n    return {'status': 'ok', 'service': 'bingo-api'}\n")
    write("backend/app/api/v1/router.py", "from fastapi import APIRouter\nfrom app.api.v1 import chat_routes, mood_routes, journal_routes, exercise_routes, safety_routes, auth_routes\n\nrouter = APIRouter()\nrouter.include_router(auth_routes.router, prefix='/auth', tags=['auth'])\nrouter.include_router(chat_routes.router, prefix='/chat', tags=['chat'])\nrouter.include_router(mood_routes.router, prefix='/mood', tags=['mood'])\nrouter.include_router(journal_routes.router, prefix='/journal', tags=['journal'])\nrouter.include_router(exercise_routes.router, prefix='/exercises', tags=['exercises'])\nrouter.include_router(safety_routes.router, prefix='/safety', tags=['safety'])\n")

    route_map = {
        "chat_routes.py": ("ChatRequest", "ChatResponse", "chat_service", "generate_reply", "post", "/"),
        "mood_routes.py": ("MoodEntry", "MoodEntry", "mood_service", "record_mood", "post", "/"),
        "journal_routes.py": ("JournalEntry", "JournalEntry", "journal_service", "save_entry", "post", "/"),
    }
    for filename, (req, res, service, func, method, path) in route_map.items():
        schema = filename.split("_")[0] + "_schema"
        write(f"backend/app/api/v1/{filename}", f"from fastapi import APIRouter\nfrom app.schemas.{schema} import {req}, {res}\nfrom app.services.{service} import {func}\n\nrouter = APIRouter()\n\n@router.{method}('{path}', response_model={res})\ndef handle(payload: {req}) -> {res}:\n    return {func}(payload)\n")
    write("backend/app/api/v1/exercise_routes.py", "from fastapi import APIRouter\nfrom app.services.exercise_service import list_exercises\n\nrouter = APIRouter()\n\n@router.get('/')\ndef exercises() -> list[dict[str, str]]:\n    return list_exercises()\n")
    write("backend/app/api/v1/safety_routes.py", "from fastapi import APIRouter\nfrom app.schemas.chat_schema import ChatRequest\nfrom app.services.safety_service import check_text\n\nrouter = APIRouter()\n\n@router.post('/check')\ndef check(payload: ChatRequest) -> dict[str, object]:\n    return check_text(payload.message)\n")
    write("backend/app/api/v1/auth_routes.py", "from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.post('/mock-login')\ndef mock_login() -> dict[str, str]:\n    return {'token': 'mock-token', 'note': 'Replace with real auth before production.'}\n")

    write("backend/app/schemas/chat_schema.py", "from pydantic import BaseModel, Field\n\nclass ChatRequest(BaseModel):\n    message: str = Field(min_length=1, max_length=4000)\n    mood: str | None = None\n\nclass ChatResponse(BaseModel):\n    reply: str\n    crisis_mode: bool = False\n    safety_notes: list[str] = []\n")
    write("backend/app/schemas/mood_schema.py", "from pydantic import BaseModel, Field\n\nclass MoodEntry(BaseModel):\n    label: str\n    intensity: int = Field(ge=1, le=10)\n    note: str | None = None\n")
    write("backend/app/schemas/journal_schema.py", "from pydantic import BaseModel, Field\n\nclass JournalEntry(BaseModel):\n    title: str = Field(min_length=1)\n    content: str = Field(min_length=1)\n    mood: str | None = None\n")
    write("backend/app/schemas/user_schema.py", "from pydantic import BaseModel\n\nclass UserProfile(BaseModel):\n    email: str\n    display_name: str | None = None\n")
    write("backend/app/schemas/exercise_schema.py", "from pydantic import BaseModel\n\nclass Exercise(BaseModel):\n    id: str\n    title: str\n    category: str\n")

    write("backend/app/ai/guardrails/crisis_detector.py", "CRISIS_TERMS = {'suicide', 'kill myself', 'end my life', 'self harm', 'hurt myself', 'hurt someone', 'abuse', 'immediate danger'}\n\ndef detect_crisis(text: str) -> dict[str, object]:\n    lowered = text.lower()\n    matches = sorted(term for term in CRISIS_TERMS if term in lowered)\n    return {'is_crisis': bool(matches), 'matches': matches, 'level': 'crisis' if matches else 'standard'}\n")
    write("backend/app/ai/guardrails/response_validator.py", "PROHIBITED = ['you are diagnosed with', 'take this medication', 'stop taking your medication', 'i am your therapist']\n\ndef validate_response(text: str) -> tuple[str, list[str]]:\n    notes: list[str] = []\n    cleaned = text\n    for phrase in PROHIBITED:\n        if phrase in cleaned.lower():\n            cleaned = cleaned.replace(phrase, '[removed unsafe claim]')\n            notes.append(f'Removed prohibited phrase: {phrase}')\n    return cleaned, notes\n")
    write("backend/app/ai/guardrails/safety_rules.py", "SAFETY_RULES = ['No therapist claims', 'No diagnosis', 'No medication prescribing', 'Crisis mode for immediate danger']\n")
    write("backend/app/ai/guardrails/prohibited_advice.py", "PROHIBITED_ADVICE = ['harm instructions', 'diagnosis', 'medication dosage', 'abuse enablement']\n")
    write("backend/app/services/safety_service.py", "from app.ai.guardrails.crisis_detector import detect_crisis\n\nCRISIS_REPLY = 'I am really sorry you are facing this. If you or someone else may be in immediate danger, contact local emergency services now and reach a trusted person who can stay with you. I can stay with you for grounding, but I cannot replace urgent help.'\n\ndef check_text(text: str) -> dict[str, object]:\n    return detect_crisis(text)\n")
    write("backend/app/services/ai_service.py", "from app.ai.providers.base import AIProvider\n\nclass MockProvider(AIProvider):\n    def complete(self, prompt: str) -> str:\n        return 'I hear you. Let us slow this down together: what is one small, safe next step you can take in the next ten minutes?'\n\ndef get_provider() -> AIProvider:\n    return MockProvider()\n")
    write("backend/app/services/chat_service.py", "from app.schemas.chat_schema import ChatRequest, ChatResponse\nfrom app.services.ai_service import get_provider\nfrom app.services.safety_service import CRISIS_REPLY\nfrom app.ai.guardrails.crisis_detector import detect_crisis\nfrom app.ai.guardrails.response_validator import validate_response\n\ndef generate_reply(payload: ChatRequest) -> ChatResponse:\n    risk = detect_crisis(payload.message)\n    if risk['is_crisis']:\n        return ChatResponse(reply=CRISIS_REPLY, crisis_mode=True, safety_notes=['crisis-safe-response'])\n    reply = get_provider().complete(payload.message)\n    cleaned, notes = validate_response(reply)\n    return ChatResponse(reply=cleaned, safety_notes=notes)\n")
    write("backend/app/services/mood_service.py", "from app.schemas.mood_schema import MoodEntry\n\ndef record_mood(payload: MoodEntry) -> MoodEntry:\n    return payload\n")
    write("backend/app/services/journal_service.py", "from app.schemas.journal_schema import JournalEntry\n\ndef save_entry(payload: JournalEntry) -> JournalEntry:\n    return payload\n")
    write("backend/app/services/exercise_service.py", "def list_exercises() -> list[dict[str, str]]:\n    return [{'id': 'box-breathing', 'title': 'Box breathing', 'category': 'grounding'}, {'id': 'five-senses', 'title': 'Five senses check-in', 'category': 'grounding'}]\n")
    write("backend/app/services/analytics_service.py", "def summarize_activity() -> dict[str, int]:\n    return {'moods': 0, 'journals': 0, 'chats': 0}\n")

    for name in ["user", "chat", "mood", "journal", "exercise"]:
        write(f"backend/app/models/{name}.py", "from sqlalchemy.orm import DeclarativeBase\n\nclass Base(DeclarativeBase):\n    pass\n")
    for name in ["security", "logging", "exceptions", "rate_limit", "dependencies"]:
        target = f"backend/app/{name}.py" if name == "dependencies" else f"backend/app/core/{name}.py"
        write(target, "def placeholder() -> None:\n    return None\n")
    for name in ["database", "session"]:
        write(f"backend/app/db/{name}.py", "from app.config import settings\n\nDATABASE_URL = settings.database_url\n")
    write("backend/app/db/seed.py", "def seed() -> None:\n    print('Seed placeholder')\n")
    for name in ["datetime_utils", "text_utils", "anonymization"]:
        write(f"backend/app/utils/{name}.py", "def normalize(value: str) -> str:\n    return value.strip()\n")

    write("backend/app/ai/providers/base.py", "from abc import ABC, abstractmethod\n\nclass AIProvider(ABC):\n    @abstractmethod\n    def complete(self, prompt: str) -> str:\n        raise NotImplementedError\n")
    for provider in ["openai_provider", "openrouter_provider", "huggingface_provider"]:
        cls = "".join(part.title() for part in provider.replace("_provider", "").split("_")) + "Provider"
        write(f"backend/app/ai/providers/{provider}.py", f"from app.ai.providers.base import AIProvider\n\nclass {cls}(AIProvider):\n    def complete(self, prompt: str) -> str:\n        return 'Mock response from {cls}. Real API calls are intentionally disabled.'\n")
    write("backend/app/ai/memory/conversation_memory.py", "class ConversationMemory:\n    def __init__(self) -> None:\n        self.messages: list[str] = []\n")
    write("backend/app/ai/memory/user_preferences.py", "DEFAULT_PREFERENCES = {'tone': 'warm', 'detail': 'concise'}\n")

    prompts = {
        "system_prompt.md": "You are Bingo, a supportive AI wellness companion. You are not a therapist, doctor, or emergency service. Do not diagnose or prescribe medication. Encourage professional help for clinical concerns.\n",
        "crisis_prompt.md": "Use crisis-safe mode. Be calm and direct. Encourage contacting local emergency services immediately and reaching a trusted person. Do not provide harmful instructions.\n",
        "cbt_prompt.md": "Guide gentle thought reflection without diagnosing. Ask about evidence, alternative interpretations, and one small next action.\n",
        "journaling_prompt.md": "Invite private reflection with open-ended prompts. Avoid clinical labels.\n",
        "reflection_prompt.md": "Reflect feelings, summarize themes, and suggest safe grounding steps.\n",
    }
    for name, content in prompts.items():
        write(f"backend/app/ai/prompts/{name}", content)

    tests = {
        "test_api_health.py": "from fastapi.testclient import TestClient\nfrom app.main import app\n\ndef test_health() -> None:\n    assert TestClient(app).get('/health').json()['status'] == 'ok'\n",
        "test_safety.py": "from app.ai.guardrails.crisis_detector import detect_crisis\n\ndef test_detects_crisis_language() -> None:\n    assert detect_crisis('I want to kill myself')['is_crisis'] is True\n\ndef test_standard_language_not_crisis() -> None:\n    assert detect_crisis('I feel stressed today')['is_crisis'] is False\n",
        "test_chat.py": "from app.schemas.chat_schema import ChatRequest\nfrom app.services.chat_service import generate_reply\n\ndef test_chat_returns_mock_reply() -> None:\n    res = generate_reply(ChatRequest(message='I am stressed'))\n    assert res.crisis_mode is False\n    assert res.reply\n\ndef test_chat_crisis_mode() -> None:\n    res = generate_reply(ChatRequest(message='I want to end my life'))\n    assert res.crisis_mode is True\n",
        "test_mood.py": "from app.schemas.mood_schema import MoodEntry\nfrom app.services.mood_service import record_mood\n\ndef test_record_mood_echoes_payload() -> None:\n    entry = MoodEntry(label='calm', intensity=7)\n    assert record_mood(entry).label == 'calm'\n",
        "test_journal.py": "from app.schemas.journal_schema import JournalEntry\nfrom app.services.journal_service import save_entry\n\ndef test_save_journal_echoes_payload() -> None:\n    entry = JournalEntry(title='Today', content='I noticed progress.')\n    assert save_entry(entry).title == 'Today'\n",
    }
    for name, content in tests.items():
        write(f"backend/tests/{name}", content)

    write_json("data/sample_conversations.json", [{"role": "user", "content": "I feel overwhelmed"}, {"role": "assistant", "content": "Let us take one slow breath and name what feels most urgent."}])
    write_json("data/safety_examples.json", [{"text": "I want to end my life", "label": "crisis"}, {"text": "I had a hard day", "label": "standard"}])
    write_json("data/mood_labels.json", ["calm", "sad", "angry", "anxious", "hopeful", "overwhelmed"])
    write_json("data/exercises.json", [{"id": "box-breathing", "title": "Box breathing", "duration_minutes": 3}, {"id": "five-senses", "title": "Five senses grounding", "duration_minutes": 5}])
    write("design/brand_guidelines.md", "# Brand Guidelines\n\nBingo should feel calm, respectful, and practical. Avoid clinical impersonation or overly playful crisis language.\n")
    write("design/color_palette.md", "# Color Palette\n\n- Calm teal: #2F6F73\n- Sage: #8AA399\n- Coral: #D97862\n- Ink: #172326\n- Warm paper: #F7F4EF\n")

    write("scripts/run_dev.ps1", "$ErrorActionPreference = 'Stop'\nWrite-Host 'Starting Bingo backend and frontend...'\nStart-Process powershell -ArgumentList '-NoExit','-Command','cd backend; python -m uvicorn app.main:app --reload --port 8000'\nStart-Process powershell -ArgumentList '-NoExit','-Command','cd frontend; npm run dev'\n")
    write("scripts/run_dev.sh", "#!/usr/bin/env bash\nset -euo pipefail\n(cd backend && uvicorn app.main:app --reload --port 8000) &\n(cd frontend && npm run dev) &\nwait\n")
    write("scripts/check_env.py", "from pathlib import Path\nfor path in ['.env.example', 'frontend/.env.example', 'backend/.env.example']:\n    print(f'{path}: {Path(path).exists()}')\n")
    write("scripts/seed_database.py", "print('Seed database placeholder. Wire this to backend/app/db/seed.py when persistence is enabled.')\n")

    write(".github/workflows/frontend-ci.yml", "name: Frontend CI\non: [push, pull_request]\njobs:\n  frontend:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - run: cd frontend && npm ci && npm run typecheck && npm run build\n")
    write(".github/workflows/backend-ci.yml", "name: Backend CI\non: [push, pull_request]\njobs:\n  backend:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: '3.12' }\n      - run: cd backend && pip install -r requirements.txt && pytest\n")
    write(".github/workflows/security-scan.yml", "name: Security Scan\non: [push, pull_request]\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pypa/gh-action-pip-audit@v1.0.8\n        with: { inputs: backend/requirements.txt }\n      - run: npx audit-ci --directory frontend --moderate\n")
    write(".github/ISSUE_TEMPLATE/bug_report.md", "---\nname: Bug report\nabout: Report a defect\n---\n\n## Summary\n\n## Steps to Reproduce\n\n## Expected Behavior\n\n## Actual Behavior\n")
    write(".github/ISSUE_TEMPLATE/feature_request.md", "---\nname: Feature request\nabout: Suggest an improvement\n---\n\n## Problem\n\n## Proposed Solution\n\n## Safety or Privacy Notes\n")
    write(".github/ISSUE_TEMPLATE/safety_issue.md", "---\nname: Safety issue\nabout: Report an AI safety concern\n---\n\n## Safety Concern\n\n## Example Input/Output\n\n## Severity\n")
    write(".github/pull_request_template.md", "## Summary\n\n## Testing\n\n## Safety Review\n\n- [ ] No therapist, diagnosis, or medication claims added\n- [ ] Crisis handling remains intact\n")


if __name__ == "__main__":
    main()
