import type { ChatRequest, ChatResponse, RiskLevel } from '@/types/chat';
import type { DashboardSummary } from '@/types/dashboard';
import type { Exercise } from '@/types/exercises';
import type { CreateJournalEntry, JournalEntry } from '@/types/journal';
import type { CreateMoodEntry, MoodEntry } from '@/types/mood';
import type { SafetyDisclaimer, SafetyResources } from '@/types/safety';
import type { UserSettings } from '@/types/settings';
import type { AuthResponse } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

// Offline static exercises matching the backend exercise service exactly
const exercises: Exercise[] = [
  { id: '4-7-8-breathing', title: '4-7-8 breathing', category: 'breathing', duration_minutes: 3, purpose: 'Lower arousal gently', recommended_for: ['anxiety', 'stress'], steps: ['Inhale for 4 counts.', 'Hold for 7 counts.', 'Exhale slowly for 8 counts.', 'Repeat two rounds.'] },
  { id: 'five-four-three-two-one', title: '5-4-3-2-1 grounding', category: 'grounding', duration_minutes: 4, purpose: 'Return attention to the present', recommended_for: ['anxiety', 'overthinking'], steps: ['Name 5 things you see.', 'Name 4 things you feel.', 'Name 3 things you hear.', 'Name 2 things you smell.', 'Name 1 thing you taste.'] },
  { id: 'thought-reframing', title: 'Thought reframing', category: 'reflection', duration_minutes: 7, purpose: 'Find a more balanced thought', recommended_for: ['overthinking', 'sadness'], steps: ['Write the thought.', 'Name the feeling it creates.', 'List one fact for and one fact against it.', 'Try a kinder balanced thought.'] },
  { id: 'worry-parking', title: 'Worry parking', category: 'stress', duration_minutes: 5, purpose: 'Contain repeating worries', recommended_for: ['stress', 'overthinking'], steps: ['Write the worry in one sentence.', 'Choose a later review time.', 'Park it until then.', 'Return to one present task.'] },
  { id: 'one-small-step', title: 'One small step planning', category: 'motivation', duration_minutes: 5, purpose: 'Create momentum', recommended_for: ['motivation'], steps: ['Choose the smallest useful action.', 'Make it take under 10 minutes.', 'Remove one obstacle.', 'Start with the first minute.'] },
  { id: 'calm-body-scan', title: 'Calm body scan', category: 'grounding', duration_minutes: 6, purpose: 'Notice and soften tension', recommended_for: ['sadness', 'stress'], steps: ['Relax your jaw and shoulders.', 'Notice your breath without changing it.', 'Scan from head to toes.', 'Soften one tense area.'] },
  { id: 'study-work-reset', title: 'Study/work reset', category: 'focus', duration_minutes: 8, purpose: 'Restart focus without pressure', recommended_for: ['study_work_pressure', 'stress'], steps: ['Clear one surface.', 'Write the next task.', 'Set a 10-minute timer.', 'Start only the first step.'] },
];

const defaultJournals: JournalEntry[] = [
  { id: 1, title: 'Noticing moments of calm', content: 'Today I took a few minutes to practice the 4-7-8 breathing exercise. It felt helpful to just slow down and let my shoulders drop.', mood: 'calm', emotion_tags: ['calm', 'grateful'], created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 2, title: 'Navigating study pressure', content: 'Feeling a lot of weight from deadlines. Trying to focus on only the next small step rather than the entire list.', mood: 'stressed', emotion_tags: ['stressed', 'anxious'], created_at: new Date(Date.now() - 3600000 * 48).toISOString() }
];

const defaultMoods: MoodEntry[] = [
  { id: 1, label: 'calm', intensity: 7, note: 'Had a quiet morning walk.', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, label: 'stressed', intensity: 8, note: 'Too many emails.', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 3, label: 'anxious', intensity: 6, note: 'Worried about tomorrow.', created_at: new Date(Date.now() - 3600000 * 48).toISOString() }
];

