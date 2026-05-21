import re


CRISIS_PATTERNS = [
    r"\bkill myself\b",
    r"\bi('?| a)?m going to kill myself\b",
    r"\bend my life\b",
    r"\bend it all\b",
    r"\bwant to die\b",
    r"\bdon'?t want to be alive\b",
    r"\bdo not want to be alive\b",
    r"\bi do not want to live\b",
    r"\bno reason to live\b",
    r"\bsuicid(e|al)\b",
    r"\bself[- ]?harm\b",
    r"\bhurt myself\b",
    r"\bcut myself\b",
    r"\bi might cut\b",
    r"\boverdose\b",
    r"\btake all (my )?pills\b",
    r"\bharm someone\b",
    r"\bhurt someone\b",
    r"\bkill (him|her|them|someone)\b",
    r"\bmake them pay\b",
    r"\bbeing abused\b",
    r"\babuse\b",
    r"\bthey hit me\b",
    r"\bdomestic violence\b",
    r"\bunsafe at home\b",
    r"\bimmediate danger\b",
    r"\bemergency\b",
    r"\bweapon\b",
    r"\b(can't|cannot|can not) stay safe\b",
    r"\bi'?m not safe\b",
    r"\bi am not safe\b",
    r"\bi might hurt myself\b",
    r"\bi might hurt them\b",
    r"\bplan to hurt\b",
    r"\bplanning to hurt\b",
    r"\btonight is the night\b",
    r"\bjump off\b",
    r"\bhang myself\b",
    r"\bshoot myself\b",
]


def detect_crisis(text: str) -> dict[str, object]:
    lowered = text.lower()
    matches = sorted(pattern for pattern in CRISIS_PATTERNS if re.search(pattern, lowered))
    return {
        "is_crisis": bool(matches),
        "matches": matches,
        "level": "crisis" if matches else "low",
    }
