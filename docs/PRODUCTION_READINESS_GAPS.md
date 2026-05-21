# Production Readiness Gaps

## Data and Auth

- Replace SQLite with managed Postgres or another production database.
- Add migrations with Alembic or equivalent.
- Replace localStorage token handling with hardened session management.
- Add email verification, password reset, MFA option, rate limiting, and session revocation.
- Add user data export, deletion, retention policy enforcement, and audit logs.

## Safety and Clinical

- Complete external clinical review before real users.
- Complete legal and privacy review before collecting sensitive data.
- Add stronger multi-layer safety classification, including model-independent classifiers.
- Add region-specific crisis resources with reviewed, maintained source data.
- Add escalation and incident review workflows.

## AI Providers

- Real AI providers remain disabled unless explicitly configured.
- Production activation must require reviewed prompts, red-team safety tests, provider logging policy review, and rollback controls.

## Operations

- Add deployment environment separation.
- Add secrets management.
- Add observability, error tracking, and backup strategy.
- Add load tests and abuse prevention.

## Frontend

- Add full authenticated route guards and logout UX.
- Improve Next.js image `sizes`/priority usage.
- Add accessibility and mobile regression tests.
# 2026-05-21 Current Production Gaps

Closed or improved:
- Alembic migration scaffolding added.
- PostgreSQL-ready configuration is the production target.
- Browser session handling now uses HTTP-only cookies instead of `localStorage` token storage.
- Added logout, password reset, email verification, MFA setup, rate limiting, audit logs, export, and delete endpoints.
- Addressed Next.js image `sizes` warnings and prioritized above-the-fold images found during E2E.

Still required before real users:
- Run PostgreSQL in the target environment and apply Alembic migrations there.
- Replace local/dev password reset and verification tokens with a real email delivery provider.
- Replace local MFA code flow with TOTP/WebAuthn and recovery codes.
- Add CSRF protection for cookie-authenticated unsafe methods.
- Add production secrets management, HTTPS-only cookies, stricter CORS, structured audit retention, backups, monitoring, and incident response.
- Complete qualified clinical, legal, privacy, security, and accessibility reviews.
- Keep real AI providers disabled until all external reviews and safety gates are complete.