const defaultUserProfile = {
  id: 1,
  email: 'demo@bingo.ai',
  display_name: 'Demo Friend',
  email_verified: true,
  mfa_enabled: false,
};

const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bi('?| a)?m going to kill myself\b/i,
  /\bend my life\b/i,
  /\bend it all\b/i,
  /\bwant to die\b/i,
  /\bdon'?t want to be alive\b/i,
  /\bdo not want to be alive\b/i,
  /\bi do not want to live\b/i,
  /\bno reason to live\b/i,
  /\bsuicid(e|al)\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt myself\b/i,
  /\bcut myself\b/i,
  /\bi might cut\b/i,
  /\boverdose\b/i,
  /\btake all (my )?pills\b/i,
  /\bharm someone\b/i,
  /\bhurt someone\b/i,
  /\bkill (him|her|them|someone)\b/i,
  /\bmake them pay\b/i,
  /\bbeing abused\b/i,
  /\babuse\b/i,
  /\bthey hit me\b/i,
  /\bdomestic violence\b/i,
  /\bunsafe at home\b/i,
  /\bimmediate danger\b/i,
  /\bemergency\b/i,
  /\bweapon\b/i,
  /\b(can't|cannot|can not) stay safe\b/i,
  /\bi'?m not safe\b/i,
  /\bi am not safe\b/i,
  /\bi might hurt myself\b/i,
  /\bi might hurt them\b/i,
  /\bplan to hurt\b/i,
  /\bplanning to hurt\b/i,
  /\btonight is the night\b/i,
  /\bjump off\b/i,
  /\bhang myself\b/i,
  /\bshoot myself\b/i
];

const RESPONSES: Record<string, [string, string]> = {
  anxiety: [
    'That anxious feeling can be really uncomfortable, and it makes sense that your body is on alert. It sounds like your mind is scanning for what might go wrong and trying to protect you. What feels most urgent right now? Try placing both feet on the floor and taking three slow breaths before choosing one tiny next action.',
    '4-7-8 breathing',
  ],
  overthinking: [
    'Overthinking can feel like being caught in a loop. It sounds like your mind is replaying the same thought because it wants certainty. What is the one question your mind keeps asking? Write it down once, then write one fact you know for sure.',
    'Worry parking',
  ],
  sadness: [
    'I am sorry today feels heavy. It sounds like something hurtful or disappointing is asking for care. What part of the day felt hardest to carry? Choose one kind action for yourself, even if it is only getting water or stepping away for two minutes.',
    'Calm body scan',
  ],
  stress: [
    'That sounds like a lot to hold at once. It seems like several demands are competing for your attention and energy. Which one thing truly needs attention first? Pick a ten-minute step and let everything else wait until that step is done.',
    'Study/work reset',
  ],
  motivation: [
    'It makes sense to want momentum when starting feels hard. It sounds like the task may feel too big from where you are standing. What would count as progress in the next ten minutes? Make the first step so small it feels almost too easy.',
    'One small step planning',
  ],
  decision_making: [
    'Decision pressure can be draining. It sounds like you are trying to avoid the wrong choice and need a little clarity. What matters most in this decision: calm, time, money, health, or relationships? Write two options and one tradeoff for each.',
    'Thought reframing',
  ],
  loneliness: [
    'Feeling alone can be painful, especially when you need support. It sounds like part of you wants connection without having to explain everything perfectly. Who feels safest to send a simple message to? Try one low-pressure text like, "Could you check in with me today?"',
    'One small step planning',
  ],
  study_work_pressure: [
    'Study or work pressure can make everything feel urgent. It sounds like your system needs one clear next step instead of a whole mountain. What is the smallest useful task you can finish in ten minutes? Clear one surface, write that task down, and start only the first minute.',
    'Study/work reset',
  ],
  bad_day: [
    'A bad day can leave your whole system feeling worn down. It sounds like you need relief before you need solutions. What moment from today is still sitting with you? Give yourself five quiet minutes, then choose one small reset for your space or body.',
    '5-4-3-2-1 grounding',
  ],
  general_support: [
    'I hear you. It sounds like something in you needs a little space and care right now. What feeling is most present as you say that? Take one slow breath, name the feeling, and choose one small next step that would make the next few minutes easier.',
    'One small step planning',
  ],
};

function classifyIntent(message: string, mood?: string): string {
  const text = `${message} ${mood || ""}`.toLowerCase();
  if (/overthinking|overthink|ruminating|replaying/.test(text)) return 'overthinking';
  if (/anxious|anxiety|panic|worried|calm down/.test(text)) return 'anxiety';
  if (/lonely|alone/.test(text)) return 'loneliness';
  if (/sad|sadness|cry/.test(text)) return 'sadness';
  if (/stress|stressed|overwhelmed|pressure|work|study/.test(text)) return 'stress';
  if (/motivation|motivated|procrastinating|stuck/.test(text)) return 'motivation';
  if (/decide|decision|choice|choose/.test(text)) return 'decision_making';
  if (/exam|assignment|deadline|school|study|work pressure/.test(text)) return 'study_work_pressure';
  if (/bad day/.test(text)) return 'bad_day';
  return 'general_support';
}

function handleOfflineChat(payload: ChatRequest): ChatResponse {
  const normalized = payload.message.trim();
  const isCrisis = CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));

  if (isCrisis) {
    return {
      reply: "I am really sorry you are feeling this. Your safety matters most right now. Contact local emergency services immediately and reach out to a trusted person who can stay with you now. If you can, move away from anything that could be used for harm. Bingo is not an emergency service or crisis line.",
      risk_level: 'crisis',
      category: 'crisis',
      suggested_exercise: 'Contact emergency support',
      safety_triggered: true,
      crisis_mode: true,
      safety_notes: ['crisis-safe-response'],
      provider: 'local-fallback-safe',
      mode: 'offline',
    };
  }

  const category = classifyIntent(normalized, payload.mood);
  const [reply, exercise] = RESPONSES[category];

  return {
    reply,
    risk_level: 'low',
    category,
    suggested_exercise: exercise,
    safety_triggered: false,
    crisis_mode: false,
    safety_notes: [],
    provider: 'local-fallback',
    mode: 'offline',
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseError(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const details = await parseError(response);
    if (response.status === 401) {
      throw new ApiError('Please log in again to continue.', response.status, details);
    }
    throw new ApiError('Bingo could not complete that request. Please try again.', response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// Check if error is network connectivity related
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true; // Standard TypeError is thrown for CORS/network failure
  const str = String(error).toLowerCase();
  return str.includes('failed to fetch') || str.includes('networkerror') || str.includes('load failed');
}

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  try {
    return await request<ChatResponse>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      console.warn('FastAPI backend unreachable. Using client-side safe offline AI agent.');
      return Promise.resolve(handleOfflineChat(payload));
    }
    throw error;
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    return await request<DashboardSummary>('/api/v1/dashboard/summary');
  } catch (error) {
    if (isNetworkError(error)) {
      console.warn('FastAPI backend unreachable. Generating dashboard summary from local storage.');
      const journals = JSON.parse(localStorage.getItem('bingo_journals') || JSON.stringify(defaultJournals));
      const moods = JSON.parse(localStorage.getItem('bingo_moods') || JSON.stringify(defaultMoods));

      const emotionsMap: Record<string, number> = {};
      journals.forEach((j: any) => {
        (j.emotion_tags || []).forEach((e: string) => {
          emotionsMap[e] = (emotionsMap[e] || 0) + 1;
        });
      });
      moods.forEach((m: any) => {
        if (m.label) {
          emotionsMap[m.label] = (emotionsMap[m.label] || 0) + 1;
        }
      });

      const sortedEmotions = Object.entries(emotionsMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name)
        .slice(0, 3);
      if (sortedEmotions.length === 0) {
        sortedEmotions.push('calm', 'hopeful');
      }

      const lastMood = moods[0]?.label || 'general_support';
      const suggestedExercise = lastMood === 'anxiety' ? '4-7-8 breathing' : 
                                lastMood === 'overthinking' ? 'Worry parking' :
                                lastMood === 'stressed' ? 'Study/work reset' : 'One small step planning';

      const trendPoints = moods.slice(0, 7).reverse().map((m: any) => {
        const date = new Date(m.created_at || Date.now());
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          mood: m.label,
          score: m.intensity,
        };
      });

      return Promise.resolve({
        journal_entries: journals.length,
        mood_checkins: moods.length,
        exercises_tried: 3,
        most_common_emotions: sortedEmotions,
        suggested_exercise: suggestedExercise,
        today_reflection: 'Every small breath counts. Today, be kind to your thoughts.',
        mood_trend: trendPoints,
        recommended_exercises: exercises.slice(0, 3),
      });
    }
    throw error;
  }
}

