from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    if engine.url.get_backend_name() == 'sqlite':
        _ensure_sqlite_columns()


def _ensure_sqlite_columns() -> None:
    columns = {
        'email_verified': 'BOOLEAN DEFAULT 0 NOT NULL',
        'mfa_enabled': 'BOOLEAN DEFAULT 0 NOT NULL',
        'mfa_code_hash': 'VARCHAR(128)',
        'mfa_code_expires_at': 'DATETIME',
        'email_verification_hash': 'VARCHAR(128)',
        'email_verification_expires_at': 'DATETIME',
        'password_reset_hash': 'VARCHAR(128)',
        'password_reset_expires_at': 'DATETIME',
        'deleted_at': 'DATETIME',
    }
    with engine.begin() as connection:
        existing = {row[1] for row in connection.exec_driver_sql('PRAGMA table_info(users)').fetchall()}
        for name, column_type in columns.items():
            if name not in existing:
                connection.exec_driver_sql(f'ALTER TABLE users ADD COLUMN {name} {column_type}')
