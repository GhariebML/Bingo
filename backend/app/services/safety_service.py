from app.ai.guardrails.crisis_detector import detect_crisis
from app.ai.guardrails.risk_classifier import classify_risk
from app.services.crisis_resources import get_resources

CRISIS_REPLY = (
    "I am really sorry you are feeling this. Your safety matters most right now. Contact local emergency services immediately and reach out to a trusted person who can stay with you now. "
    "If you can, move away from anything that could be used for harm. Bingo is not an emergency service or crisis line."
)

def check_text(text: str) -> dict[str, object]:
    crisis = detect_crisis(text)
    layered = classify_risk(text)
    return {**crisis, **layered}


def region_resources(region: str | None = None) -> dict[str, str]:
    return get_resources(region)


def disclaimer() -> dict[str, object]:
    return {
        'title': 'Bingo safety boundaries',
        'message': 'Bingo supports reflection, journaling, grounding, and small next steps. It is not a therapist, doctor, crisis line, or emergency service.',
        'crisis_guidance': CRISIS_REPLY,
        'not_for': ['diagnosis', 'medication advice', 'therapy replacement', 'emergency response'],
    }
