'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StoryCard } from '@/components/story-card';
import type { Category, Story } from '@/types';

type SortMode = 'recentes' | 'mais-lidas' | 'titulo';

type LibraryClientProps = {
  categories: Category[];
  stories: Story[];
};

export function LibraryClient({ categories, stories }: LibraryClientProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [ageRange, setAgeRange] = useState('todas');
  const [sort, setSort] = useState<SortMode>('recentes');

  const ageRanges = useMemo(() => Array.from(new Set(stories.map((story) => story.ageRange))), [stories]);
  const filteredStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stories
      .filter((story) => {
        const matchesSearch =
          !normalizedQuery ||
          story.title.toLowerCase().includes(normalizedQuery) ||
          story.description.toLowerCase().includes(normalizedQuery) ||
          story.category.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === 'todas' || story.categorySlug === category;
        const matchesAge = ageRange === 'todas' || story.ageRange === ageRange;

        return matchesSearch && matchesCategory && matchesAge;
      })
      .sort((a, b) => {
        if (sort === 'mais-lidas') {
          return b.readCount - a.readCount;
        }

        if (sort === 'titulo') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [ageRange, category, query, sort, stories]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">Leitura livre</p>
        <h1 className="mt-2 text-5xl font-black text-ink">Biblioteca</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Busque por título, filtre por categoria ou idade, e escolha a próxima história para ler agora.
        </p>

        <div className="mt-7 grid gap-3 md:grid-cols-[1.4fr_.8fr_.8fr_.8fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Buscar histórias"
              className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar histórias..."
              value={query}
            />
          </label>

          <select
            aria-label="Filtrar por categoria"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="todas">Todas as categorias</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por idade"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            onChange={(event) => setAgeRange(event.target.value)}
            value={ageRange}
          >
            <option value="todas">Todas as idades</option>
            {ageRanges.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            aria-label="Ordenar histórias"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            onChange={(event) => setSort(event.target.value as SortMode)}
            value={sort}
          >
            <option value="recentes">Mais recentes</option>
            <option value="mais-lidas">Mais lidas</option>
            <option value="titulo">Título</option>
          </select>
        </div>
      </section>

      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-600">
        <SlidersHorizontal className="h-4 w-4" />
        {filteredStories.length} história{filteredStories.length === 1 ? '' : 's'} encontrada{filteredStories.length === 1 ? '' : 's'}
      </div>

      {filteredStories.length > 0 ? (
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h2 className="text-2xl font-black text-ink">Nenhuma história encontrada</h2>
          <p className="mt-3 text-slate-600">Tente remover algum filtro ou buscar por outro título.</p>
        </section>
      )}
    </main>
  );
}
