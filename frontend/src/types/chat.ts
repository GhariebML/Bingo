export type ChatRole = 'user' | 'assistant';
export type RiskLevel = 'low' | 'medium' | 'high' | 'crisis';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  category?: string;
  suggestedExercise?: string;
  crisisMode?: boolean;
  provider?: string;
  mode?: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  mood?: string;
  conversation_id?: string;
  history?: ChatHistoryMessage[];
}

export interface ChatResponse {
  reply: string;
  risk_level: RiskLevel;
  category: string;
  suggested_exercise: string;
  safety_triggered: boolean;
  crisis_mode: boolean;
  safety_notes: string[];
  provider: string;
  mode: string;
}
