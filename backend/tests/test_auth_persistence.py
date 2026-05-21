from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def _register(client: TestClient) -> str:
    email = f'user-{uuid4().hex}@example.com'
    response = client.post('/api/v1/auth/register', json={'email': email, 'password': 'strong-password', 'display_name': 'Test User'})
    assert response.status_code == 200
    return response.json()['token']


def test_owned_journal_mood_and_settings_persist() -> None:
    with TestClient(app) as client:
        token = _register(client)
        headers = {'Authorization': f'Bearer {token}'}

        journal = client.post(
            '/api/v1/journal',
            headers=headers,
            json={'title': 'Owned note', 'content': 'Private reflection', 'mood': 'calm', 'emotion_tags': ['calm']},
        )
        assert journal.status_code == 200
        assert journal.json()['title'] == 'Owned note'

        mood = client.post('/api/v1/mood', headers=headers, json={'label': 'hopeful', 'intensity': 8})
        assert mood.status_code == 200
        assert mood.json()['label'] == 'hopeful'

        settings = client.put(
            '/api/v1/settings',
            headers=headers,
            json={
                'preferred_language': 'Both',
                'response_style': 'short',
                'crisis_region': 'Egypt',
                'save_journal_history': True,
                'save_mood_history': True,
            },
        )
        assert settings.status_code == 200
        assert settings.json()['crisis_region'] == 'Egypt'

        assert len(client.get('/api/v1/journal', headers=headers).json()) >= 1
        assert len(client.get('/api/v1/mood', headers=headers).json()) >= 1


def test_owned_routes_require_authentication() -> None:
    with TestClient(app) as client:
        assert client.get('/api/v1/journal').status_code == 401
        assert client.get('/api/v1/mood').status_code == 401
        assert client.get('/api/v1/settings').status_code == 401
