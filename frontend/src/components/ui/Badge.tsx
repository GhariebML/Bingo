export function Badge({ children, tone = 'sky' }: { children: React.ReactNode; tone?: 'sky' | 'mint' | 'sand' | 'safety' }) {
  const tones = {
    sky: 'bg-sky/75 text-ocean',
    mint: 'bg-mint/55 text-ocean',
    sand: 'bg-sand/75 text-ocean',
    safety: 'bg-[#FFE8E8] text-[#9F2E2E]',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
