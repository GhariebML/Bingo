export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-calm focus:bg-white focus:ring-4 focus:ring-calm/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
