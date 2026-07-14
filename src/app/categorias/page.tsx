import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicCategories } from '@/lib/public-data';

export const metadata: Metadata = {
  title: 'Categorias',
  description: 'Explore categorias de histórias infantis na biblioteca Histórias da Mamá.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const categories = await getPublicCategories();

  return (
    <main className="bg-[linear-gradient(180deg,#fffaf2_0%,#fff6fb_48%,#f5f1ff_100%)] px-5 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[1120px]">
        <div className="rounded-[1.75rem] bg-white/86 p-6 shadow-[0_24px_80px_rgba(59,36,107,.10)] ring-1 ring-white/85 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Escolha pelo clima da leitura</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-plum md:text-5xl">Categorias</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Encontre histórias por temas e descubra novas aventuras para cada momento de leitura.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              className="group rounded-[1.35rem] bg-white/90 p-5 shadow-[0_16px_46px_rgba(59,36,107,.08)] outline-none ring-1 ring-white/80 transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(59,36,107,.13)] focus-visible:ring-4 focus-visible:ring-coral/35"
              href={`/biblioteca?categoria=${category.slug}`}
              key={category.slug}
            >
              <span className="mb-4 block h-2 rounded-full" style={{ background: category.color }} />
              <h2 className="font-display text-2xl font-black text-plum transition group-hover:text-coral">
                {category.name}
              </h2>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
                {category.description || 'Veja histórias selecionadas para esta categoria.'}
              </p>
            </Link>
          ))}
        </div>

        <Link
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-plum px-6 py-3 font-black text-white shadow-[0_18px_42px_rgba(59,36,107,.20)] outline-none transition hover:-translate-y-1 hover:bg-coral focus-visible:ring-4 focus-visible:ring-coral/40"
          href="/biblioteca"
        >
          Ver todas as histórias
        </Link>
      </section>
    </main>
  );
}
