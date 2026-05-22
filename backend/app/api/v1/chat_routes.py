from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies import get_optional_user
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.chat_service import generate_reply
from app.models.user import User

router = APIRouter()

@router.post('', response_model=ChatResponse)
@router.post('/', response_model=ChatResponse)
def handle(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
) -> ChatResponse:
    return generate_reply(payload, user=user)
