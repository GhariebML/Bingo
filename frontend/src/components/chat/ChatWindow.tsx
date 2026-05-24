'use client';

import { useEffect, useRef, useState } from 'react';

import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { MoodSelector } from './MoodSelector';
import { BingoAvatar } from '@/components/ui/BingoAvatar';
import { useChat } from '@/hooks/useChat';
import { CrisisModal } from './CrisisModal';

const isCrisisText = (text: string) => {
  const lowercase = text.toLowerCase();
  const riskWords = [
    'suicide', 'self-harm', 'self harm', 'kill myself', 'end my life', 'cut myself',
    'انتحار', 'إيذاء نفسي', 'انهي حياتي', 'أنهي حياتي', 'عايز اموت', 'عايزة اموت'
  ];
  return riskWords.some(word => lowercase.includes(word));
};

export function ChatWindow({ quickPrompts = [] }: { quickPrompts?: string[] }) {
  const { error, loading, messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = (message: string) => {
    if (isCrisisText(message)) {
      setIsCrisisOpen(true);
    }
    sendMessage(message);
  };

  return (
    <div className="space-y-6">
      {/* Safety Crisis Alert Overlay */}
      <CrisisModal isOpen={isCrisisOpen} onClose={() => setIsCrisisOpen(false)} />

      {quickPrompts.length ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 select-none">
          {quickPrompts.map((prompt) => (
            <button
              className="rounded-xl border border-border bg-surface/60 backdrop-blur px-4 py-3 text-left text-sm font-semibold text-textPrimary transition-all duration-300 hover:bg-gradient-to-r hover:from-background hover:to-surface hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-50"
              disabled={loading}
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
      
      <MoodSelector />
      
      <div className="min-h-[440px] max-h-[560px] overflow-y-auto space-y-5 rounded-2xl bg-background border border-border p-5 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <BingoAvatar size={64} />
            <h3 className="text-lg font-bold text-textPrimary">Start a conversation</h3>
            <p className="max-w-xs text-xs text-muted leading-relaxed">
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
          <div className="flex items-start gap-3.5 ">
            <BingoAvatar size={40} />
            <div className="rounded-2xl rounded-tl-none bg-surface/80 backdrop-blur px-5 py-4 border border-border shadow-sm flex items-center justify-center min-w-16">
              <div className="flex items-center gap-1.5 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-primary/75 " style={{ animationDelay: '0ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/75 " style={{ animationDelay: '150ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/75 " style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50/80 backdrop-blur p-4 text-sm font-medium text-red-700 shadow-sm ">
          ⚠️ {error}
        </p>
      ) : null}

      <ChatInput disabled={loading} onSend={handleSendMessage} />
    </div>
  );
}
