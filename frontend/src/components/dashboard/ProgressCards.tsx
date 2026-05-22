const stats = [
  { label: 'Journal Entries', value: '3', borderClass: 'border-t-primary bg-surface' },
  { label: 'Mood Check-ins', value: '5', borderClass: 'border-t-secondary bg-surface' },
  { label: 'Exercises Completed', value: '2', borderClass: 'border-t-success bg-surface' },
];

export function ProgressCards() {
 return (
 <div className="grid gap-4 sm:grid-cols-3 select-none">
 {stats.map((stat) => (
 <div 
 key={stat.label} 
 className={`glass-card glass-card-interactive rounded-2xl p-5 border-t-4 ${stat.borderClass} shadow-soft hover:-translate-y-0.5 transition-all duration-300`}
 >
 <p className="text-3xl font-extrabold text-textPrimary font-heading">{stat.value}</p>
 <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-muted">{stat.label}</p>
 </div>
 ))}
 </div>
 );
}
