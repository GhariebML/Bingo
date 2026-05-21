from app.schemas.journal_schema import JournalEntry
from app.models.journal import JournalEntryModel
from app.models.user import User
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

def save_entry(payload: JournalEntry) -> JournalEntry:
    return payload


def create_entry(db: Session, user: User, payload: JournalEntry) -> JournalEntry:
    entry = JournalEntryModel(
        user_id=user.id,
        title=payload.title,
        content=payload.content,
        mood=payload.mood,
        emotion_tags=','.join(payload.emotion_tags),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return serialize_entry(entry)


def list_entries(db: Session, user: User) -> list[JournalEntry]:
    entries = db.scalars(
        select(JournalEntryModel).where(JournalEntryModel.user_id == user.id).order_by(JournalEntryModel.created_at.desc())
    ).all()
    return [serialize_entry(entry) for entry in entries]


def get_entry(db: Session, user: User, entry_id: int) -> JournalEntry:
    entry = db.scalar(select(JournalEntryModel).where(JournalEntryModel.user_id == user.id, JournalEntryModel.id == entry_id))
    if entry is None:
        raise HTTPException(status_code=404, detail='Journal entry not found')
    return serialize_entry(entry)


def delete_entry(db: Session, user: User, entry_id: int) -> dict[str, str]:
    entry = db.scalar(select(JournalEntryModel).where(JournalEntryModel.user_id == user.id, JournalEntryModel.id == entry_id))
    if entry is None:
        raise HTTPException(status_code=404, detail='Journal entry not found')
    db.delete(entry)
    db.commit()
    return {'message': 'Journal entry deleted.'}


def serialize_entry(entry: JournalEntryModel) -> JournalEntry:
    return JournalEntry(
        id=entry.id,
        title=entry.title,
        content=entry.content,
        mood=entry.mood,
        emotion_tags=[tag for tag in entry.emotion_tags.split(',') if tag],
        created_at=entry.created_at.isoformat() if entry.created_at else None,
    )
