import { Badge } from '@/components/ui/Badge';
import { BingoAvatar } from '@/components/ui/BingoAvatar';

export function ChatMessage({
  role,
  content,
  crisisMode,
  mode,
  provider,
  suggestedExercise,
}: {
  role: 'user' | 'assistant';
  content: string;
  crisisMode?: boolean;
  mode?: string;
  provider?: string;
  suggestedExercise?: string;
}) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? <BingoAvatar size={38} /> : null}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser ? 'bg-ocean text-white' : crisisMode ? 'border border-[#F5B7B7] bg-[#FFE8E8] text-[#7A2323]' : 'border border-white bg-white text-slate-700'
        }`}
      >
        {!isUser ? <p className="mb-1 text-xs font-bold uppercase tracking-wide text-calm">Bingo</p> : null}
        <p>{content}</p>
        {!isUser && provider ? (
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{provider} / {mode}</p>
        ) : null}
        {!isUser && suggestedExercise && !crisisMode ? (
          <div className="mt-3">
            <Badge tone="mint">Suggested: {suggestedExercise}</Badge>
          </div>
        ) : null}
      </div>
    </div>
  );
}
