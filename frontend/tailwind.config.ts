import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        textPrimary: 'rgb(var(--textPrimary) / <alpha-value>)',
        textSecondary: 'rgb(var(--textSecondary) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        success: '#22C55E',
        error: 'rgb(var(--error) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.15)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'emoji-wiggle': 'emoji-wiggle 0.5s ease-in-out infinite',
        'emoji-bounce': 'emoji-bounce 0.6s ease-in-out infinite',
        'ripple-expand': 'ripple-out 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite',
        'avatar-bob': 'avatar-bob 3s ease-in-out infinite',
        'particle-drift': 'particle-drift 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(15px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },

        'emoji-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-6deg)' },
          '75%': { transform: 'rotate(6deg)' },
        },
        'emoji-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'ripple-out': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'avatar-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'particle-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translate(15px, -15px) scale(1.1)', opacity: '0.8' },
          '66%': { transform: 'translate(-10px, 15px) scale(0.9)', opacity: '0.4' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
