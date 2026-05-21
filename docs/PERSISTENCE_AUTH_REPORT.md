# Persistence and Auth Report

## Implemented

- SQLite-backed local persistence for users, journal entries, mood check-ins, chat records, and user settings.
- Registration and login endpoints that return bearer tokens for local MVP authentication.
- Owner-scoped journal, mood, and settings routes using the current authenticated user.
- Protected backend endpoints reject unauthenticated requests with `401`.
- Frontend API client attaches bearer tokens automatically when available and clears stale tokens on `401`.
- Journal, dashboard mood, and settings screens show clean sign-in/demo states instead of crashing.

## Auth and Ownership Model

- Users register with email, display name, and password.
- Passwords are stored as hashes, not plaintext.
- The token is stored in `localStorage` for the MVP only. This is acceptable for local demo testing, but production should move to hardened session handling.
- Journal entries, mood entries, and settings rows include `user_id`.
- List/create/update queries filter by the authenticated user's ID.

## Database Schema Summary

- `users`: email, display name, password hash, timestamps.
- `user_settings`: user ID, preferred language, response style, crisis region, data-saving preferences.
- `journal_entries`: user ID, title, content, mood, emotion tags, created timestamp.
- `mood_entries`: user ID, mood label, intensity, optional note, created timestamp.
- `chat_messages`: reserved for owned chat history and future conversation persistence.

## Still Mock or Demo

- Demo login remains available for local testing.
- SQLite is local development storage, not production storage.
- There is no account recovery, email verification, MFA, admin tooling, or production session revocation.

## Known Limitations

- No migration tool is configured yet; tables are created at startup with SQLAlchemy metadata.
- Token storage uses browser `localStorage`; this should not be treated as production secure storage.
- No tenant management beyond owner-scoped rows.
- No audit log or export/delete privacy workflow yet.
# 2026-05-21 Hardening Update

Implemented:
- PostgreSQL-ready `DATABASE_URL` remains the production target; local development keeps a guarded SQLite fallback for tests and demo runs.
- Alembic baseline migration added under `backend/app/db/migrations`.
- Frontend auth moved away from `localStorage` token persistence. Login/register/demo login now set an HTTP-only `bingo_session` cookie from the backend.
- Protected backend routes accept the HTTP-only session cookie and retain bearer-token compatibility for API tests/tools.
- Added logout, password reset request/confirm, email verification request/confirm, MFA setup/verify, account export, account delete, rate limiting, and audit event persistence.
- Added audit table coverage for auth and account events.
- Added actual Bingo logo asset at `frontend/public/bingo-logo.png` and used it in the navbar.

Still demo/local:
- Password reset and email verification generate dev tokens in local mode instead of sending email.
- MFA uses a local one-time code flow for MVP verification; production should integrate authenticator-app TOTP or WebAuthn.
- SQLite fallback is for local/dev only. Production should run PostgreSQL plus Alembic migrations.

Safety:
- Real AI providers remain gated by configuration.
- Clinical/legal/privacy review is not marked complete; this requires qualified external reviewers.