export async function getExercises(): Promise<Exercise[]> {
  try {
    return await request<Exercise[]>('/api/v1/exercises');
  } catch (error) {
    if (isNetworkError(error)) {
      console.warn('FastAPI backend unreachable. Serving static wellness exercises.');
      return Promise.resolve(exercises);
    }
    throw error;
  }
}

export async function getExercise(exerciseId: string): Promise<Exercise> {
  try {
    return await request<Exercise>(`/api/v1/exercises/${exerciseId}`);
  } catch (error) {
    if (isNetworkError(error)) {
      const match = exercises.find((e) => e.id === exerciseId);
      if (match) return Promise.resolve(match);
      throw new ApiError('Exercise not found', 404);
    }
    throw error;
  }
}

export async function getMoodTrend<T>() {
  try {
    return await request<T>('/api/v1/mood/mock-trend');
  } catch (error) {
    if (isNetworkError(error)) {
      const moods = JSON.parse(localStorage.getItem('bingo_moods') || JSON.stringify(defaultMoods));
      const trendPoints = moods.slice(0, 7).reverse().map((m: any) => {
        const date = new Date(m.created_at || Date.now());
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          mood: m.label,
          score: m.intensity,
        };
      });
      return Promise.resolve(trendPoints as unknown as T);
    }
    throw error;
  }
}

