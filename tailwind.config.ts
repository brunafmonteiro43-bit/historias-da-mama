import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#273142',
        plum: '#3B246B',
        lilac: '#B79BEF',
        coral: '#F36F91',
        skyPastel: '#BFEAF5',
        aqua: '#8FD8CF',
        sun: '#FFE7A3',
        cream: '#FFF8EA',
        rose: '#FFD6E8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Nunito', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(59,36,107,.14)',
        glow: '0 30px 90px rgba(183,155,239,.28)',
      },
    },
  },
  plugins: [],
};

export default config;
