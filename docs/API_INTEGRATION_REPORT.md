# API Integration Report

Implemented API-first coverage:

- Chat: `POST /api/v1/chat`
- Dashboard: `GET /api/v1/dashboard/summary`
- Exercises: `GET /api/v1/exercises`, `GET /api/v1/exercises/{exercise_id}`
- Journal: `GET /api/v1/journal`, `POST /api/v1/journal`, `GET /api/v1/journal/{entry_id}`, `DELETE /api/v1/journal/{entry_id}`
- Mood: `GET /api/v1/mood/mock-trend`, `POST /api/v1/mood/check-in`, `GET /api/v1/mood/summary`
- Settings: `GET /api/v1/settings`, `PUT /api/v1/settings`
- Safety: `GET /api/v1/safety/resources`, `GET /api/v1/safety/disclaimer`

Frontend integration:

- Chat displays provider/mode and backend exercise suggestions.
- Dashboard loads summary and mood trend from the backend.
- Exercises render backend exercise records.
- Journal loads, creates, and deletes entries through the backend.
- Settings load and save through the backend.
- Safety loads disclaimer and resources through the backend.

Demo readiness:

- Public educational resources remain available without login.
- User-owned data remains protected by session auth.
- Missing real provider keys do not break the app.
