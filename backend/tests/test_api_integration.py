from uuid import uuid4

from fastapi.testclient import TestClient

from app.ai.providers.factory import get_provider
from app.config import settings
from app.main import app


def _headers(client: TestClient) -> dict[str, str]:
    response = client.post(
        '/api/v1/auth/register',
        json={'email': f'{uuid4().hex}@example.com', 'password': 'strong-password', 'display_name': 'API Test'},
    )
    assert response.status_code == 200
    return {'Authorization': f"Bearer {response.json()['token']}"}


def test_provider_falls_back_to_mock_when_real_ai_disabled() -> None:
    original_provider = settings.ai_provider
    original_enabled = settings.enable_real_ai
    settings.ai_provider = 'openai'
    settings.enable_real_ai = False
    try:
        assert get_provider().name == 'mock'
    finally:
        settings.ai_provider = original_provider
        settings.enable_real_ai = original_enabled


def test_public_exercises_and_safety_endpoints() -> None:
    with TestClient(app) as client:
        exercises = client.get('/api/v1/exercises')
        assert exercises.status_code == 200
        assert exercises.json()[0]['duration_minutes'] > 0

        detail = client.get('/api/v1/exercises/4-7-8-breathing')
        assert detail.status_code == 200
        assert detail.json()['title'] == '4-7-8 breathing'

        resources = client.get('/api/v1/safety/resources?region=Egypt')
        assert resources.status_code == 200
        assert 'emergency' in resources.json()

        disclaimer = client.get('/api/v1/safety/disclaimer')
        assert disclaimer.status_code == 200
        assert 'not a therapist' in disclaimer.json()['message']


def test_owned_dashboard_mood_journal_and_settings_endpoints() -> None:
    with TestClient(app) as client:
        headers = _headers(client)
        mood = client.post('/api/v1/mood/check-in', headers=headers, json={'label': 'anxious', 'intensity': 4})
        assert mood.status_code == 200

        summary = client.get('/api/v1/mood/summary', headers=headers)
        assert summary.status_code == 200
        assert summary.json()['mood_checkins'] >= 1

        journal = client.post('/api/v1/journal', headers=headers, json={'title': 'API note', 'content': 'A saved thought.', 'emotion_tags': ['anxious']})
        assert journal.status_code == 200
        entry_id = journal.json()['id']

        detail = client.get(f'/api/v1/journal/{entry_id}', headers=headers)
        assert detail.status_code == 200

        dashboard = client.get('/api/v1/dashboard/summary', headers=headers)
        assert dashboard.status_code == 200
        assert dashboard.json()['journal_entries'] >= 1

        settings_response = client.put(
            '/api/v1/settings',
            headers=headers,
            json={
                'preferred_language': 'English',
                'response_style': 'short',
                'crisis_region': 'Global',
                'save_journal_history': True,
                'save_mood_history': True,
            },
        )
        assert settings_response.status_code == 200

        deleted = client.delete(f'/api/v1/journal/{entry_id}', headers=headers)
        assert deleted.status_code == 200


def test_crisis_chat_uses_safe_response_without_real_provider() -> None:
    with TestClient(app) as client:
        response = client.post('/api/v1/chat', json={'message': 'I want to end my life'})
        assert response.status_code == 200
        body = response.json()
        assert body['risk_level'] == 'crisis'
        assert body['provider'] == 'mock'
        assert body['safety_triggered'] is True


def test_structured_journal_and_breathing_sessions() -> None:
    with TestClient(app) as client:
        headers = _headers(client)

        breathe = client.post(
            '/api/v1/exercises/breathing',
            headers=headers,
            json={'duration_seconds': 120, 'cycles': 3}
        )
        assert breathe.status_code == 200
        breathe_data = breathe.json()
        assert breathe_data['duration_seconds'] == 120
        assert breathe_data['cycles'] == 3
        assert 'id' in breathe_data

        history = client.get('/api/v1/exercises/breathing', headers=headers)
        assert history.status_code == 200
        assert len(history.json()) >= 1

        structured = client.post(
            '/api/v1/journal/structured',
            headers=headers,
            json={
                'situation': 'Hard class',
                'thought': 'I cannot do it',
                'emotion': 'Overwhelmed',
                'action': 'Break task into small steps'
            }
        )
        assert structured.status_code == 200
        structured_data = structured.json()
        assert structured_data['situation'] == 'Hard class'
        assert structured_data['thought'] == 'I cannot do it'
        assert 'id' in structured_data

        s_list = client.get('/api/v1/journal/structured', headers=headers)
        assert s_list.status_code == 200
        assert len(s_list.json()) >= 1

