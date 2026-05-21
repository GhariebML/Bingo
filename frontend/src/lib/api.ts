import type { ChatRequest, ChatResponse } from '@/types/chat';
import type { DashboardSummary } from '@/types/dashboard';
import type { Exercise } from '@/types/exercises';
import type { CreateJournalEntry, JournalEntry } from '@/types/journal';
import type { CreateMoodEntry, MoodEntry } from '@/types/mood';
import type { SafetyDisclaimer, SafetyResources } from '@/types/safety';
import type { UserSettings } from '@/types/settings';
import type { AuthResponse } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

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

export function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/api/v1/dashboard/summary');
}

export function getExercises(): Promise<Exercise[]> {
  return request<Exercise[]>('/api/v1/exercises');
}

export function getExercise(exerciseId: string): Promise<Exercise> {
  return request<Exercise>(`/api/v1/exercises/${exerciseId}`);
}

export function getMoodTrend<T>() {
  return request<T>('/api/v1/mood/mock-trend');
}

export function mockLogin(): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/mock-login', { method: 'POST' });
}

export function register(email: string, password: string, display_name?: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, display_name }),
  });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): Promise<{ message: string }> {
  return request<{ message: string }>('/api/v1/auth/logout', { method: 'POST' });
}

export function exportAccount<T>(): Promise<T> {
  return request<T>('/api/v1/account/export');
}

export function deleteAccount(): Promise<{ message: string }> {
  return request<{ message: string }>('/api/v1/account', { method: 'DELETE' });
}

export function listJournalEntries(): Promise<JournalEntry[]> {
  return request<JournalEntry[]>('/api/v1/journal');
}

export function createJournalEntry(payload: CreateJournalEntry): Promise<JournalEntry> {
  return request<JournalEntry>('/api/v1/journal', { method: 'POST', body: JSON.stringify(payload) });
}

export function listMoodEntries(): Promise<MoodEntry[]> {
  return request<MoodEntry[]>('/api/v1/mood');
}

export function createMoodEntry(payload: CreateMoodEntry): Promise<MoodEntry> {
  return request<MoodEntry>('/api/v1/mood', { method: 'POST', body: JSON.stringify(payload) });
}

export function createMoodCheckIn(payload: CreateMoodEntry): Promise<MoodEntry> {
  return request<MoodEntry>('/api/v1/mood/check-in', { method: 'POST', body: JSON.stringify(payload) });
}

export function getMoodSummary<T>(): Promise<T> {
  return request<T>('/api/v1/mood/summary');
}

export function getJournalEntry(entryId: number): Promise<JournalEntry> {
  return request<JournalEntry>(`/api/v1/journal/${entryId}`);
}

export function deleteJournalEntry(entryId: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/v1/journal/${entryId}`, { method: 'DELETE' });
}

export function getSettings(): Promise<UserSettings> {
  return request<UserSettings>('/api/v1/settings');
}

export function updateSettings(payload: UserSettings): Promise<UserSettings> {
  return request<UserSettings>('/api/v1/settings', { method: 'PUT', body: JSON.stringify(payload) });
}

export function getSafetyResources(region?: string): Promise<SafetyResources> {
  const query = region ? `?region=${encodeURIComponent(region)}` : '';
  return request<SafetyResources>(`/api/v1/safety/resources${query}`);
}

export function getSafetyDisclaimer(): Promise<SafetyDisclaimer> {
  return request<SafetyDisclaimer>('/api/v1/safety/disclaimer');
}
