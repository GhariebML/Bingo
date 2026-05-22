import os
from app.ai.guardrails.crisis_detector import detect_crisis
from app.ai.guardrails.response_validator import validate_response
from app.ai.providers.base import ProviderResponse
from app.ai.providers.mock_provider import MockProvider, classify_intent
from app.services.ai_service import get_provider
from app.services.safety_service import CRISIS_REPLY


def generate_supportive_response(message: str, mood: str | None = None, history: list | None = None, user = None) -> ProviderResponse:
    normalized = ' '.join(message.strip().split())
    crisis = detect_crisis(normalized)
    if crisis['is_crisis']:
        return ProviderResponse(CRISIS_REPLY, 'crisis', 'Contact emergency support', 'mock', 'demo')

    category = classify_intent(normalized, mood)
    user_settings = user.settings if user else None
    provider = get_provider(user_settings)
    
    # Load system prompt professionally from file with fallback
    system_prompt = (
        'You are Bingo, a mental wellness companion. Validate the feeling, reflect briefly, ask one gentle question, '
        'and suggest one small safe step. Do not diagnose, prescribe medication, claim to be a therapist, or replace emergency care.'
    )
    try:
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prompt_path = os.path.join(current_dir, 'ai', 'prompts', 'system_prompt.md')
        if os.path.exists(prompt_path):
            with open(prompt_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:
                    system_prompt = content
    except Exception:
        pass

    # Build conversation messages professionally with full history
    messages = [{'role': 'system', 'content': system_prompt}]
    if history:
        for msg in history:
            role = getattr(msg, 'role', None) or (msg.get('role') if isinstance(msg, dict) else 'user')
            content = getattr(msg, 'content', None) or (msg.get('content') if isinstance(msg, dict) else '')
            # Filter system messages from client history to avoid doubling up
            if role != 'system':
                messages.append({'role': role, 'content': content})
                
    # Append the newest user message if it is not already at the end of the history list
    if not messages or messages[-1]['content'] != normalized or messages[-1]['role'] != 'user':
        messages.append({'role': 'user', 'content': normalized})

    try:
        reply = provider.generate_response(
            messages,
            user_context={'mood': mood, 'category': category},
            safety_context={'crisis': False},
        )
        fallback = MockProvider().complete(normalized, mood)
        cleaned, _ = validate_response(reply)
        return ProviderResponse(cleaned or fallback.reply, category, fallback.suggested_exercise, provider.name, provider.mode)
    except Exception as exc:
        from app.config import settings
        if settings.enable_real_ai and provider.name != 'mock':
            err_msg = str(exc)
            friendly_err = f"API connection issue: {err_msg}. Please check your OpenRouter configuration, balance, or key settings."
            return ProviderResponse(friendly_err, category, "One small step planning", provider.name, "error")
        return MockProvider().complete(normalized, mood)
