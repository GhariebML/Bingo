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
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-orb-1': 'float-1 25s ease-in-out infinite',
        'float-orb-2': 'float-2 30s ease-in-out infinite',
        'float-orb-3': 'float-3 20s ease-in-out infinite',
        'emoji-wiggle': 'emoji-wiggle 0.5s ease-in-out infinite',
        'emoji-bounce': 'emoji-bounce 0.6s ease-in-out infinite',
        'ripple-expand': 'ripple-out 4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite',
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
        'float-1': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1.05)' },
          '50%': { transform: 'translate(-30px, 50px) scale(0.95)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(0.95)' },
          '40%': { transform: 'translate(50px, 30px) scale(1.05)' },
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
      },
    },
  },
  plugins: [],
};
export default config;
