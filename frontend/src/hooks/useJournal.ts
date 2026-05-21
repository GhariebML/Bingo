'use client';

import { useCallback, useEffect, useState } from 'react';
import { createJournalEntry, deleteJournalEntry, listJournalEntries, mockLogin } from '@/lib/api';
import type { CreateJournalEntry, JournalEntry } from '@/types/journal';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
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
      setEntries(await listJournalEntries());
    } catch {
      setEntries([]);
      setError('Please log in or use demo login to load journal entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveEntry = useCallback(async (entry: CreateJournalEntry) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await createJournalEntry(entry);
      setEntries((current) => [saved, ...current]);
    } catch {
      setError('Please log in or use demo login before saving journal entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeEntry = useCallback(async (entryId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteJournalEntry(entryId);
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
    } catch {
      setError('Could not delete journal entry.');
    } finally {
      setLoading(false);
    }
  }, []);

  const startDemoSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithDemo();
      setEntries(await listJournalEntries());
    } catch {
      setError('Could not start demo login.');
    } finally {
      setLoading(false);
    }
  }, [loginWithDemo]);

  return { error, loading, entries, saveEntry, removeEntry, refresh, startDemoSession };
}
