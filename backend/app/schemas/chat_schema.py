from pydantic import BaseModel, Field
from typing import List

class ChatHistoryMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    mood: str | None = None
    conversation_id: str | None = None
    history: List[ChatHistoryMessage] | None = None

class ChatResponse(BaseModel):
    reply: str
    risk_level: str = 'low'
    category: str = 'general_support'
    suggested_exercise: str = 'One small step planning'
    safety_triggered: bool = False
    crisis_mode: bool = False
    safety_notes: list[str] = []
    provider: str = 'mock'
    mode: str = 'demo'
