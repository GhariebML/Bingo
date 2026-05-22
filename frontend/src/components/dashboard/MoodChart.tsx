export function MoodChart({ data }: { data?: Array<{ day: string; mood: string; score: number }> }) {
  const items = data ?? [
    { day: 'Mon', mood: 'Stressed', score: 4 },
    { day: 'Tue', mood: 'Anxious', score: 5 },
    { day: 'Wed', mood: 'Calmer', score: 6 },
    { day: 'Thu', mood: 'Hopeful', score: 7 },
  ];

  return (
    <div className="space-y-4.5 py-2">
      {items.map((item) => (
        <div key={item.day} className="grid grid-cols-[3.5rem_1fr_5.5rem] items-center gap-4 text-xs font-bold select-none">
          <span className="font-bold text-ocean uppercase tracking-wider">{item.day}</span>
          
          <div className="h-3.5 overflow-hidden rounded-full bg-sky/30 border border-sky/40 p-[2px] shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-mint via-calm to-ocean shadow-sm transition-all duration-1000 ease-out" 
              style={{ width: `${item.score * 10}%` }} 
            />
          </div>
          
          <span className="text-right text-slate-500 font-semibold tracking-wide bg-slate-100/60 rounded px-2 py-0.5 border border-slate-200/50">
            {item.mood}
          </span>
        </div>
      ))}
    </div>
  );
}
