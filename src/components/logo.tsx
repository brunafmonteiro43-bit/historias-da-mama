import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'light' | 'dark';
};

export function Logo({ orientation = 'horizontal' }: LogoProps) {
  const sizeClass = orientation === 'vertical' ? 'h-auto w-[188px]' : 'h-auto w-[150px]';

  return (
    <Link aria-label="Histórias da Mamá" className="inline-flex items-center" href="/">
      <Image
        alt="Histórias da Mamá"
        className={sizeClass}
        height={53}
        priority
        src="/brand/logo-compact-clean.png"
        width={174}
      />
    </Link>
  );
}
