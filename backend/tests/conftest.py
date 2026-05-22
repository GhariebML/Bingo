import pytest
from app.config import settings

@pytest.fixture(autouse=True)
def disable_real_ai_for_testing():
    original_provider = settings.ai_provider
    original_enabled = settings.enable_real_ai
    
    settings.ai_provider = 'mock'
    settings.enable_real_ai = False
    
    yield
    
    settings.ai_provider = original_provider
    settings.enable_real_ai = original_enabled
