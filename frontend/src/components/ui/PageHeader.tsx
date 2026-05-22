export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
 return (
 <div>
 <p className="text-sm font-semibold uppercase text-muted">{eyebrow}</p>
 <h1 className="mt-2 text-4xl font-bold text-textPrimary md:text-5xl">{title}</h1>
 <p className="mt-3 max-w-2xl text-base leading-7 text-textSecondary md:text-lg">{body}</p>
 </div>
 );
}
