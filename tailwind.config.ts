import type { Config } from 'tailwindcss';
const config: Config = { darkMode: ['class'], content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { skyPastel:'#BFE7FF', lilac:'#DCCBFF', sun:'#FFE8A3', rose:'#FFD6E8', aqua:'#BDEFE7', ink:'#293241' }, fontFamily: { sans: ['var(--font-sans)', 'Nunito', 'sans-serif'] }, boxShadow:{soft:'0 24px 80px rgba(91,78,140,.16)'} } }, plugins: [] };
export default config;
