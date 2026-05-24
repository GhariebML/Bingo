from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.exercise_schema import Exercise, BreathingSession, BreathingSessionCreate
from app.services.exercise_service import (
    get_exercise,
    list_exercises,
    create_breathing_session,
    list_breathing_sessions,
)

router = APIRouter()

@router.get('', response_model=list[Exercise])
@router.get('/', response_model=list[Exercise])
def exercises() -> list[dict[str, object]]:
    return list_exercises()


@router.post('/breathing', response_model=BreathingSession)
@router.post('/breathing/', response_model=BreathingSession)
def record_breathing(
    payload: BreathingSessionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> BreathingSession:
    return create_breathing_session(db, user, payload)


@router.get('/breathing', response_model=list[BreathingSession])
@router.get('/breathing/', response_model=list[BreathingSession])
def get_breathing_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[BreathingSession]:
    return list_breathing_sessions(db, user)


@router.get('/{exercise_id}', response_model=Exercise)
def exercise_detail(exercise_id: str) -> dict[str, object]:
    exercise = get_exercise(exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail='Exercise not found')
    return exercise

