'use client';

import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './logo';

const shell = 'mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8';

const mainLinks = [
  { href: '/biblioteca', label: 'Histórias' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/sobre', label: 'Sobre' },
];

const mobileLinks = [
  ...mainLinks,
  { href: '/enviar-historia', label: 'Enviar história' },
  { href: '/politica-de-privacidade', label: 'Política de Privacidade' },
  { href: '/termos-de-uso', label: 'Termos de Uso' },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/hm-admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/82 shadow-[0_10px_35px_rgba(59,36,107,.06)] backdrop-blur-xl">
        <nav className={`${shell} flex h-[72px] items-center justify-between gap-3 lg:h-[82px]`}>
          <Logo />
          <div className="hidden items-center gap-2 rounded-full bg-white/68 p-1 text-sm font-black text-plum ring-1 ring-white/80 md:flex">
            {mainLinks.map((link) => (
              <Link className="rounded-full px-4 py-2 transition hover:bg-cream hover:text-coral" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              aria-label="Buscar histórias"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-plum shadow-[0_10px_24px_rgba(59,36,107,.08)] ring-1 ring-white/80 transition hover:-translate-y-0.5 hover:text-coral"
              href="/biblioteca"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              className="hidden rounded-full bg-plum px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(59,36,107,.18)] transition hover:-translate-y-0.5 hover:bg-coral sm:inline-flex"
              href="/biblioteca"
            >
              Começar a ler
            </Link>
            <button
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="grid h-10 w-10 place-items-center rounded-full bg-plum text-white shadow-[0_12px_26px_rgba(59,36,107,.18)] transition hover:-translate-y-0.5 hover:bg-coral focus:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 md:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen ? (
          <div className={`${shell} pb-4 md:hidden`} id="mobile-menu">
            <div className="grid gap-2 rounded-[1.25rem] border border-lilac/15 bg-white/95 p-3 text-sm font-black text-plum shadow-[0_18px_45px_rgba(59,36,107,.12)]">
              {mobileLinks.map((link) => (
                <Link
                  className="rounded-2xl px-4 py-3 transition hover:bg-cream hover:text-coral focus:outline-none focus-visible:ring-4 focus-visible:ring-coral/30"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      {children}
      <footer className="overflow-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(183,155,239,.24),transparent_34%),linear-gradient(135deg,#2f185f,#251148)] px-5 py-12 text-white">
        <div className="mx-auto grid w-full max-w-[1240px] gap-9 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-md leading-7 text-white/75">
              Histórias infantis para imaginar, aprender e se encantar em família.
            </p>
          </div>
          <nav className="grid gap-3 text-white/78 sm:grid-cols-2" aria-label="Links do rodapé">
            <Link className="outline-none transition hover:text-white focus-visible:ring-4 focus-visible:ring-white/30" href="/biblioteca">
              Histórias
            </Link>
            <Link className="outline-none transition hover:text-white focus-visible:ring-4 focus-visible:ring-white/30" href="/categorias">
              Categorias
            </Link>
            <Link className="outline-none transition hover:text-white focus-visible:ring-4 focus-visible:ring-white/30" href="/sobre">
              Sobre
            </Link>
            <Link
              className="outline-none transition hover:text-white focus-visible:ring-4 focus-visible:ring-white/30"
              href="/politica-de-privacidade"
            >
              Política de Privacidade
            </Link>
            <Link className="outline-none transition hover:text-white focus-visible:ring-4 focus-visible:ring-white/30" href="/termos-de-uso">
              Termos de Uso
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
