from pydantic import BaseModel, ConfigDict, Field

class JournalEntry(BaseModel):
    id: int | None = None
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    mood: str | None = None
    emotion_tags: list[str] = []
    created_at: str | None = None


class StructuredJournalCreate(BaseModel):
    situation: str = Field(min_length=1)
    thought: str = Field(min_length=1)
    emotion: str = Field(min_length=1)
    action: str = Field(min_length=1)


class StructuredJournal(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    situation: str
    thought: str
    emotion: str
    action: str
    created_at: str


