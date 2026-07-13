import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'light' | 'dark';
};

export function Logo({ orientation = 'horizontal', tone = 'dark' }: LogoProps) {
  const sizeClass = orientation === 'vertical' ? 'h-auto w-[190px] sm:w-[220px]' : 'h-auto w-[140px] sm:w-[170px] lg:w-[220px]';
  const surfaceClass =
    tone === 'light'
      ? 'bg-white/95 ring-white/70'
      : 'bg-transparent ring-transparent';

  return (
    <Link
      aria-label="Histórias da Mamá"
      className={`inline-flex items-center rounded-2xl p-1.5 ring-1 transition duration-300 ${surfaceClass}`}
      href="/"
    >
      <Image
        alt="Histórias da Mamá"
        className={sizeClass}
        height={270}
        priority
        quality={100}
        sizes="(min-width: 1024px) 220px, (min-width: 640px) 170px, 140px"
        src="/brand/logo-historias-da-mama-horizontal.png"
        unoptimized
        width={880}
      />
    </Link>
  );
}
