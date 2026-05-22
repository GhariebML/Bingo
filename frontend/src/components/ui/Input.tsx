export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
 return (
 <input
 {...props}
 className={`w-full rounded-xl border border-border bg-surface/70 px-4 py-2.5 text-sm placeholder:text-muted outline-none transition-all duration-300 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
 />
 );
}
