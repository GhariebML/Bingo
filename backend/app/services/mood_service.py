from app.schemas.mood_schema import MoodEntry
from app.models.mood import MoodEntryModel
from app.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import Session

def record_mood(payload: MoodEntry) -> MoodEntry:
    return payload


def create_mood(db: Session, user: User, payload: MoodEntry) -> MoodEntry:
    entry = MoodEntryModel(user_id=user.id, label=payload.label, intensity=payload.intensity, note=payload.note)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return serialize_mood(entry)


def list_moods(db: Session, user: User) -> list[MoodEntry]:
    entries = db.scalars(
        select(MoodEntryModel).where(MoodEntryModel.user_id == user.id).order_by(MoodEntryModel.created_at.desc())
    ).all()
    return [serialize_mood(entry) for entry in entries]


def serialize_mood(entry: MoodEntryModel) -> MoodEntry:
    return MoodEntry(
        id=entry.id,
        label=entry.label,
        intensity=entry.intensity,
        note=entry.note,
        created_at=entry.created_at.isoformat() if entry.created_at else None,
    )


def mock_trend() -> dict[str, object]:
    return {
        'summary': 'Mock mood trend for MVP demo',
        'current_mood': 'anxious',
        'suggested_exercise': '4-7-8 breathing',
        'points': [
            {'day': 'Mon', 'mood': 'stressed', 'score': 4},
            {'day': 'Tue', 'mood': 'anxious', 'score': 5},
            {'day': 'Wed', 'mood': 'calmer', 'score': 6},
            {'day': 'Thu', 'mood': 'hopeful', 'score': 7},
            {'day': 'Fri', 'mood': 'tired', 'score': 5},
        ],
        'common_tags': ['anxious', 'stressed', 'hopeful'],
    }


def summarize_moods(db: Session, user: User) -> dict[str, object]:
    entries = list_moods(db, user)
    if not entries:
        return {
            'mood_checkins': 0,
            'current_mood': 'not yet checked in',
            'average_intensity': None,
            'most_common_emotions': [],
            'suggested_exercise': 'One small step planning',
            'mood_trend': mock_trend()['points'],
        }
    counts: dict[str, int] = {}
    for entry in entries:
        counts[entry.label] = counts.get(entry.label, 0) + 1
    common = sorted(counts, key=lambda label: counts[label], reverse=True)[:3]
    trend = [
        {'day': f'#{index + 1}', 'mood': entry.label, 'score': entry.intensity}
        for index, entry in enumerate(reversed(entries[:7]))
    ]
    return {
        'mood_checkins': len(entries),
        'current_mood': entries[0].label,
        'average_intensity': round(sum(entry.intensity for entry in entries) / len(entries), 1),
        'most_common_emotions': common,
        'suggested_exercise': '4-7-8 breathing' if any(label in common for label in ['anxious', 'stressed']) else 'One small step planning',
        'mood_trend': trend,
    }
