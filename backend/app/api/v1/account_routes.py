from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.audit import AuditEvent
from app.models.journal import JournalEntryModel
from app.models.mood import MoodEntryModel
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.user_schema import MessageResponse
from app.services.journal_service import serialize_entry
from app.services.mood_service import serialize_mood

router = APIRouter()


def _audit(db: Session, event_type: str, user: User, detail: str = '') -> None:
    db.add(AuditEvent(user_id=user.id, event_type=event_type, detail=detail))


@router.get('/export')
def export_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict[str, object]:
    journals = db.scalars(select(JournalEntryModel).where(JournalEntryModel.user_id == user.id)).all()
    moods = db.scalars(select(MoodEntryModel).where(MoodEntryModel.user_id == user.id)).all()
    settings = db.scalar(select(UserSettings).where(UserSettings.user_id == user.id))
    audit_events = db.scalars(select(AuditEvent).where(AuditEvent.user_id == user.id)).all()
    _audit(db, 'account.exported', user)
    db.commit()
    return {
        'user': {
            'id': user.id,
            'email': user.email,
            'display_name': user.display_name,
            'email_verified': user.email_verified,
            'mfa_enabled': user.mfa_enabled,
            'created_at': user.created_at.isoformat() if user.created_at else None,
        },
        'settings': {
            'preferred_language': settings.preferred_language,
            'response_style': settings.response_style,
            'crisis_region': settings.crisis_region,
            'save_journal_history': settings.save_journal_history,
            'save_mood_history': settings.save_mood_history,
        } if settings else None,
        'journal_entries': [serialize_entry(entry).model_dump() for entry in journals],
        'mood_entries': [serialize_mood(entry).model_dump() for entry in moods],
        'audit_events': [
            {
                'event_type': event.event_type,
                'detail': event.detail,
                'created_at': event.created_at.isoformat() if event.created_at else None,
            }
            for event in audit_events
        ],
    }


@router.delete('', response_model=MessageResponse)
@router.delete('/', response_model=MessageResponse)
def delete_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> MessageResponse:
    user.deleted_at = datetime.now(timezone.utc)
    _audit(db, 'account.deleted', user)
    db.commit()
    return MessageResponse(message='Account marked for deletion and login disabled.')
