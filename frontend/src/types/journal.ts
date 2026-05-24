export interface JournalEntry {
 id?: number;
 title: string;
 content: string;
 mood?: string;
 emotion_tags: string[];
 created_at?: string;
}

export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'created_at'>;

export interface StructuredJournalEntry {
  id?: number;
  user_id?: number;
  situation: string;
  thought: string;
  emotion: string;
  action: string;
  created_at?: string;
}

export type CreateStructuredJournalEntry = Omit<StructuredJournalEntry, 'id' | 'user_id' | 'created_at'>;
