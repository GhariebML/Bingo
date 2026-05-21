# LLM Integration Guide

Bingo defaults to safe demo mode. Real LLM calls must not run unless explicitly configured.

## Provider Selection

Backend environment:

```env
AI_PROVIDER=mock
ENABLE_REAL_AI=false
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
HF_TOKEN=
HF_MODEL=
HF_BASE_URL=
```

Rules:

- `ENABLE_REAL_AI=false` always uses the mock provider.
- `AI_PROVIDER=mock` always uses the mock provider.
- `AI_PROVIDER=openai` requires `ENABLE_REAL_AI=true` and `OPENAI_API_KEY`.
- `AI_PROVIDER=openrouter` requires `ENABLE_REAL_AI=true` and `OPENROUTER_API_KEY`.
- `AI_PROVIDER=huggingface` requires `ENABLE_REAL_AI=true`, `HF_TOKEN`, and `HF_MODEL`.
- Invalid provider configuration falls back to mock and logs a warning without exposing secrets.

## Safety Pipeline

Chat requests pass through:

1. Input normalization.
2. Crisis detection.
3. Immediate crisis-safe response when needed.
4. Provider selection.
5. Response validation and unsafe-claim rewriting.
6. Structured response with provider and mode.

Real providers must remain disabled until clinical, legal, privacy, and security review is complete.
