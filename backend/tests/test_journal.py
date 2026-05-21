from app.schemas.journal_schema import JournalEntry
from app.services.journal_service import save_entry

def test_save_journal_echoes_payload() -> None:
    entry = JournalEntry(title='Today', content='I noticed progress.')
    assert save_entry(entry).title == 'Today'
