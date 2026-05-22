'use client';

import { useCallback, useState } from 'react';
import { sendChatMessage } from '@/lib/api';
import type { ChatMessage } from '@/types/chat';

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hi, I am Bingo. I can help you pause, name what you are feeling, and choose one small safe next step. I am not a therapist, doctor, emergency responder, or crisis line.',
    category: 'welcome',
    suggestedExercise: 'One small step planning',
  },
];

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, mood?: string) => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setError(null);

    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await sendChatMessage({ message: trimmed, mood, history });
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
        category: response.category,
        suggestedExercise: response.suggested_exercise,
        crisisMode: response.crisis_mode,
        provider: response.provider,
        mode: response.mode,
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setError('Bingo could not reach the local backend. Please make sure FastAPI is running on port 8000.');
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'I could not reach the local backend just now. Your message was not sent to a real AI service. Please check the backend server, then try again.',
          category: 'connection-error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { error, loading, messages, sendMessage };
}
