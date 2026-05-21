# Agent Design

Bingo uses a simple MVP agent pipeline:

1. Receive user message and optional mood.
2. Run crisis detection before generation.
3. If crisis is detected, return a crisis-safe message immediately.
4. If not crisis, classify intent through the mock provider.
5. Generate a structured supportive response.
6. Validate the response for prohibited claims.
7. Return reply, risk level, category, suggested exercise, and safety flags.

The response style follows:
- validate the feeling
- briefly reflect the problem
- ask one gentle question
- suggest one small safe next step

Bingo must not diagnose, prescribe, claim to treat, replace therapy, replace emergency care, or encourage dependency.
