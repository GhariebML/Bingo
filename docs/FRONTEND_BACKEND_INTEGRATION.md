# Frontend Backend Integration

## API Base URL
The frontend uses:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

If the variable is missing, it defaults to `http://localhost:8000`.

## Connected Chat
The chat page sends quick-start and typed messages to:

```http
POST /api/v1/chat
```

The backend returns:

```json
{
  "reply": "...",
  "risk_level": "low",
  "category": "overthinking",
  "suggested_exercise": "Worry parking",
  "safety_triggered": false
}
```

## Other MVP Endpoints
- `GET /health`
- `GET /api/v1/exercises`
- `GET /api/v1/mood/mock-trend`
- `POST /api/v1/journal`

## Local CORS
FastAPI allows `http://localhost:3000` for local frontend development.
