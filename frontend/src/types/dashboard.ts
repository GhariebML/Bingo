import type { Exercise } from './exercises';

export interface MoodTrendPoint {
 day: string;
 mood: string;
 score: number;
}

export interface DashboardSummary {
 journal_entries: number;
 mood_checkins: number;
 exercises_tried: number;
 most_common_emotions: string[];
 suggested_exercise: string;
 today_reflection: string;
 mood_trend: MoodTrendPoint[];
 recommended_exercises: Exercise[];
}
