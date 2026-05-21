from fastapi import APIRouter
from app.schemas.chat_schema import ChatRequest
from app.services.safety_service import check_text, disclaimer, region_resources

router = APIRouter()

@router.post('/check')
def check(payload: ChatRequest) -> dict[str, object]:
    return check_text(payload.message)


@router.get('/resources')
def resources(region: str | None = None) -> dict[str, str]:
    return region_resources(region)


@router.get('/disclaimer')
def safety_disclaimer() -> dict[str, object]:
    return disclaimer()
