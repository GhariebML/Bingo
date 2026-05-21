# External Review Package

## Scope

Bingo is a mental wellness MVP for supportive reflection, journaling, mood check-ins, and gentle exercises. It must not be represented as therapy, diagnosis, medication guidance, emergency response, or crisis care.

## Implemented Safety Gate

- Mock/demo AI mode remains the default.
- Real AI providers require explicit configuration and should not be enabled before review.
- Crisis-like messages bypass ordinary coaching and return emergency/trusted-person guidance.
- Response validation removes diagnostic, medication, treatment, and therapist-replacement claims.
- UI copy states Bingo is not a therapist, doctor, crisis line, or emergency responder.

## Required Clinical Review

- Review crisis detection categories and false-negative risks.
- Review crisis response wording by target region.
- Review all exercises and wellness guidance for appropriateness.
- Review boundaries around anxiety, depression, trauma, self-harm, abuse, and harm-to-others content.
- Approve disclaimers and escalation guidance before real users.

## Required Legal Review

- Terms of use.
- Medical/mental-health disclaimer.
- Age restrictions and consent model.
- Emergency limitation language.
- Liability, jurisdiction, and provider terms.

## Required Privacy Review

- Sensitive health-adjacent data collection.
- Data retention, deletion, and export.
- User consent and privacy policy.
- Logging and analytics controls.
- AI provider data handling and training opt-out requirements.
- Security model for authentication and session storage.

## Production Activation Checklist

- Clinical sign-off complete.
- Legal sign-off complete.
- Privacy sign-off complete.
- Red-team safety tests complete.
- Crisis resources source and maintenance process documented.
- Production auth/session model complete.
- Monitoring, incident response, and rollback plan complete.
# 2026-05-21 External Review Status

Status: **not complete**. The app remains demo-only until qualified reviewers sign off.

Review package now includes:
- Auth and ownership model: user-owned journal, mood, and settings data.
- Session model: HTTP-only cookie session with bearer compatibility for API tooling.
- Account controls: logout, reset/verification/MFA scaffolding, export, and deletion endpoint.
- Safety model: mock/demo AI mode by default; crisis responses work without authentication; no diagnostic, medication, therapist, or emergency-service claims should be introduced.
- Production gating: real AI providers must remain disabled unless explicitly configured after clinical/legal/privacy review.

Required reviewers:
- Licensed mental-health/clinical reviewer for content safety and crisis handling.
- Privacy counsel for consent, retention, export/delete, regional obligations, and minors policy.
- Legal counsel for disclaimers, risk disclosures, terms, and jurisdictional fit.
- Security reviewer for session, CSRF, rate limiting, audit logs, secrets, and abuse handling.
- Accessibility reviewer for WCAG coverage.