export async function mockLogin(): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>('/api/v1/auth/mock-login', { method: 'POST' });
  } catch (error) {
    if (isNetworkError(error)) {
      console.warn('FastAPI backend unreachable. Activating local demo login session.');
      localStorage.setItem('bingo_session', 'mock-token');
      localStorage.setItem('bingo_user', JSON.stringify(defaultUserProfile));
      return Promise.resolve({
        token: 'mock-token',
        user: defaultUserProfile,
      });
    }
    throw error;
  }
}

export async function register(email: string, password: string, display_name?: string): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      const user = { ...defaultUserProfile, email, display_name: display_name || 'Wellness Friend' };
      localStorage.setItem('bingo_session', 'mock-token');
      localStorage.setItem('bingo_user', JSON.stringify(user));
      return Promise.resolve({
        token: 'mock-token',
        user,
      });
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      const user = { ...defaultUserProfile, email };
      localStorage.setItem('bingo_session', 'mock-token');
      localStorage.setItem('bingo_user', JSON.stringify(user));
      return Promise.resolve({
        token: 'mock-token',
        user,
      });
    }
    throw error;
  }
}

export async function logout(): Promise<{ message: string }> {
  try {
    return await request<{ message: string }>('/api/v1/auth/logout', { method: 'POST' });
  } catch (error) {
    if (isNetworkError(error)) {
      localStorage.removeItem('bingo_session');
      localStorage.removeItem('bingo_user');
      return Promise.resolve({ message: 'Mock logout successful.' });
    }
    throw error;
  }
}

