from fastapi import APIRouter, HTTPException
from app.schemas.exercise_schema import Exercise
from app.services.exercise_service import get_exercise, list_exercises

router = APIRouter()

@router.get('', response_model=list[Exercise])
@router.get('/', response_model=list[Exercise])
def exercises() -> list[dict[str, object]]:
    return list_exercises()


@router.get('/{exercise_id}', response_model=Exercise)
def exercise_detail(exercise_id: str) -> dict[str, object]:
    exercise = get_exercise(exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail='Exercise not found')
    return exercise
