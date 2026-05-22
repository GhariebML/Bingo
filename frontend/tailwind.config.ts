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
        ocean: '#0F172A', /* slate-900 */
        navy: '#020617',  /* slate-950 */
        sky: '#F1F5F9',   /* slate-100 */
        mint: '#E2E8F0',  /* slate-200 */
        sand: '#F8FAFC',  /* slate-50 */
        foam: '#FFFFFF',  /* white */
        calm: '#334155',  /* slate-700 */
        sage: '#94A3B8',  /* slate-400 */
        coral: '#F87171', /* red-400 */
        ink: '#020617',   /* slate-950 */
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