export async function exportAccount<T>(): Promise<T> {
  try {
    return await request<T>('/api/v1/account/export');
  } catch (error) {
    if (isNetworkError(error)) {
      const backup = {
        journals: JSON.parse(localStorage.getItem('bingo_journals') || '[]'),
        moods: JSON.parse(localStorage.getItem('bingo_moods') || '[]'),
        settings: JSON.parse(localStorage.getItem('bingo_settings') || '{}'),
      };
      return Promise.resolve(backup as unknown as T);
    }
    throw error;
  }
}

export async function deleteAccount(): Promise<{ message: string }> {
  try {
    return await request<{ message: string }>('/api/v1/account', { method: 'DELETE' });
  } catch (error) {
    if (isNetworkError(error)) {
      localStorage.clear();
      return Promise.resolve({ message: 'Local storage wiped successfully.' });
    }
    throw error;
  }
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  try {
    return await request<JournalEntry[]>('/api/v1/journal');
  } catch (error) {
    if (isNetworkError(error)) {
      const stored = localStorage.getItem('bingo_journals');
      if (!stored) {
        localStorage.setItem('bingo_journals', JSON.stringify(defaultJournals));
        return Promise.resolve(defaultJournals);
      }
      return Promise.resolve(JSON.parse(stored));
    }
    throw error;
  }
}

