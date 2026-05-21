export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/80 bg-white/95 p-5 shadow-soft backdrop-blur ${className}`}>
      {title ? <h2 className="mb-3 text-lg font-semibold text-ocean">{title}</h2> : null}
      <div className="text-slate-700">{children}</div>
    </div>
  );
}
