import logging

from app.ai.providers.base import AIProvider
from app.ai.providers.huggingface_provider import HuggingfaceProvider
from app.ai.providers.mock_provider import MockProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.openrouter_provider import OpenRouterProvider
from app.config import settings

logger = logging.getLogger(__name__)


def get_provider() -> AIProvider:
    provider = settings.ai_provider.lower().strip()
    if not settings.enable_real_ai or provider == 'mock':
        return MockProvider()
    if provider == 'openai' and settings.openai_api_key:
        return OpenAIProvider()
    if provider == 'openrouter' and settings.openrouter_api_key:
        return OpenRouterProvider()
    if provider == 'huggingface' and settings.hf_token and settings.hf_model:
        return HuggingfaceProvider()
    logger.warning('Invalid or incomplete AI provider configuration; falling back to mock provider.')
    return MockProvider()
