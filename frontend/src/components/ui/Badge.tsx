export function Badge({ children, tone = 'sky' }: { children: React.ReactNode; tone?: 'sky' | 'mint' | 'sand' | 'safety' }) {
 const tones = {
 sky: 'bg-surface text-textPrimary',
 mint: 'bg-surface text-textPrimary',
 sand: 'bg-surface text-textPrimary',
 safety: 'bg-[#FFE8E8] text-[#9F2E2E]',
 };

 return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
