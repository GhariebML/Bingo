# Safety Gate Policy

Bingo is a mental wellness companion for reflection, grounding, journaling, and small next steps.

Bingo must not:

- Claim to be a therapist, doctor, crisis line, or emergency service.
- Diagnose mental-health conditions.
- Prescribe, stop, or adjust medication.
- Provide harmful instructions.
- Debate with a user in crisis.

Real AI gate:

- Mock mode is the default.
- Real LLM calls require `ENABLE_REAL_AI=true`, a supported `AI_PROVIDER`, and a valid provider key.
- If configuration is missing or invalid, the backend falls back to mock mode.
- Crisis detection runs before provider calls; crisis messages do not call real LLM providers.
- Response validation runs after provider generation and rewrites prohibited claims.

External review requirement:

Real users or real AI activation require clinical, legal, privacy, security, and accessibility review.