export async function createJournalEntry(payload: CreateJournalEntry): Promise<JournalEntry> {
  try {
    return await request<JournalEntry>('/api/v1/journal', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (isNetworkError(error)) {
      const stored = localStorage.getItem('bingo_journals');
      const list = stored ? JSON.parse(stored) : [...defaultJournals];
      const newEntry: JournalEntry = {
        id: Math.floor(Math.random() * 1000000),
        title: payload.title,
        content: payload.content,
        mood: payload.mood,
        emotion_tags: payload.emotion_tags || [],
        created_at: new Date().toISOString(),
      };
      list.unshift(newEntry);
      localStorage.setItem('bingo_journals', JSON.stringify(list));
      return Promise.resolve(newEntry);
    }
    throw error;
  }
}

export async function listMoodEntries(): Promise<MoodEntry[]> {
  try {
    return await request<MoodEntry[]>('/api/v1/mood');
  } catch (error) {
    if (isNetworkError(error)) {
      const stored = localStorage.getItem('bingo_moods');
      if (!stored) {
        localStorage.setItem('bingo_moods', JSON.stringify(defaultMoods));
        return Promise.resolve(defaultMoods);
      }
      return Promise.resolve(JSON.parse(stored));
    }
    throw error;
  }
}

export async function createMoodEntry(payload: CreateMoodEntry): Promise<MoodEntry> {
  try {
    return await request<MoodEntry>('/api/v1/mood', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (isNetworkError(error)) {
      const stored = localStorage.getItem('bingo_moods');
      const list = stored ? JSON.parse(stored) : [...defaultMoods];
      const newEntry: MoodEntry = {
        id: Math.floor(Math.random() * 1000000),
        label: payload.label,
        intensity: payload.intensity,
        note: payload.note,
        created_at: new Date().toISOString(),
      };
      list.unshift(newEntry);
      localStorage.setItem('bingo_moods', JSON.stringify(list));
      return Promise.resolve(newEntry);
    }
    throw error;
  }
}

export async function createMoodCheckIn(payload: CreateMoodEntry): Promise<MoodEntry> {
  try {
    return await request<MoodEntry>('/api/v1/mood/check-in', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (isNetworkError(error)) {
      return createMoodEntry(payload);
    }
    throw error;
  }
}

export async function getMoodSummary<T>(): Promise<T> {
  try {
    return await request<T>('/api/v1/mood/summary');
  } catch (error) {
    if (isNetworkError(error)) {
      const moods = JSON.parse(localStorage.getItem('bingo_moods') || JSON.stringify(defaultMoods));
      const intensities = moods.map((m: any) => m.intensity);
      const avg = intensities.length ? intensities.reduce((a: number, b: number) => a + b, 0) / intensities.length : 0;
      return Promise.resolve({
        total: moods.length,
        average_intensity: parseFloat(avg.toFixed(1)),
      } as unknown as T);
    }
    throw error;
  }
}

export async function getJournalEntry(entryId: number): Promise<JournalEntry> {
  try {
    return await request<JournalEntry>(`/api/v1/journal/${entryId}`);
  } catch (error) {
    if (isNetworkError(error)) {
      const journals = JSON.parse(localStorage.getItem('bingo_journals') || JSON.stringify(defaultJournals)) as JournalEntry[];
      const match = journals.find(e => e.id === entryId);
      if (match) return Promise.resolve(match);
      throw new ApiError('Journal entry not found', 404);
    }
    throw error;
  }
}

export async function deleteJournalEntry(entryId: number): Promise<{ message: string }> {
  try {
    return await request<{ message: string }>(`/api/v1/journal/${entryId}`, { method: 'DELETE' });
  } catch (error) {
    if (isNetworkError(error)) {
      const journals = JSON.parse(localStorage.getItem('bingo_journals') || JSON.stringify(defaultJournals)) as JournalEntry[];
      const filtered = journals.filter(e => e.id !== entryId);
      localStorage.setItem('bingo_journals', JSON.stringify(filtered));
      return Promise.resolve({ message: 'Deleted' });
    }
    throw error;
  }
}

export async function getSettings(): Promise<UserSettings> {
  try {
    return await request<UserSettings>('/api/v1/settings');
  } catch (error) {
    if (isNetworkError(error)) {
      const stored = localStorage.getItem('bingo_settings');
      if (!stored) {
        const defaultSettings: UserSettings = {
          preferred_language: 'English',
          response_style: 'balanced',
          crisis_region: 'US',
          save_journal_history: true,
          save_mood_history: true,
        };
        localStorage.setItem('bingo_settings', JSON.stringify(defaultSettings));
        return Promise.resolve(defaultSettings);
      }
      return Promise.resolve(JSON.parse(stored));
    }
    throw error;
  }
}

export async function updateSettings(payload: UserSettings): Promise<UserSettings> {
  try {
    return await request<UserSettings>('/api/v1/settings', { method: 'PUT', body: JSON.stringify(payload) });
  } catch (error) {
    if (isNetworkError(error)) {
      localStorage.setItem('bingo_settings', JSON.stringify(payload));
      return Promise.resolve(payload);
    }
    throw error;
  }
}

export async function getSafetyResources(region?: string): Promise<SafetyResources> {
  try {
    const query = region ? `?region=${encodeURIComponent(region)}` : '';
    return await request<SafetyResources>(`/api/v1/safety/resources${query}`);
  } catch (error) {
    if (isNetworkError(error)) {
      return Promise.resolve({
        region: region || 'Global',
        emergency: region === 'US' ? '911' : region === 'UK' ? '999' : '112 or local emergency services',
        crisis_line: region === 'US' ? '988 (Crisis Lifeline)' : region === 'UK' ? '111 (NHS) or 116 123 (Samaritans)' : 'Contact local support or go to findahelpline.com',
        note: 'If you are in immediate danger, please reach out to someone who can help keep you safe.',
      });
    }
    throw error;
  }
}

export async function getSafetyDisclaimer(): Promise<SafetyDisclaimer> {
  try {
    return await request<SafetyDisclaimer>('/api/v1/safety/disclaimer');
  } catch (error) {
    if (isNetworkError(error)) {
      return Promise.resolve({
        title: 'Bingo safety boundaries',
        message: 'Bingo supports reflection, journaling, grounding, and small next steps. It is not a therapist, doctor, crisis line, or emergency service.',
        crisis_guidance: 'I am really sorry you are facing this. If you or someone else may be in immediate danger, contact local emergency services now and reach a trusted person who can stay with you. I can stay with you for grounding, but I cannot replace urgent help.',
        not_for: ['diagnosis', 'medication advice', 'therapy replacement', 'emergency response'],
      });
    }
    throw error;
  }
}
