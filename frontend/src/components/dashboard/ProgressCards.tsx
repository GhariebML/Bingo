const stats = [
  { label: 'Journal entries', value: '3' },
  { label: 'Mood check-ins', value: '5' },
  { label: 'Exercises tried', value: '2' },
];

export function ProgressCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
          <p className="text-3xl font-bold text-ocean">{stat.value}</p>
          <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
