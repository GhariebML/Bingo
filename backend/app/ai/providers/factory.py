import logging

from app.ai.providers.base import AIProvider
from app.ai.providers.huggingface_provider import HuggingfaceProvider
from app.ai.providers.mock_provider import MockProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.openrouter_provider import OpenRouterProvider
from app.ai.providers.pollinations_provider import PollinationsProvider
from app.config import settings

logger = logging.getLogger(__name__)


def get_provider() -> AIProvider:
    try:
        from app.main import is_test_mode
        if is_test_mode.get():
            return MockProvider()
    except Exception:
        pass

    provider = settings.ai_provider.lower().strip()
    if not settings.enable_real_ai or provider == 'mock':
        return MockProvider()
    if provider in ('pollinations', 'free'):
        return PollinationsProvider()
    if provider == 'openai' and settings.openai_api_key:
        return OpenAIProvider()
    if provider == 'openrouter' and settings.openrouter_api_key:
        return OpenRouterProvider()
    if provider == 'huggingface' and settings.hf_token and settings.hf_model:
        return HuggingfaceProvider()
    
    # If enable_real_ai is True, but the requested provider is missing keys,
    # fall back to the free Pollinations provider so they still get a real AI experience.
    logger.warning('AI provider configuration is incomplete; falling back to keyless free Pollinations provider.')
    return PollinationsProvider()

