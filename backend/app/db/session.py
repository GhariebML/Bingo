from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings


def _db_url() -> str:
    if settings.database_url.startswith('sqlite'):
        return settings.database_url
    if settings.environment == 'local' and settings.local_sqlite_fallback:
        # Local CLI/test runs stay self-contained unless DATABASE_URL is explicitly used with Docker.
        return 'sqlite:///./bingo.db'
    return settings.database_url


engine = create_engine(_db_url(), connect_args={'check_same_thread': False} if _db_url().startswith('sqlite') else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
