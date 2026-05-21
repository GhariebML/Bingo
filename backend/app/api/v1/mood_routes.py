from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.mood_schema import MoodEntry, MoodEntry
from app.services.mood_service import create_mood, list_moods, mock_trend, summarize_moods

router = APIRouter()

@router.post('/', response_model=MoodEntry)
def handle(payload: MoodEntry, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> MoodEntry:
    return create_mood(db, user, payload)


@router.post('', response_model=MoodEntry)
def handle_no_slash(payload: MoodEntry, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> MoodEntry:
    return create_mood(db, user, payload)


@router.post('/check-in', response_model=MoodEntry)
def check_in(payload: MoodEntry, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> MoodEntry:
    return create_mood(db, user, payload)


@router.get('', response_model=list[MoodEntry])
@router.get('/', response_model=list[MoodEntry])
def list_owned(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[MoodEntry]:
    return list_moods(db, user)


@router.get('/mock-trend')
def trend() -> dict[str, object]:
    return mock_trend()


@router.get('/summary')
def summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict[str, object]:
    return summarize_moods(db, user)
