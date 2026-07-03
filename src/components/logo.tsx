import Link from 'next/link';

type LogoProps = {
  tone?: 'light' | 'dark';
};

export function Logo({ tone = 'dark' }: LogoProps) {
  const textColor = tone === 'light' ? 'text-white' : 'text-ink';

  return (
    <Link aria-label="Histórias da Mamá" className="flex items-center gap-3" href="/">
      <svg className="h-12 w-12 drop-shadow-sm" role="img" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="logo-book" x1="10" x2="86" y1="8" y2="88">
            <stop stopColor="#FFE8A3" />
            <stop offset="0.48" stopColor="#DCCBFF" />
            <stop offset="1" stopColor="#BFE7FF" />
          </linearGradient>
        </defs>
        <rect fill="url(#logo-book)" height="96" rx="28" width="96" />
        <path d="M23 31c10-6 20-7 25-2 5-5 15-4 25 2v36c-10-6-20-7-25-2-5-5-15-4-25 2V31Z" fill="#fffdf7" />
        <path d="M48 29v37M30 39c6-2 11-2 15 1M51 40c4-3 10-3 16-1" stroke="#7C5CC4" strokeLinecap="round" strokeWidth="4" />
        <path d="M35 23c3-8 9-11 13-11s10 3 13 11" fill="none" stroke="#293241" strokeLinecap="round" strokeWidth="5" />
        <circle cx="72" cy="23" fill="#FFD6E8" r="6" />
        <circle cx="25" cy="73" fill="#BDEFE7" r="5" />
      </svg>
      <span className={`text-xl font-black tracking-tight ${textColor}`}>Histórias da Mamá</span>
    </Link>
  );
}
