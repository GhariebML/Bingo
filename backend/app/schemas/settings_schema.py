from pydantic import BaseModel


class SettingsPayload(BaseModel):
    preferred_language: str = 'English'
    response_style: str = 'balanced'
    crisis_region: str = 'United States'
    save_journal_history: bool = True
    save_mood_history: bool = True

    # Dynamic AI provider columns
    ai_provider: str = 'mock'
    enable_real_ai: bool = False
    openai_api_key: str | None = None
    openai_model: str = 'gpt-4o-mini'
    openai_base_url: str | None = None
    openrouter_api_key: str | None = None
    openrouter_model: str = 'openai/gpt-4o-mini'
    openrouter_base_url: str = 'https://openrouter.ai/api/v1'
    hf_token: str | None = None
    hf_model: str | None = None
    hf_base_url: str | None = None
