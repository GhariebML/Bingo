import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'),
        env_file_encoding='utf-8',
        extra='ignore'
    )
    app_name: str = 'Bingo API'
    app_env: str = 'development'
    environment: str = 'local'
    database_url: str = 'postgresql+psycopg://bingo:change-me@localhost:5432/bingo'
    local_sqlite_fallback: bool = True
    ai_provider: str = 'mock'
    enable_real_ai: bool = False
    token_secret: str = 'local-dev-token-secret-change-before-production'
    access_token_ttl_seconds: int = 60 * 60 * 8
    auth_cookie_name: str = 'bingo_session'
    auth_cookie_secure: bool = False
    rate_limit_per_minute: int = 120
    openai_api_key: str | None = None
    openai_model: str = 'gpt-4o-mini'
    openai_base_url: str | None = None
    openrouter_api_key: str | None = None
    openrouter_model: str = 'openai/gpt-4o-mini'
    openrouter_base_url: str = 'https://openrouter.ai/api/v1'
    hf_token: str | None = None
    hf_model: str | None = None
    hf_base_url: str | None = None
    cors_origins: str = 'http://localhost:3000'

settings = Settings()
