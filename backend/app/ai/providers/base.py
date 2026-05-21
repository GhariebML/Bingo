from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class ProviderResponse:
    reply: str
    category: str
    suggested_exercise: str
    provider: str = 'mock'
    mode: str = 'demo'

class AIProvider(ABC):
    name: str = 'mock'
    mode: str = 'demo'

    @abstractmethod
    def generate_response(
        self,
        messages: list[dict[str, str]],
        user_context: dict | None = None,
        safety_context: dict | None = None,
    ) -> str:
        raise NotImplementedError

    def complete(self, prompt: str, mood: str | None = None) -> ProviderResponse:
        text = self.generate_response(
            [{'role': 'user', 'content': prompt}],
            user_context={'mood': mood} if mood else None,
            safety_context=None,
        )
        return ProviderResponse(reply=text, category='general_support', suggested_exercise='One small step planning', provider=self.name, mode=self.mode)
