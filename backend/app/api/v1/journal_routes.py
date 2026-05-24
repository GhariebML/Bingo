from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.journal_schema import (
    JournalEntry,
    StructuredJournal,
    StructuredJournalCreate,
)
from app.services.journal_service import (
    create_entry,
    delete_entry,
    get_entry,
    list_entries,
    create_structured_entry,
    list_structured_entries,
)

router = APIRouter()

@router.post('/', response_model=JournalEntry)
def handle(payload: JournalEntry, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> JournalEntry:
    return create_entry(db, user, payload)


@router.post('', response_model=JournalEntry)
def handle_no_slash(payload: JournalEntry, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> JournalEntry:
    return create_entry(db, user, payload)


@router.post('/structured', response_model=StructuredJournal)
@router.post('/structured/', response_model=StructuredJournal)
def handle_structured(
    payload: StructuredJournalCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> StructuredJournal:
    return create_structured_entry(db, user, payload)


@router.get('/structured', response_model=list[StructuredJournal])
@router.get('/structured/', response_model=list[StructuredJournal])
def list_structured(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[StructuredJournal]:
    return list_structured_entries(db, user)


@router.get('', response_model=list[JournalEntry])
@router.get('/', response_model=list[JournalEntry])
def list_owned(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[JournalEntry]:
    return list_entries(db, user)


@router.get('/{entry_id}', response_model=JournalEntry)
def detail(entry_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> JournalEntry:
    return get_entry(db, user, entry_id)


@router.delete('/{entry_id}')
def delete(entry_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict[str, str]:
    return delete_entry(db, user, entry_id)

