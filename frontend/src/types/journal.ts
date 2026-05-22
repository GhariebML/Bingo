export interface JournalEntry {
 id?: number;
 title: string;
 content: string;
 mood?: string;
 emotion_tags: string[];
 created_at?: string;
}

export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'created_at'>;
