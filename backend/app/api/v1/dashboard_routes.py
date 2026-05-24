from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.exercise_service import list_exercises, list_breathing_sessions
from app.services.journal_service import list_entries, list_structured_entries
from app.services.mood_service import summarize_moods

router = APIRouter()


@router.get('/summary')
def summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict[str, object]:
    journals = list_entries(db, user)
    structured_journals = list_structured_entries(db, user)
    breathing_sessions = list_breathing_sessions(db, user)
    mood_summary = summarize_moods(db, user)
    
    return {
        'journal_entries': len(journals) + len(structured_journals),
        'mood_checkins': mood_summary['mood_checkins'],
        'exercises_tried': len(breathing_sessions),
        'most_common_emotions': mood_summary['most_common_emotions'],
        'suggested_exercise': mood_summary['suggested_exercise'],
        'today_reflection': 'Choose one feeling to name and one small step for the next ten minutes.',
        'mood_trend': mood_summary['mood_trend'],
        'recommended_exercises': list_exercises()[:3],
    }

