from app.schemas.mood_schema import MoodEntry
from app.services.mood_service import record_mood

def test_record_mood_echoes_payload() -> None:
    entry = MoodEntry(label='calm', intensity=7)
    assert record_mood(entry).label == 'calm'
