export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
 return (
 <div className={`glass-card glass-card-interactive rounded-2xl p-6 ${className}`}>
 {title ? (
 <h2 className="mb-4 text-lg font-bold tracking-tight text-textPrimary border-b border-border pb-2">
 {title}
 </h2>
 ) : null}
 <div className="text-textSecondary text-sm leading-relaxed">{children}</div>
 </div>
 );
}
