import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
};
export default config;
