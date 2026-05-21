def list_exercises() -> list[dict[str, object]]:
    return [
        {'id': '4-7-8-breathing', 'title': '4-7-8 breathing', 'category': 'breathing', 'duration_minutes': 3, 'purpose': 'Lower arousal gently', 'recommended_for': ['anxiety', 'stress'], 'steps': ['Inhale for 4 counts.', 'Hold for 7 counts.', 'Exhale slowly for 8 counts.', 'Repeat two rounds.']},
        {'id': 'five-four-three-two-one', 'title': '5-4-3-2-1 grounding', 'category': 'grounding', 'duration_minutes': 4, 'purpose': 'Return attention to the present', 'recommended_for': ['anxiety', 'overthinking'], 'steps': ['Name 5 things you see.', 'Name 4 things you feel.', 'Name 3 things you hear.', 'Name 2 things you smell.', 'Name 1 thing you taste.']},
        {'id': 'thought-reframing', 'title': 'Thought reframing', 'category': 'reflection', 'duration_minutes': 7, 'purpose': 'Find a more balanced thought', 'recommended_for': ['overthinking', 'sadness'], 'steps': ['Write the thought.', 'Name the feeling it creates.', 'List one fact for and one fact against it.', 'Try a kinder balanced thought.']},
        {'id': 'worry-parking', 'title': 'Worry parking', 'category': 'stress', 'duration_minutes': 5, 'purpose': 'Contain repeating worries', 'recommended_for': ['stress', 'overthinking'], 'steps': ['Write the worry in one sentence.', 'Choose a later review time.', 'Park it until then.', 'Return to one present task.']},
        {'id': 'one-small-step', 'title': 'One small step planning', 'category': 'motivation', 'duration_minutes': 5, 'purpose': 'Create momentum', 'recommended_for': ['motivation'], 'steps': ['Choose the smallest useful action.', 'Make it take under 10 minutes.', 'Remove one obstacle.', 'Start with the first minute.']},
        {'id': 'calm-body-scan', 'title': 'Calm body scan', 'category': 'grounding', 'duration_minutes': 6, 'purpose': 'Notice and soften tension', 'recommended_for': ['sadness', 'stress'], 'steps': ['Relax your jaw and shoulders.', 'Notice your breath without changing it.', 'Scan from head to toes.', 'Soften one tense area.']},
        {'id': 'study-work-reset', 'title': 'Study/work reset', 'category': 'focus', 'duration_minutes': 8, 'purpose': 'Restart focus without pressure', 'recommended_for': ['study_work_pressure', 'stress'], 'steps': ['Clear one surface.', 'Write the next task.', 'Set a 10-minute timer.', 'Start only the first step.']},
    ]


def get_exercise(exercise_id: str) -> dict[str, object] | None:
    return next((exercise for exercise in list_exercises() if exercise['id'] == exercise_id), None)
