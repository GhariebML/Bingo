from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.settings_schema import SettingsPayload

router = APIRouter()


def _get_or_create(db: Session, user: User) -> UserSettings:
    settings = db.scalar(select(UserSettings).where(UserSettings.user_id == user.id))
    if settings is None:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def _serialize(settings: UserSettings) -> SettingsPayload:
    return SettingsPayload(
        preferred_language=settings.preferred_language,
        response_style=settings.response_style,
        crisis_region=settings.crisis_region,
        save_journal_history=settings.save_journal_history,
        save_mood_history=settings.save_mood_history,
    )


@router.get('', response_model=SettingsPayload)
@router.get('/', response_model=SettingsPayload)
def get_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> SettingsPayload:
    return _serialize(_get_or_create(db, user))


@router.put('', response_model=SettingsPayload)
@router.put('/', response_model=SettingsPayload)
def update_settings(
    payload: SettingsPayload,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> SettingsPayload:
    settings = _get_or_create(db, user)
    settings.preferred_language = payload.preferred_language
    settings.response_style = payload.response_style
    settings.crisis_region = payload.crisis_region
    settings.save_journal_history = payload.save_journal_history
    settings.save_mood_history = payload.save_mood_history
    db.commit()
    db.refresh(settings)
    return _serialize(settings)
