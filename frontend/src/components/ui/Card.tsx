export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card glass-card-interactive rounded-2xl p-6 ${className}`}>
      {title ? (
        <h2 className="mb-4 text-lg font-bold tracking-tight text-ocean border-b border-ocean/5 pb-2">
          {title}
        </h2>
      ) : null}
      <div className="text-slate-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
