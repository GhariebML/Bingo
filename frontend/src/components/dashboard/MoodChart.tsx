export function MoodChart({ data }: { data?: Array<{ day: string; mood: string; score: number }> }) {
  const items = data ?? [
    { day: 'Mon', mood: 'Stressed', score: 4 },
    { day: 'Tue', mood: 'Anxious', score: 5 },
    { day: 'Wed', mood: 'Calm', score: 6 },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.day} className="grid grid-cols-[3rem_1fr_5rem] items-center gap-3 text-sm">
          <span className="font-semibold text-ocean">{item.day}</span>
          <div className="h-3 overflow-hidden rounded-full bg-sky/50">
            <div className="h-full rounded-full bg-ocean" style={{ width: `${item.score * 10}%` }} />
          </div>
          <span className="text-right text-slate-600">{item.mood}</span>
        </div>
      ))}
    </div>
  );
}
