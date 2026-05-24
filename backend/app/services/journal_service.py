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


from app.models.journal import StructuredJournalModel
from app.schemas.journal_schema import StructuredJournal, StructuredJournalCreate

def create_structured_entry(db: Session, user: User, payload: StructuredJournalCreate) -> StructuredJournal:
    entry = StructuredJournalModel(
        user_id=user.id,
        situation=payload.situation,
        thought=payload.thought,
        emotion=payload.emotion,
        action=payload.action,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return serialize_structured_entry(entry)

def list_structured_entries(db: Session, user: User) -> list[StructuredJournal]:
    entries = db.scalars(
        select(StructuredJournalModel)
        .where(StructuredJournalModel.user_id == user.id)
        .order_by(StructuredJournalModel.created_at.desc())
    ).all()
    return [serialize_structured_entry(entry) for entry in entries]

def serialize_structured_entry(entry: StructuredJournalModel) -> StructuredJournal:
    return StructuredJournal(
        id=entry.id,
        user_id=entry.user_id,
        situation=entry.situation,
        thought=entry.thought,
        emotion=entry.emotion,
        action=entry.action,
        created_at=entry.created_at.isoformat() if entry.created_at else None,
    )

