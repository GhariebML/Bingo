type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary/90 hover:shadow-lg',
  secondary: 'bg-secondary text-white shadow-soft hover:bg-secondary/90 hover:shadow-lg',
  ghost: 'bg-surface text-textPrimary border border-border hover:bg-surface/80 hover:border-textSecondary/20 shadow-sm',
};

export function Button({
 children,
 className = '',
 disabled = false,
 onClick,
 type = 'button',
 variant = 'primary',
 title,
}: {
 children: React.ReactNode;
 className?: string;
 disabled?: boolean;
 onClick?: () => void;
 type?: 'button' | 'submit';
 variant?: ButtonVariant;
 title?: string;
}) {
 return (
 <button
 disabled={disabled}
 onClick={onClick}
 type={type}
 title={title}
 className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
 >
 {children}
 </button>
 );
}
