from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.v1.router import router as v1_router
from app.config import settings
from app.core.rate_limit import rate_limit_middleware
from app.db.database import init_db

from contextlib import asynccontextmanager

from contextvars import ContextVar
from fastapi import Request
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import global_exception_handler, http_exception_handler

is_test_mode: ContextVar[bool] = ContextVar('is_test_mode', default=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title='Bingo API', version='0.1.0', lifespan=lifespan)

app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

@app.middleware("http")
async def test_mode_middleware(request: Request, call_next):
    token = is_test_mode.set(request.headers.get("x-bingo-test-mode") == "true")
    try:
        return await call_next(request)
    finally:
        is_test_mode.reset(token)

app.middleware('http')(rate_limit_middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(',')],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(health_router)
app.include_router(v1_router, prefix='/api/v1')

