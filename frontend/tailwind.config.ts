import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        ocean: '#083A5C',
        navy: '#062B44',
        sky: '#DDF4FF',
        mint: '#B8EBD9',
        sand: '#F7E8C9',
        foam: '#FFF9EF',
        calm: '#2F6F73',
        sage: '#8AA399',
        coral: '#D97862',
        ink: '#102A43',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(11, 53, 88, 0.12)',
        glass: '0 8px 32px 0 rgba(8, 58, 92, 0.05)',
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
        'float-medium': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
