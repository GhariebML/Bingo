export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-calm">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold text-ocean md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">{body}</p>
    </div>
  );
}
