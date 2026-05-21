# E2E Testing Report

## Implemented

- Playwright smoke tests for the MVP browser flows.
- Frontend and backend web servers are started through Playwright configuration when needed.
- Tests cover unauthenticated route handling, account creation, login, chat, journal, mood, safety, and settings.

## Covered Flows

- Landing page loads.
- Safety page loads and shows non-therapy safety copy.
- Journal shows a sign-in-required state when unauthenticated.
- Registration creates a local account.
- Login accepts the registered account.
- Authenticated chat page sends a prompt to the backend.
- Journal entry can be saved.
- Mood check-in can be saved.
- Settings can be loaded and saved.
- Demo login remains available for local smoke checks.

## Current Result

- `npm run test:e2e`: passing.
- Browser warnings remain for some Next.js image optimization hints; they do not fail the test suite.

## Next E2E Phase

- Add mobile viewport coverage.
- Add crisis chat E2E coverage.
- Add explicit logout and expired-token coverage.
- Add accessibility checks for forms and keyboard navigation.
# 2026-05-21 E2E Coverage Update

Added smoke coverage for:
- Mobile viewport reachability.
- Basic accessibility landmarks and form labels.
- Crisis chat without authentication.
- Expired/invalid session handling.
- Existing landing, register/login, authenticated chat, journal, mood, safety, settings, and unauthenticated protected route behavior.

Latest result:
- `npm run test:e2e`: 9 passed.

Known remaining E2E gaps:
- Full screen-reader audit with axe or equivalent.
- Password reset, email verification, MFA, export, and delete browser flows.
- Cross-browser mobile Safari/Chrome device matrix.
