from app.ai.providers.base import AIProvider
from app.ai.providers.factory import get_provider as select_provider


def get_provider(user_settings = None) -> AIProvider:
    return select_provider(user_settings)
