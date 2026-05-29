import { Badge } from '@/components/ui/Badge';
import { BingooAvatar } from '@/components/ui/BingooAvatar';
import { motion } from 'framer-motion';

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
 <motion.div 
  layout
  initial={{ opacity: 0, y: 15, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
  className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
 >
 {!isUser ? (
 <div className="shrink-0 transition-transform hover:scale-105">
 <BingooAvatar size={40} />
 </div>
 ) : null}
 <div
 className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
 isUser
 ? 'bg-primary text-white rounded-tr-none shadow-[0_4px_12px_rgba(8,58,92,0.15)]'
 : crisisMode
 ? 'border-2 border-error/30 bg-error/20 text-[#852C1E] rounded-tl-none font-medium'
 : 'border border-border bg-surface/70 backdrop-blur rounded-tl-none text-textSecondary border-l-4 border-l-primary shadow-[0_4px_12px_rgba(8,58,92,0.02)]'
 }`}
 >
 {!isUser ? (
 <div className="flex items-center justify-between gap-4 mb-1 border-b border-border pb-1 select-none">
 <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted">Bingoo</span>
 {provider ? (
 <span className="text-[9px] font-bold uppercase tracking-wider text-muted bg-slate-100/60 rounded px-1.5 py-0.5">
 {provider} · {mode}
 </span>
 ) : null}
 </div>
 ) : null}
 
 <p className="whitespace-pre-wrap">{content}</p>
 
 {!isUser && suggestedExercise && !crisisMode ? (
 <div className="mt-3.5 pt-2 border-t border-border">
 <Badge tone="mint">💡 Suggested Exercise: {suggestedExercise}</Badge>
 </div>
 ) : null}
 </div>
 </motion.div>
 );
}
