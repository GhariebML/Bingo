from pydantic import BaseModel


class SettingsPayload(BaseModel):
    preferred_language: str = 'English'
    response_style: str = 'balanced'
    crisis_region: str = 'United States'
    save_journal_history: bool = True
    save_mood_history: bool = True
