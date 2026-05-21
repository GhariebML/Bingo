from app.ai.guardrails.crisis_detector import detect_crisis
from app.ai.guardrails.response_validator import validate_response
from app.ai.providers.base import ProviderResponse
from app.ai.providers.mock_provider import MockProvider, classify_intent
from app.services.ai_service import get_provider
from app.services.safety_service import CRISIS_REPLY


def generate_supportive_response(message: str, mood: str | None = None) -> ProviderResponse:
    normalized = ' '.join(message.strip().split())
    crisis = detect_crisis(normalized)
    if crisis['is_crisis']:
        return ProviderResponse(CRISIS_REPLY, 'crisis', 'Contact emergency support', 'mock', 'demo')

    category = classify_intent(normalized, mood)
    provider = get_provider()
    system_prompt = (
        'You are Bingo, a mental wellness companion. Validate the feeling, reflect briefly, ask one gentle question, '
        'and suggest one small safe step. Do not diagnose, prescribe medication, claim to be a therapist, or replace emergency care.'
    )
    messages = [
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': normalized},
    ]
    try:
        reply = provider.generate_response(
            messages,
            user_context={'mood': mood, 'category': category},
            safety_context={'crisis': False},
        )
        fallback = MockProvider().complete(normalized, mood)
        cleaned, _ = validate_response(reply)
        return ProviderResponse(cleaned or fallback.reply, category, fallback.suggested_exercise, provider.name, provider.mode)
    except Exception:
        return MockProvider().complete(normalized, mood)
