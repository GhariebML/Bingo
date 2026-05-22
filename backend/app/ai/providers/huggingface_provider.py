import json
import urllib.request

from app.ai.providers.base import AIProvider
from app.config import settings

class HuggingfaceProvider(AIProvider):
    name = 'huggingface'
    mode = 'real_ai_gated'

    def __init__(self, token: str | None = None, model: str | None = None, base_url: str | None = None):
        self.token = token or settings.hf_token
        self.model = model or settings.hf_model
        self.base_url = base_url or settings.hf_base_url

    def generate_response(
        self,
        messages: list[dict[str, str]],
        user_context: dict | None = None,
        safety_context: dict | None = None,
    ) -> str:
        if not self.token or not self.model:
            raise RuntimeError('Hugging Face token/model is not configured')
        prompt = '\n'.join(f"{message['role']}: {message['content']}" for message in messages)
        url = self.base_url or f'https://api-inference.huggingface.co/models/{self.model}'
        request = urllib.request.Request(
            url,
            data=json.dumps({'inputs': prompt}).encode(),
            headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode())
        if isinstance(payload, list) and payload and isinstance(payload[0], dict):
            return str(payload[0].get('generated_text') or payload[0].get('summary_text') or '')
        return str(payload)
