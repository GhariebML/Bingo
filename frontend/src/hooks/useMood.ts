'use client';

import { useCallback, useEffect, useState } from 'react';
import { createMoodEntry, listMoodEntries, mockLogin } from '@/lib/api';
import type { CreateMoodEntry, MoodEntry } from '@/types/mood';

export function useMood() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginWithDemo = useCallback(async () => {
    const auth = await mockLogin();
    return auth;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await listMoodEntries());
    } catch {
      setEntries([]);
      setError('Please log in or use demo login to load mood history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recordMood = useCallback(async (entry: CreateMoodEntry) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await createMoodEntry(entry);
      setEntries((current) => [saved, ...current]);
    } catch {
      setError('Please log in or use demo login before saving mood check-ins.');
    } finally {
      setLoading(false);
    }
  }, []);

  const startDemoSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithDemo();
      setEntries(await listMoodEntries());
    } catch {
      setError('Could not start demo login.');
    } finally {
      setLoading(false);
    }
  }, [loginWithDemo]);

  return { error, loading, entries, recordMood, refresh, startDemoSession };
}
