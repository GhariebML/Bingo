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
        ai_provider=settings.ai_provider,
        enable_real_ai=settings.enable_real_ai,
        openai_api_key=settings.openai_api_key,
        openai_model=settings.openai_model,
        openai_base_url=settings.openai_base_url,
        openrouter_api_key=settings.openrouter_api_key,
        openrouter_model=settings.openrouter_model,
        openrouter_base_url=settings.openrouter_base_url,
        hf_token=settings.hf_token,
        hf_model=settings.hf_model,
        hf_base_url=settings.hf_base_url,
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
    
    settings.ai_provider = payload.ai_provider
    settings.enable_real_ai = payload.enable_real_ai
    settings.openai_api_key = payload.openai_api_key
    settings.openai_model = payload.openai_model
    settings.openai_base_url = payload.openai_base_url
    settings.openrouter_api_key = payload.openrouter_api_key
    settings.openrouter_model = payload.openrouter_model
    settings.openrouter_base_url = payload.openrouter_base_url
    settings.hf_token = payload.hf_token
    settings.hf_model = payload.hf_model
    settings.hf_base_url = payload.hf_base_url
    
    db.commit()
    db.refresh(settings)
    return _serialize(settings)
