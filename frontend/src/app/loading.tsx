export default function Loading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="flex items-center gap-1.5 py-1">
        <span className="h-3 w-3 rounded-full bg-primary/75 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-3 w-3 rounded-full bg-primary/75 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-3 w-3 rounded-full bg-primary/75 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-sm font-semibold text-muted tracking-widest uppercase">Loading</p>
    </div>
  );
}
