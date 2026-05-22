'use client';

import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { MoodSelector } from './MoodSelector';
import { BingoAvatar } from '@/components/ui/BingoAvatar';
import { useChat } from '@/hooks/useChat';

export function ChatWindow({ quickPrompts = [] }: { quickPrompts?: string[] }) {
  const { error, loading, messages, sendMessage } = useChat();

  return (
    <div className="space-y-6">
      {quickPrompts.length ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 select-none">
          {quickPrompts.map((prompt) => (
            <button
              className="rounded-xl border border-sky bg-white/60 backdrop-blur px-4 py-3 text-left text-sm font-semibold text-ocean transition-all duration-300 hover:bg-gradient-to-r hover:from-sky/40 hover:to-white hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-50"
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
      
      <div className="min-h-[440px] max-h-[560px] overflow-y-auto space-y-5 rounded-2xl bg-gradient-to-b from-sky/15 via-foam/40 to-mint/5 border border-white/50 p-5 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <BingoAvatar size={64} />
            <h3 className="text-lg font-bold text-ocean">Start a conversation</h3>
            <p className="max-w-xs text-xs text-slate-500 leading-relaxed">
              Share what is on your mind, select your mood, or click any quick start prompt above.
            </p>
          </div>
        ) : null}

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

        {loading ? (
          <div className="flex items-start gap-3.5 animate-pulse-subtle">
            <BingoAvatar size={40} />
            <div className="rounded-2xl rounded-tl-none bg-white/80 backdrop-blur px-5 py-4 border border-white/50 shadow-sm flex items-center justify-center min-w-16">
              <div className="flex items-center gap-1.5 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-calm/75 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-calm/75 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-calm/75 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50/80 backdrop-blur p-4 text-sm font-medium text-red-700 shadow-sm animate-pulse-subtle">
          ⚠️ {error}
        </p>
      ) : null}

      <ChatInput disabled={loading} onSend={sendMessage} />
    </div>
  );
}
