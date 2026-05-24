from pydantic import BaseModel, ConfigDict

class Exercise(BaseModel):
    id: str
    title: str
    category: str
    duration_minutes: int
    purpose: str
    steps: list[str]
    recommended_for: list[str]


class BreathingSessionCreate(BaseModel):
    duration_seconds: int
    cycles: int


class BreathingSession(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    duration_seconds: int
    cycles: int
    created_at: str


