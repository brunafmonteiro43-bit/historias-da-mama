'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';

const shell = 'mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-lilac/20 bg-white/92 backdrop-blur-xl">
        <nav className={`${shell} flex h-[70px] items-center justify-between gap-4`}>
          <Logo />
          <div className="hidden items-center gap-7 text-sm font-black text-plum md:flex">
            <Link className="transition hover:text-coral" href="/biblioteca">
              Histórias
            </Link>
            <Link className="transition hover:text-coral" href="/#categorias">
              Categorias
            </Link>
            <Link className="transition hover:text-coral" href="/#sobre">
              Sobre
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              aria-label="Buscar histórias"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-plum shadow-sm ring-1 ring-lilac/15 transition hover:text-coral"
              href="/biblioteca"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link className="hidden rounded-full bg-plum px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-coral sm:inline-flex" href="/biblioteca">
              Começar a ler
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="overflow-hidden bg-[#2f185f] px-5 py-12 text-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-9 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-md leading-7 text-white/75">
              Histórias infantis para imaginar, aprender e se encantar em família.
            </p>
          </div>
          <nav className="grid gap-3 text-white/78 sm:grid-cols-2">
            <Link className="transition hover:text-white" href="/biblioteca">
              Histórias
            </Link>
            <Link className="transition hover:text-white" href="/#categorias">
              Categorias
            </Link>
            <Link className="transition hover:text-white" href="/#sobre">
              Sobre
            </Link>
            <Link className="transition hover:text-white" href="/privacidade">
              Política de Privacidade
            </Link>
            <Link className="transition hover:text-white" href="/termos">
              Termos de Uso
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
