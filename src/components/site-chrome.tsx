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
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Logo />
          <div className="hidden items-center gap-6 font-bold md:flex">
            <Link href="/biblioteca">Biblioteca</Link>
            <Link href="/#sobre">Sobre</Link>
            <Link className="rounded-full bg-ink px-4 py-2 text-white" href="/admin">
              Admin
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="mt-20 overflow-hidden bg-ink px-5 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_.8fr_.8fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-sm leading-7 text-white/75">
              Biblioteca infantil aberta, carinhosa e pronta para leitura em família, escolas e espaços terapêuticos.
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
            <h2 className="font-black">Acesso privado</h2>
            <p className="mt-4 text-white/75">Somente administradores entram com senha. Visitantes leem livremente.</p>
            <Link className="mt-5 inline-flex rounded-full bg-white px-5 py-3 font-black text-ink" href="/admin">
              Área administrativa
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
