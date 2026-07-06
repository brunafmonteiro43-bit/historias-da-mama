'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/hm-admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-lilac/25 bg-white/88 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Logo />
          <div className="hidden items-center gap-7 font-bold text-plum md:flex">
            <Link className="transition hover:text-coral" href="/biblioteca">Histórias</Link>
            <Link className="transition hover:text-coral" href="/categorias">Categorias</Link>
            <Link className="transition hover:text-coral" href="/#sobre">Sobre</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link aria-label="Buscar histórias" className="grid h-12 w-12 place-items-center rounded-full bg-white text-plum shadow-sm ring-1 ring-lilac/20 transition hover:-translate-y-0.5" href="/biblioteca">
              <Search className="h-5 w-5" />
            </Link>
            <Link className="hidden rounded-full bg-plum px-5 py-3 font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-coral sm:inline-flex" href="/biblioteca">
              Começar a ler
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="mt-20 overflow-hidden bg-plum px-5 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-sm leading-7 text-white/75">Histórias infantis para imaginar, aprender e se encantar.</p>
          </div>
          <div>
            <h2 className="font-black">Links</h2>
            <div className="mt-4 grid gap-3 text-white/75 sm:grid-cols-2">
              <Link href="/biblioteca">Histórias</Link>
              <Link href="/categorias">Categorias</Link>
              <Link href="/#sobre">Sobre</Link>
              <Link href="/privacidade">Política de privacidade</Link>
              <Link href="/termos">Termos de uso</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
