# Safety Review

## Current Safety System

Bingo uses a starter layered safety design:

1. UI copy sets scope boundaries before use.
2. Backend crisis detector checks user text for self-harm, suicide, harming others, abuse, unsafe-home, emergency, and immediate-danger patterns.
3. Crisis matches force crisis-safe response mode.
4. Response validator blocks therapist, diagnosis, medication, and treatment claims in mock output.
5. Tests cover standard messages, crisis messages, and unsafe response cleanup.

## Crisis-Safe Behavior

When crisis language is detected, Bingo should:

- Encourage contacting local emergency services immediately.
- Encourage reaching a trusted person who can stay with the user.
- Suggest moving away from means of harm only when it can be done safely.
- Avoid diagnosis, debate, blame, or harmful details.
- Clearly state that Bingo cannot replace urgent help, therapy, or emergency services.

## Explicit Product Boundaries

Bingo must not:

- Present itself as a licensed therapist.
- Diagnose mental disorders.
- Prescribe, change, or recommend medication dosages.
- Give instructions for self-harm, violence, abuse, or evading help.
- Claim guaranteed clinical outcomes.

## Known Limitations

The current detector is keyword and regex based. It will miss indirect crisis language and may flag benign educational text. Production should use layered classification, human-reviewed test sets, regional crisis resources, incident logging, and regular red-team review.

## Recommended Next Phase

Add a safety evaluation suite with examples across self-harm, harm to others, abuse, panic, grief, and false positives. Add a policy engine before connecting OpenAI, OpenRouter, or Hugging Face providers.
