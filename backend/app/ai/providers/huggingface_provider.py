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
        
        # Determine the base URL. For standard chat models, we want the chat completions endpoint.
        base = self.base_url or f'https://api-inference.huggingface.co/models/{self.model}'
        url = base if 'v1/chat/completions' in base else f'{base.rstrip("/")}/v1/chat/completions'
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 512,
            "temperature": 0.7,
        }
        
        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
            method='POST',
        )
        
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                resp_data = json.loads(response.read().decode())
                
                # Parse the OpenAI-compatible response format
                if isinstance(resp_data, dict) and 'choices' in resp_data:
                    return str(resp_data['choices'][0]['message']['content'])
                
                # Fallback for alternative HF response structures
                if isinstance(resp_data, list) and resp_data and isinstance(resp_data[0], dict):
                    return str(resp_data[0].get('generated_text') or resp_data[0].get('summary_text') or '')
                    
                return str(resp_data)
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode(errors='ignore')
            raise RuntimeError(f"Hugging Face API Error {e.code}: {err_msg}")
        except Exception as e:
            raise RuntimeError(f"Hugging Face Request Failed: {str(e)}")
