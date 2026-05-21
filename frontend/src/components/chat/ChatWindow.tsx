'use client';

import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { MoodSelector } from './MoodSelector';
import { useChat } from '@/hooks/useChat';

export function ChatWindow({ quickPrompts = [] }: { quickPrompts?: string[] }) {
  const { error, loading, messages, sendMessage } = useChat();

  return (
    <div className="space-y-5">
      {quickPrompts.length ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickPrompts.map((prompt) => (
            <button
              className="rounded-lg border border-sky bg-white px-3 py-3 text-left text-sm font-semibold text-ocean transition hover:bg-sky/50 disabled:opacity-60"
              disabled={loading}
              key={prompt}
              onClick={() => sendMessage(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
      <MoodSelector />
      <div className="min-h-[420px] space-y-4 rounded-lg bg-gradient-to-b from-sky/30 to-foam p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            crisisMode={message.crisisMode}
            mode={message.mode}
            provider={message.provider}
            suggestedExercise={message.suggestedExercise}
          />
        ))}
        {loading ? <p className="text-sm font-medium text-calm">Bingo is thinking...</p> : null}
      </div>
      {error ? <p className="rounded-lg bg-[#FFE8E8] p-3 text-sm text-[#7A2323]">{error}</p> : null}
      <ChatInput disabled={loading} onSend={sendMessage} />
    </div>
  );
}
