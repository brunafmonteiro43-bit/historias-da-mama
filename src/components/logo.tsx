import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'light' | 'dark';
};

export function Logo({ orientation = 'horizontal', tone = 'dark' }: LogoProps) {
  const sizeClass = orientation === 'vertical' ? 'h-auto w-[190px]' : 'h-auto w-[154px] sm:w-[166px]';
  const surfaceClass =
    tone === 'light'
      ? 'bg-white/8 ring-white/12 hover:bg-white/12'
      : 'bg-white/72 ring-white/80 hover:bg-white';

  return (
    <Link
      aria-label="Histórias da Mamá"
      className={`inline-flex items-center rounded-2xl px-2.5 py-2 ring-1 backdrop-blur transition duration-300 ${surfaceClass}`}
      href="/"
    >
      <Image
        alt="Histórias da Mamá"
        className={sizeClass}
        height={53}
        priority
        quality={100}
        sizes="(min-width: 640px) 166px, 154px"
        src="/brand/logo-compact-clean.png"
        width={174}
      />
    </Link>
  );
}
