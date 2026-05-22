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
 <span className="font-bold text-textPrimary uppercase tracking-wider">{item.day}</span>
 
 <div className="h-3.5 overflow-hidden rounded-full bg-surface border border-border p-[2px] shadow-inner">
 <div 
 className="h-full rounded-full bg-gradient-to-r from-secondary via-primary to-primary shadow-sm transition-all duration-1000 ease-out" 
 style={{ width: `${item.score * 10}%` }} 
 />
 </div>
 
 <span className="text-right text-muted font-semibold tracking-wide bg-surface/60 rounded px-2 py-0.5 border border-border">
 {item.mood}
 </span>
 </div>
 ))}
 </div>
 );
}
