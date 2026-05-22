import logging

from app.ai.providers.base import AIProvider
from app.ai.providers.huggingface_provider import HuggingfaceProvider
from app.ai.providers.mock_provider import MockProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.openrouter_provider import OpenRouterProvider
from app.ai.providers.pollinations_provider import PollinationsProvider
from app.config import settings

logger = logging.getLogger(__name__)


def get_provider(user_settings = None) -> AIProvider:
    try:
        from app.main import is_test_mode
        if is_test_mode.get():
            return MockProvider()
    except Exception:
        pass

    # Read from user_settings if provided, otherwise from global settings
    if user_settings is not None:
        ai_provider = user_settings.ai_provider
        enable_real_ai = user_settings.enable_real_ai
        openai_api_key = user_settings.openai_api_key
        openai_model = user_settings.openai_model
        openai_base_url = user_settings.openai_base_url
        openrouter_api_key = user_settings.openrouter_api_key
        openrouter_model = user_settings.openrouter_model
        openrouter_base_url = user_settings.openrouter_base_url
        hf_token = user_settings.hf_token
        hf_model = user_settings.hf_model
        hf_base_url = user_settings.hf_base_url
    else:
        ai_provider = settings.ai_provider
        enable_real_ai = settings.enable_real_ai
        openai_api_key = settings.openai_api_key
        openai_model = settings.openai_model
        openai_base_url = settings.openai_base_url
        openrouter_api_key = settings.openrouter_api_key
        openrouter_model = settings.openrouter_model
        openrouter_base_url = settings.openrouter_base_url
        hf_token = settings.hf_token
        hf_model = settings.hf_model
        hf_base_url = settings.hf_base_url

    provider = ai_provider.lower().strip() if ai_provider else 'mock'
    if not enable_real_ai or provider == 'mock':
        return MockProvider()
    if provider in ('pollinations', 'free'):
        return PollinationsProvider()
    if provider == 'openai' and openai_api_key:
        return OpenAIProvider(api_key=openai_api_key, model=openai_model, base_url=openai_base_url)
    if provider == 'openrouter' and openrouter_api_key:
        return OpenRouterProvider(api_key=openrouter_api_key, model=openrouter_model, base_url=openrouter_base_url)
    if provider == 'huggingface' and hf_token and hf_model:
        return HuggingfaceProvider(token=hf_token, model=hf_model, base_url=hf_base_url)
    
    # If enable_real_ai is True, but the requested provider is missing keys,
    # fall back to the free Pollinations provider so they still get a real AI experience.
    logger.warning('AI provider configuration is incomplete; falling back to keyless free Pollinations provider.')
    return PollinationsProvider()

