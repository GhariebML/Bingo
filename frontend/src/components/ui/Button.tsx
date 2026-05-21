type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ocean text-white shadow-soft hover:bg-ink',
  secondary: 'bg-mint text-ocean hover:bg-sky',
  ghost: 'bg-white/70 text-ocean ring-1 ring-ocean/10 hover:bg-white',
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
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
