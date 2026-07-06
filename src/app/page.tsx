import { Compass, Flower2, HeartHandshake, Library, Search, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { BrandIllustration } from '@/components/brand-illustration';
import { StoryCard } from '@/components/story-card';
import { categories, featured, publishedStories } from '@/data/stories';
import type { Story } from '@/types';

const categoryIcons = {
  aventura: Compass,
  fantasia: Wand2,
  amizade: HeartHandshake,
  natureza: Flower2,
  inclusao: Sparkles,
};

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FFF8EA_0%,#ECFBFF_48%,#FFF0F5_100%)] px-5 py-16 md:py-20">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white/45" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-plum shadow-sm">
              <Sparkles className="h-4 w-4 text-coral" />
              Biblioteca infantil premium
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-[1.02] text-plum md:text-7xl">Histórias da Mamá</h1>
            <p className="mt-6 max-w-xl text-xl leading-9 text-slate-700">
              Histórias infantis para imaginar, aprender e se encantar.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link className="rounded-[1.35rem] bg-plum px-7 py-4 font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-coral" href="/biblioteca">
                Começar a ler
              </Link>
              <Link className="rounded-[1.35rem] bg-white px-7 py-4 font-black text-plum shadow-soft transition hover:-translate-y-1" href="/biblioteca">
                Ver biblioteca
              </Link>
            </div>
          </div>

          <EnchantedLibraryScene />
        </div>
      </section>

      <Shelf id="destaques" title="Histórias em destaque" items={featured} />
      <Shelf title="Histórias recentes" items={publishedStories.slice().reverse()} />
      <Shelf title="Mais lidas" items={publishedStories.filter((story) => story.popular)} />

      <section className="mx-auto max-w-7xl px-5 py-16" id="categorias">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Explorar por tema</p>
            <h2 className="mt-2 font-display text-4xl font-black text-plum">Categorias e faixa etária</h2>
          </div>
          <Link className="rounded-full bg-white px-5 py-3 font-black text-plum shadow-sm" href="/biblioteca">
            Abrir biblioteca
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? Library;

            return (
              <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-lilac/20" key={category.name}>
                <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: category.color }}>
                  <Icon className="h-7 w-7" style={{ color: category.accentColor }} />
                </div>
                <h3 className="mt-5 text-xl font-black text-plum">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16" id="sobre">
        <div className="mb-3 flex items-center gap-4">
          <h2 className="font-display text-4xl font-black text-plum">Estante da Mamá</h2>
          <div className="h-2 flex-1 rounded-full bg-[linear-gradient(90deg,#FFE7A3,#F36F91,#B79BEF,#8FD8CF)]" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Library, title: 'Leitura livre', text: 'Visitantes acessam histórias publicadas sem conta e sem barreiras.' },
            { icon: Search, title: 'Biblioteca organizada', text: 'Busca, filtros e ordenação ajudam famílias a encontrar a próxima leitura.' },
            { icon: ShieldCheck, title: 'Admin protegido', text: 'Somente administradores cadastrados no Supabase gerenciam o conteúdo.' },
          ].map(({ icon: Icon, text, title }) => (
            <article className="rounded-[2rem] bg-white p-8 shadow-soft ring-1 ring-lilac/20" key={title}>
              <Icon className="h-9 w-9 text-plum" />
              <h3 className="mt-5 text-2xl font-black text-plum">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Shelf({ id, items, title }: { id?: string; items: Story[]; title: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12" id={id}>
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-black text-plum">{title}</h2>
        <div className="hidden h-3 flex-1 rounded-full bg-[linear-gradient(90deg,#FFE7A3,#F36F91,#B79BEF,#8FD8CF)] md:block" />
        <Sparkles className="hidden h-6 w-6 text-coral md:block" />
      </div>
      <div className="flex gap-6 overflow-x-auto pb-7">
        {items.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>
    </section>
  );
}

function EnchantedLibraryScene() {
  return (
    <div className="relative z-10">
      <BrandIllustration className="brand-float h-auto w-full drop-shadow-[0_30px_55px_rgba(59,36,107,.22)]" title="Balão de pensamento com livro aberto, castelo, árvore e estrelas" />
    </div>
  );
}
