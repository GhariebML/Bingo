import json
import urllib.request

from app.ai.providers.base import AIProvider
from app.config import settings

class HuggingfaceProvider(AIProvider):
    name = 'huggingface'
    mode = 'real_ai_gated'

    def generate_response(
        self,
        messages: list[dict[str, str]],
        user_context: dict | None = None,
        safety_context: dict | None = None,
    ) -> str:
        if not settings.hf_token or not settings.hf_model:
            raise RuntimeError('Hugging Face token/model is not configured')
        prompt = '\n'.join(f"{message['role']}: {message['content']}" for message in messages)
        url = settings.hf_base_url or f'https://api-inference.huggingface.co/models/{settings.hf_model}'
        request = urllib.request.Request(
            url,
            data=json.dumps({'inputs': prompt}).encode(),
            headers={'Authorization': f'Bearer {settings.hf_token}', 'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode())
        if isinstance(payload, list) and payload and isinstance(payload[0], dict):
            return str(payload[0].get('generated_text') or payload[0].get('summary_text') or '')
        return str(payload)
