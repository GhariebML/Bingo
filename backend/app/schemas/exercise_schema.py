from pydantic import BaseModel

class Exercise(BaseModel):
    id: str
    title: str
    category: str
    duration_minutes: int
    purpose: str
    steps: list[str]
    recommended_for: list[str]
