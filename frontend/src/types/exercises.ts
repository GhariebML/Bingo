export interface Exercise {
 id: string;
 title: string;
 category: string;
 duration_minutes: number;
 purpose: string;
 steps: string[];
 recommended_for: string[];
}

export interface BreathingSession {
  id?: number;
  user_id?: number;
  duration_seconds: number;
  cycles: number;
  created_at?: string;
}
