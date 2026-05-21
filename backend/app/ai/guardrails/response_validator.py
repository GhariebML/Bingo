import re


PROHIBITED = [
    'you are diagnosed with',
    'you have depression',
    'you have anxiety disorder',
    'you have bipolar disorder',
    'you have ptsd',
    'take this medication',
    'stop taking your medication',
    'increase your dose',
    'decrease your dose',
    'i am your therapist',
    'as your therapist',
    'licensed therapist',
    'i can treat you',
    'this will cure you',
    'therapy replacement',
    'stop medication',
    'take medication',
    'harm yourself by',
    'hurt yourself by',
    'here is how to hurt',
    'you definitely have',
    'you certainly have',
]

def validate_response(text: str) -> tuple[str, list[str]]:
    notes: list[str] = []
    cleaned = text
    for phrase in PROHIBITED:
        if phrase in cleaned.lower():
            cleaned = re.sub(re.escape(phrase), '[removed unsafe claim]', cleaned, flags=re.IGNORECASE)
            notes.append(f'Removed prohibited phrase: {phrase}')
    if 'diagnos' in cleaned.lower():
        notes.append('Checked diagnostic language')
    return cleaned, notes
