from pydantic import BaseModel, Field

class JournalEntry(BaseModel):
    id: int | None = None
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    mood: str | None = None
    emotion_tags: list[str] = []
    created_at: str | None = None
