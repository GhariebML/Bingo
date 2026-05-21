export interface MoodEntry {
  id?: number;
  label: string;
  intensity: number;
  note?: string;
  created_at?: string;
}

export type CreateMoodEntry = Omit<MoodEntry, 'id' | 'created_at'>;
