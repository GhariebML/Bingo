# System Architecture

The monorepo separates the Next.js frontend from the FastAPI backend. The backend exposes versioned REST APIs, routes requests through service modules, applies AI guardrails before and after model calls, and stores production data in PostgreSQL.

## Backend Flow

1. API route receives validated schema.
2. Service layer evaluates safety risk.
3. Crisis detector can force crisis-safe mode.
4. AI service returns a mock provider response for now.
5. Response validator removes unsafe claims and applies boundaries.
