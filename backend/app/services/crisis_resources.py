CRISIS_RESOURCES: dict[str, dict[str, str]] = {
    'United States': {
        'emergency': 'Call 911 for immediate danger.',
        'crisis_line': 'Call or text 988, or use 988lifeline.org chat, for the Suicide & Crisis Lifeline.',
        'note': 'If you can, stay with a trusted person while you contact support.',
        'source': 'https://www.samhsa.gov/find-help/988',
    },
    'Egypt': {
        'emergency': 'Contact local emergency services immediately if there is immediate danger. Ambulance service is commonly reached at 123 in Egypt.',
        'crisis_line': 'Use the nearest local emergency department, hospital crisis support service, or a trusted local clinician.',
        'note': 'Ask a trusted person to stay with you while you seek urgent help.',
        'source': 'https://www.tra.gov.eg/ar/atrc-faq/important-telephone-numbers/',
    },
    'United Kingdom': {
        'emergency': 'Call 999 for immediate danger.',
        'crisis_line': 'Call Samaritans at 116 123 for emotional crisis support.',
        'note': 'NHS 111 can help when urgent medical advice is needed but it is not life-threatening.',
        'source': 'https://www.samaritans.org/how-we-can-help/contact-samaritan/',
    },
    'Ireland': {
        'emergency': 'Call 112 or 999 for immediate danger.',
        'crisis_line': 'Call Samaritans at 116 123 for emotional crisis support.',
        'note': 'If possible, contact a trusted person and avoid being alone while seeking urgent help.',
        'source': 'https://www.samaritans.org/how-we-can-help/contact-samaritan/',
    },
    'Canada': {
        'emergency': 'Call 911 for immediate danger.',
        'crisis_line': 'Call or text 988 for suicide crisis support in Canada.',
        'note': 'If possible, contact a trusted person and avoid being alone while seeking urgent help.',
        'source': 'https://988.ca/',
    },
    'Global': {
        'emergency': 'Contact your local emergency number immediately if there is danger.',
        'crisis_line': 'Reach out to a local crisis hotline, hospital, or trusted person now.',
        'note': 'Move away from anything that could be used for harm if you can do that safely.',
        'source': 'https://findahelpline.com/',
    },
}


def get_resources(region: str | None = None) -> dict[str, str]:
    if not region:
        return CRISIS_RESOURCES['Global']
    return CRISIS_RESOURCES.get(region, CRISIS_RESOURCES['Global'])
