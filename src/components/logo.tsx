import Link from 'next/link';
import { BrandIllustration } from './brand-illustration';

type LogoProps = {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'light' | 'dark';
};

export function Logo({ orientation = 'horizontal', tone = 'dark' }: LogoProps) {
  const textColor = tone === 'light' ? 'text-white' : 'text-plum';
  const subTextColor = tone === 'light' ? 'text-white/72' : 'text-ink/70';

  return (
    <Link
      aria-label="Histórias da Mamá"
      className={orientation === 'vertical' ? 'inline-flex flex-col items-center gap-2 text-center' : 'flex items-center gap-3'}
      href="/"
    >
      <BrandIllustration className={orientation === 'vertical' ? 'h-28 w-36' : 'h-14 w-16'} compact title="Logo Histórias da Mamá" />
      <span className={orientation === 'vertical' ? '' : 'grid leading-none'}>
        <span className={`font-display text-2xl font-black tracking-normal ${textColor}`}>Histórias</span>
        <span className={`font-display text-xl font-black tracking-normal ${orientation === 'vertical' ? 'text-coral' : textColor}`}>
          da Mamá
        </span>
        {orientation === 'vertical' ? (
          <span className={`mt-1 block text-[0.62rem] font-black uppercase tracking-[0.24em] ${subTextColor}`}>
            Imaginar, aprender e se encantar
          </span>
        ) : null}
      </span>
    </Link>
  );
}
