from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.v1.router import router as v1_router
from app.config import settings
from app.core.rate_limit import rate_limit_middleware
from app.db.database import init_db

app = FastAPI(title='Bingo API', version='0.1.0')
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


@app.on_event('startup')
def startup() -> None:
    init_db()
