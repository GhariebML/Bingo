from app.ai.guardrails.crisis_detector import detect_crisis
from app.ai.guardrails.response_validator import validate_response


HIGH_RISK_TERMS = [
    'hopeless',
    'trapped',
    'worthless',
    'cannot cope',
    'can not cope',
    'danger',
    'no way out',
    'giving up',
]
MEDIUM_RISK_TERMS = [
    'panic',
    'overwhelmed',
    'abuse',
    'unsafe',
    'scared',
    'spiraling',
    'can barely function',
    'not sleeping',
]
LOW_RISK_TERMS = ['stressed', 'sad', 'anxious', 'lonely', 'tired', 'worried']


def _keyword_layer(text: str) -> dict[str, object]:
    lowered = text.lower()
    high = [term for term in HIGH_RISK_TERMS if term in lowered]
    medium = [term for term in MEDIUM_RISK_TERMS if term in lowered]
    low = [term for term in LOW_RISK_TERMS if term in lowered]
    if high:
        return {'level': 'high', 'signals': high, 'score': 75}
    if medium:
        return {'level': 'medium', 'signals': medium, 'score': 50}
    if low:
        return {'level': 'low', 'signals': low, 'score': 20}
    return {'level': 'low', 'signals': [], 'score': 5}


def _clinical_boundary_layer(text: str) -> dict[str, object]:
    _, notes = validate_response(text)
    return {
        'unsafe_advice_language': bool(notes),
        'signals': notes,
        'score': 60 if notes else 0,
    }


def classify_risk(text: str) -> dict[str, object]:
    crisis = detect_crisis(text)
    if crisis['is_crisis']:
        return {
            'risk_level': 'crisis',
            'signals': crisis['matches'],
            'safety_triggered': True,
            'score': 100,
            'confidence': 'high',
            'layers': {
                'crisis_detector': crisis,
                'keyword_classifier': {'level': 'crisis', 'signals': crisis['matches'], 'score': 100},
                'clinical_boundary': {'unsafe_advice_language': False, 'signals': [], 'score': 0},
            },
        }

    keyword = _keyword_layer(text)
    boundary = _clinical_boundary_layer(text)
    score = max(int(keyword['score']), int(boundary['score']))
    risk_level = str(keyword['level'])
    if boundary['unsafe_advice_language'] and risk_level == 'low':
        risk_level = 'medium'
    confidence = 'high' if score >= 70 else 'medium' if score >= 40 else 'low'
    signals = [*keyword['signals'], *boundary['signals']]
    return {
        'risk_level': risk_level,
        'signals': signals,
        'safety_triggered': risk_level in {'medium', 'high'} or bool(boundary['unsafe_advice_language']),
        'score': score,
        'confidence': confidence,
        'layers': {
            'crisis_detector': crisis,
            'keyword_classifier': keyword,
            'clinical_boundary': boundary,
        },
    }
