from app.schemas.chat_schema import ChatRequest
from app.services.chat_service import generate_reply

def test_chat_returns_mock_reply() -> None:
    res = generate_reply(ChatRequest(message='I am stressed'))
    assert res.crisis_mode is False
    assert res.reply
    assert res.category == 'stress'
    assert res.suggested_exercise

def test_chat_crisis_mode() -> None:
    res = generate_reply(ChatRequest(message='I want to end my life'))
    assert res.crisis_mode is True
    assert res.risk_level == 'crisis'
    assert res.safety_triggered is True
    assert 'emergency services' in res.reply


def test_chat_mock_response_is_structured_for_anxiety() -> None:
    res = generate_reply(ChatRequest(message='I feel anxious and worried'))
    assert res.crisis_mode is False
    assert 'anxious' in res.reply.lower()
    assert '?' in res.reply
    assert 'breath' in res.reply.lower()


def test_chat_overthinking_response() -> None:
    res = generate_reply(ChatRequest(message='I am overthinking everything'))
    assert res.category == 'overthinking'
    assert res.suggested_exercise == 'Worry parking'
    assert '?' in res.reply


def test_chat_does_not_diagnose_or_prescribe() -> None:
    res = generate_reply(ChatRequest(message='I feel sad and tired'))
    lowered = res.reply.lower()
    assert 'diagnosed' not in lowered
    assert 'medication' not in lowered
