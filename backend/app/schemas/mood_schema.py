from pydantic import BaseModel, Field

class MoodEntry(BaseModel):
    id: int | None = None
    label: str
    intensity: int = Field(ge=1, le=10)
    note: str | None = None
    created_at: str | None = None
