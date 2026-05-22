export interface UserSettings {
 preferred_language: string;
 response_style: string;
 crisis_region: string;
 save_journal_history: boolean;
 save_mood_history: boolean;
 ai_provider?: string;
 enable_real_ai?: boolean;
 openai_api_key?: string;
 openai_model?: string;
 openai_base_url?: string;
 openrouter_api_key?: string;
 openrouter_model?: string;
 openrouter_base_url?: string;
 hf_token?: string;
 hf_model?: string;
 hf_base_url?: string;
}
