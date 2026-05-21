from app.ai.providers.base import AIProvider, ProviderResponse


RESPONSES: dict[str, tuple[str, str]] = {
    'anxiety': (
        'That anxious feeling can be really uncomfortable, and it makes sense that your body is on alert. It sounds like your mind is scanning for what might go wrong and trying to protect you. What feels most urgent right now? Try placing both feet on the floor and taking three slow breaths before choosing one tiny next action.',
        '4-7-8 breathing',
    ),
    'overthinking': (
        'Overthinking can feel like being caught in a loop. It sounds like your mind is replaying the same thought because it wants certainty. What is the one question your mind keeps asking? Write it down once, then write one fact you know for sure.',
        'Worry parking',
    ),
    'sadness': (
        'I am sorry today feels heavy. It sounds like something hurtful or disappointing is asking for care. What part of the day felt hardest to carry? Choose one kind action for yourself, even if it is only getting water or stepping away for two minutes.',
        'Calm body scan',
    ),
    'stress': (
        'That sounds like a lot to hold at once. It seems like several demands are competing for your attention and energy. Which one thing truly needs attention first? Pick a ten-minute step and let everything else wait until that step is done.',
        'Study/work reset',
    ),
    'motivation': (
        'It makes sense to want momentum when starting feels hard. It sounds like the task may feel too big from where you are standing. What would count as progress in the next ten minutes? Make the first step so small it feels almost too easy.',
        'One small step planning',
    ),
    'decision_making': (
        'Decision pressure can be draining. It sounds like you are trying to avoid the wrong choice and need a little clarity. What matters most in this decision: calm, time, money, health, or relationships? Write two options and one tradeoff for each.',
        'Thought reframing',
    ),
    'loneliness': (
        'Feeling alone can be painful, especially when you need support. It sounds like part of you wants connection without having to explain everything perfectly. Who feels safest to send a simple message to? Try one low-pressure text like, "Could you check in with me today?"',
        'One small step planning',
    ),
    'study_work_pressure': (
        'Study or work pressure can make everything feel urgent. It sounds like your system needs one clear next step instead of a whole mountain. What is the smallest useful task you can finish in ten minutes? Clear one surface, write that task down, and start only the first minute.',
        'Study/work reset',
    ),
    'bad_day': (
        'A bad day can leave your whole system feeling worn down. It sounds like you need relief before you need solutions. What moment from today is still sitting with you? Give yourself five quiet minutes, then choose one small reset for your space or body.',
        '5-4-3-2-1 grounding',
    ),
    'general_support': (
        'I hear you. It sounds like something in you needs a little space and care right now. What feeling is most present as you say that? Take one slow breath, name the feeling, and choose one small next step that would make the next few minutes easier.',
        'One small step planning',
    ),
}


def classify_intent(message: str, mood: str | None = None) -> str:
    text = f'{message} {mood or ""}'.lower()
    if any(word in text for word in ['overthinking', 'overthink', 'ruminating', 'replaying']):
        return 'overthinking'
    if any(word in text for word in ['anxious', 'anxiety', 'panic', 'worried', 'calm down']):
        return 'anxiety'
    if any(word in text for word in ['sad', 'sadness', 'cry', 'lonely', 'alone']):
        return 'loneliness' if any(word in text for word in ['lonely', 'alone']) else 'sadness'
    if any(word in text for word in ['stress', 'stressed', 'overwhelmed', 'pressure', 'work', 'study']):
        return 'stress'
    if any(word in text for word in ['motivation', 'motivated', 'procrastinating', 'stuck']):
        return 'motivation'
    if any(word in text for word in ['decide', 'decision', 'choice', 'choose']):
        return 'decision_making'
    if any(word in text for word in ['exam', 'assignment', 'deadline', 'school', 'study', 'work pressure']):
        return 'study_work_pressure'
    if 'bad day' in text:
        return 'bad_day'
    return 'general_support'


class MockProvider(AIProvider):
    name = 'mock'
    mode = 'demo'

    def generate_response(
        self,
        messages: list[dict[str, str]],
        user_context: dict | None = None,
        safety_context: dict | None = None,
    ) -> str:
        prompt = messages[-1]['content'] if messages else ''
        mood = str(user_context.get('mood')) if user_context and user_context.get('mood') else None
        category = classify_intent(prompt, mood)
        return RESPONSES[category][0]

    def complete(self, prompt: str, mood: str | None = None) -> ProviderResponse:
        category = classify_intent(prompt, mood)
        reply, exercise = RESPONSES[category]
        return ProviderResponse(reply=reply, category=category, suggested_exercise=exercise, provider=self.name, mode=self.mode)
