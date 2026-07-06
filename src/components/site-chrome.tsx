'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-lilac/25 bg-white/88 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Logo />
          <div className="hidden items-center gap-6 font-bold text-plum md:flex">
            <Link className="transition hover:text-coral" href="/biblioteca">
              Biblioteca
            </Link>
            <Link className="transition hover:text-coral" href="/#sobre">
              Sobre
            </Link>
            <Link className="rounded-full bg-plum px-4 py-2 text-white shadow-sm transition hover:bg-coral" href="/admin">
              Admin
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="mt-20 overflow-hidden bg-plum px-5 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_.8fr_.8fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-sm leading-7 text-white/75">
              Biblioteca infantil premium para imaginar, aprender e se encantar em família, escolas e espaços terapêuticos.
            </p>
          </div>
          <div>
            <h2 className="font-black">Explorar</h2>
            <div className="mt-4 grid gap-3 text-white/75">
              <Link href="/biblioteca">Biblioteca</Link>
              <Link href="/#destaques">Destaques</Link>
              <Link href="/#categorias">Categorias</Link>
            </div>
          </div>
          <div>
            <h2 className="font-black">Contato e segurança</h2>
            <div className="mt-4 grid gap-3 text-white/75">
              <Link href="/admin">Área administrativa</Link>
              <Link href="/privacidade">Política de privacidade</Link>
              <Link href="/termos">Termos de uso</Link>
              <span>contato@historiasdamama.com</span>
            </div>
            <Link className="mt-5 inline-flex rounded-full bg-white px-5 py-3 font-black text-plum" href="/admin">
              Área administrativa
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
