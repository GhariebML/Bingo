from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.agent_service import generate_supportive_response
from app.services.safety_service import CRISIS_REPLY
from app.ai.guardrails.risk_classifier import classify_risk
from app.ai.guardrails.response_validator import validate_response

def generate_reply(payload: ChatRequest, user = None) -> ChatResponse:
    risk = classify_risk(payload.message)
    if risk['risk_level'] == 'crisis':
        return ChatResponse(
            reply=CRISIS_REPLY,
            risk_level='crisis',
            category='crisis',
            suggested_exercise='Contact emergency support',
            safety_triggered=True,
            crisis_mode=True,
            safety_notes=['crisis-safe-response'],
            provider='mock',
            mode='demo',
        )
    provider_response = generate_supportive_response(payload.message, payload.mood, payload.history, user=user)
    cleaned, notes = validate_response(provider_response.reply)
    return ChatResponse(
        reply=cleaned,
        risk_level=str(risk['risk_level']),
        category=provider_response.category,
        suggested_exercise=provider_response.suggested_exercise,
        safety_triggered=bool(notes) or bool(risk['safety_triggered']),
        safety_notes=notes,
        provider=provider_response.provider,
        mode=provider_response.mode,
    )
