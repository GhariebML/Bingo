# AI Safety Review

## Safety Scope
Bingo is a mental wellness companion for reflection and grounding. It is not a medical device, therapist, doctor, emergency responder, or crisis line.

## Crisis Handling
The crisis detector checks for self-harm, suicide, wanting to die, harming others, abuse, immediate danger, overdose, weapons, and severe unsafe wording. Crisis messages bypass normal coaching and return short urgent guidance to contact local emergency services and a trusted person.

## Response Validation
The validator removes diagnostic claims, medication advice, therapy-replacement claims, and treatment claims. Tests cover crisis detection, crisis response, anxiety, overthinking, no diagnosis, and no medication advice.

## Known Gaps
- Keyword rules can miss subtle crisis language.
- No locale-specific emergency resources yet.
- No human escalation workflow.
- No clinical or legal review completed.

## Recommendation
Before real users or real AI providers, add a multi-layer safety classifier, region-aware crisis resources, audit logs with privacy controls, and external safety review.
