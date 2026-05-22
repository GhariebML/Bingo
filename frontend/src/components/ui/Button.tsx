type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
 primary: 'bg-gradient-to-r from-ocean to-[#0E4F75] text-white shadow-[0_4px_20px_-2px_rgba(8,58,92,0.25)] hover:from-[#0E4F75] hover:to-primary/90 hover:shadow-[0_6px_24px_-2px_rgba(8,58,92,0.35)]',
 secondary: 'bg-gradient-to-r from-mint to-sky/90 text-textPrimary shadow-[0_4px_16px_rgba(184,235,217,0.25)] hover:brightness-[1.03] hover:shadow-[0_6px_20px_rgba(184,235,217,0.35)]',
 ghost: 'bg-white/50 backdrop-blur-sm text-textPrimary border border-border hover:bg-white/90 hover:border-border shadow-sm',
};

export function Button({
 children,
 className = '',
 disabled = false,
 onClick,
 type = 'button',
 variant = 'primary',
}: {
 children: React.ReactNode;
 className?: string;
 disabled?: boolean;
 onClick?: () => void;
 type?: 'button' | 'submit';
 variant?: ButtonVariant;
}) {
 return (
 <button
 disabled={disabled}
 onClick={onClick}
 type={type}
 className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
 >
 {children}
 </button>
 );
}
