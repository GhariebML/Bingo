from fastapi import APIRouter
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.chat_service import generate_reply

router = APIRouter()

@router.post('', response_model=ChatResponse)
@router.post('/', response_model=ChatResponse)
def handle(payload: ChatRequest) -> ChatResponse:
    return generate_reply(payload)
