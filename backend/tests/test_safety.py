from app.ai.guardrails.crisis_detector import detect_crisis
from app.ai.guardrails.risk_classifier import classify_risk
from app.ai.guardrails.response_validator import validate_response
from app.services.crisis_resources import get_resources

def test_detects_crisis_language() -> None:
    assert detect_crisis('I want to kill myself')['is_crisis'] is True

def test_standard_language_not_crisis() -> None:
    assert detect_crisis('I feel stressed today')['is_crisis'] is False


def test_detects_multiple_crisis_patterns() -> None:
    examples = [
        'I want to die',
        'I might overdose tonight',
        'I am unsafe at home',
        'I want to hurt someone',
        'I do not want to be alive',
        'I cannot stay safe and there is a weapon',
    ]
    for example in examples:
        assert detect_crisis(example)['is_crisis'] is True


def test_response_validator_removes_clinical_claims() -> None:
    cleaned, notes = validate_response('I am your therapist and you are diagnosed with panic.')
    assert 'i am your therapist' not in cleaned.lower()
    assert notes


def test_layered_risk_classifier_and_region_resources() -> None:
    high_risk = classify_risk('I feel trapped and cannot cope')
    assert high_risk['risk_level'] == 'high'
    assert high_risk['score'] >= 70
    assert 'keyword_classifier' in high_risk['layers']

    clinical_boundary = classify_risk('You have depression and should stop taking your medication')
    assert clinical_boundary['risk_level'] == 'medium'
    assert clinical_boundary['safety_triggered'] is True

    assert classify_risk('I feel okay today')['risk_level'] == 'low'
    assert '988' in get_resources('United States')['crisis_line']
    assert '123' in get_resources('Egypt')['emergency']
    assert get_resources('Canada')['source'] == 'https://988.ca/'
