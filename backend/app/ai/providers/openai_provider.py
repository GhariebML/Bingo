from app.ai.providers.base import AIProvider, ProviderResponse
from app.config import settings
from app.ai.providers.mock_provider import MockProvider


class OpenAIProvider(AIProvider):
    name = 'openai'
    mode = 'real_ai_gated'

    def generate_response(
        self,
        messages: list[dict[str, str]],
        user_context: dict | None = None,
        safety_context: dict | None = None,
    ) -> str:
        try:
            from openai import OpenAI  # type: ignore
        except Exception as exc:
            raise RuntimeError('OpenAI SDK is not installed') from exc
        if not settings.openai_api_key:
            raise RuntimeError('OpenAI API key is not configured')
        client = OpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url or None)
        response = client.chat.completions.create(model=settings.openai_model, messages=messages)
        return response.choices[0].message.content or ''

    def complete(self, prompt: str, mood: str | None = None) -> ProviderResponse:
        try:
            text = self.generate_response([{'role': 'user', 'content': prompt}], {'mood': mood} if mood else None)
            fallback = MockProvider().complete(prompt, mood)
            return ProviderResponse(text, fallback.category, fallback.suggested_exercise, self.name, self.mode)
        except Exception:
            return MockProvider().complete(prompt, mood)
