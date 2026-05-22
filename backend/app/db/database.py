from sqlalchemy import inspect
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_columns()


def _ensure_columns() -> None:
    inspector = inspect(engine)
    
    # 1. Ensure users table columns exist
    users_columns = [col['name'] for col in inspector.get_columns('users')]
    users_to_add = {
        'email_verified': ('BOOLEAN', '0', 'NOT NULL'),
        'mfa_enabled': ('BOOLEAN', '0', 'NOT NULL'),
        'mfa_code_hash': ('VARCHAR(128)', 'NULL', ''),
        'mfa_code_expires_at': ('DATETIME' if engine.url.get_backend_name() == 'sqlite' else 'TIMESTAMP', 'NULL', ''),
        'email_verification_hash': ('VARCHAR(128)', 'NULL', ''),
        'email_verification_expires_at': ('DATETIME' if engine.url.get_backend_name() == 'sqlite' else 'TIMESTAMP', 'NULL', ''),
        'password_reset_hash': ('VARCHAR(128)', 'NULL', ''),
        'password_reset_expires_at': ('DATETIME' if engine.url.get_backend_name() == 'sqlite' else 'TIMESTAMP', 'NULL', ''),
        'deleted_at': ('DATETIME' if engine.url.get_backend_name() == 'sqlite' else 'TIMESTAMP', 'NULL', ''),
    }
    
    with engine.begin() as connection:
        for name, (col_type, default, nullability) in users_to_add.items():
            if name not in users_columns:
                default_clause = f"DEFAULT {default}" if default != 'NULL' else ""
                connection.exec_driver_sql(
                    f'ALTER TABLE users ADD COLUMN {name} {col_type} {default_clause} {nullability}'.strip()
                )
                
        # 2. Ensure user_settings table columns exist
        settings_columns = [col['name'] for col in inspector.get_columns('user_settings')]
        settings_to_add = {
            'ai_provider': ('VARCHAR(40)', "'mock'", 'NOT NULL'),
            'enable_real_ai': ('BOOLEAN', '0', 'NOT NULL'),
            'openai_api_key': ('VARCHAR(255)', 'NULL', ''),
            'openai_model': ('VARCHAR(80)', "'gpt-4o-mini'", 'NOT NULL'),
            'openai_base_url': ('VARCHAR(255)', 'NULL', ''),
            'openrouter_api_key': ('VARCHAR(255)', 'NULL', ''),
            'openrouter_model': ('VARCHAR(80)', "'openai/gpt-4o-mini'", 'NOT NULL'),
            'openrouter_base_url': ('VARCHAR(255)', "'https://openrouter.ai/api/v1'", 'NOT NULL'),
            'hf_token': ('VARCHAR(255)', 'NULL', ''),
            'hf_model': ('VARCHAR(120)', 'NULL', ''),
            'hf_base_url': ('VARCHAR(255)', 'NULL', ''),
        }
        
        for name, (col_type, default, nullability) in settings_to_add.items():
            if name not in settings_columns:
                db_default = default
                if col_type == 'BOOLEAN':
                    db_default = '0' if engine.url.get_backend_name() == 'sqlite' else 'false'
                default_clause = f"DEFAULT {db_default}" if db_default != 'NULL' else ""
                connection.exec_driver_sql(
                    f'ALTER TABLE user_settings ADD COLUMN {name} {col_type} {default_clause} {nullability}'.strip()
                )

