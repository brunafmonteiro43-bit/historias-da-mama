'use client';

import { BookOpen, Search, SlidersHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { StoryCard } from '@/components/story-card';
import type { Category, Story } from '@/types';

type SortMode = 'recentes' | 'mais-lidas' | 'titulo';
type FilterState = {
  ageRange: string;
  category: string;
  query: string;
  sort: SortMode;
};

type LibraryClientProps = {
  categories: Category[];
  stories: Story[];
};

const ALL_FILTERS = 'todas';
const SORT_MODES: SortMode[] = ['recentes', 'mais-lidas', 'titulo'];

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isSortMode(value: string | null): value is SortMode {
  return SORT_MODES.includes(value as SortMode);
}

function searchHaystack(story: Story) {
  return normalizeText(
    [
      story.title,
      story.description,
      story.fullDescription,
      story.author,
      story.category,
      story.categorySlug,
      story.ageRange,
      story.readingTime,
      story.theme,
      ...story.pages,
    ].join(' '),
  );
}

export function LibraryClient({ categories, stories }: LibraryClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlugs = useMemo(() => new Set(categories.map((item) => item.slug)), [categories]);
  const ageRanges = useMemo(() => Array.from(new Set(stories.map((story) => story.ageRange))).sort(), [stories]);
  const ageRangeSet = useMemo(() => new Set(ageRanges), [ageRanges]);

  const paramsState = useMemo<FilterState>(() => {
    const requestedCategory = searchParams.get('categoria') ?? ALL_FILTERS;
    const requestedAgeRange = searchParams.get('idade') ?? ALL_FILTERS;
    const requestedSort = searchParams.get('ordem');

    return {
      ageRange: ageRangeSet.has(requestedAgeRange) ? requestedAgeRange : ALL_FILTERS,
      category: categorySlugs.has(requestedCategory) ? requestedCategory : ALL_FILTERS,
      query: searchParams.get('q') ?? '',
      sort: isSortMode(requestedSort) ? requestedSort : 'recentes',
    };
  }, [ageRangeSet, categorySlugs, searchParams]);

  const [queryDraft, setQueryDraft] = useState(paramsState.query);

  useEffect(() => {
    setQueryDraft(paramsState.query);
  }, [paramsState.query]);

  const filteredStories = useMemo(() => {
    const searchTerms = normalizeText(paramsState.query).trim().split(/\s+/).filter(Boolean);

    return stories
      .filter((story) => {
        const matchesSearch = searchTerms.length === 0 || searchTerms.every((term) => searchHaystack(story).includes(term));
        const matchesCategory = paramsState.category === ALL_FILTERS || story.categorySlug === paramsState.category;
        const matchesAge = paramsState.ageRange === ALL_FILTERS || story.ageRange === paramsState.ageRange;

        return matchesSearch && matchesCategory && matchesAge;
      })
      .sort((a, b) => {
        if (paramsState.sort === 'mais-lidas') {
          return b.readCount - a.readCount;
        }

        if (paramsState.sort === 'titulo') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [paramsState.ageRange, paramsState.category, paramsState.query, paramsState.sort, stories]);

  function updateFilters(nextFilters: Partial<FilterState>) {
    const nextState = { ...paramsState, ...nextFilters };
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextState.query.trim()) {
      nextParams.set('q', nextState.query.trim());
    } else {
      nextParams.delete('q');
    }

    if (nextState.category !== ALL_FILTERS) {
      nextParams.set('categoria', nextState.category);
    } else {
      nextParams.delete('categoria');
    }

    if (nextState.ageRange !== ALL_FILTERS) {
      nextParams.set('idade', nextState.ageRange);
    } else {
      nextParams.delete('idade');
    }

    if (nextState.sort !== 'recentes') {
      nextParams.set('ordem', nextState.sort);
    } else {
      nextParams.delete('ordem');
    }

    router.replace(`${pathname}${nextParams.size ? `?${nextParams.toString()}` : ''}`, { scroll: false });
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[1.35rem] border border-lilac/15 bg-white/95 p-6 shadow-[0_22px_70px_rgba(59,36,107,.10)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Leitura livre</p>
            <h1 className="mt-2 font-display text-4xl font-black text-plum md:text-5xl">Biblioteca</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Busque por título, filtre por categoria ou idade, e escolha a próxima história para ler agora.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-black text-plum">
            <BookOpen className="h-4 w-4" />
            {stories.length} histórias publicadas
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-[1.4fr_.8fr_.8fr_.8fr]" id="categorias">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-plum" />
            <input
              aria-label="Buscar histórias"
              className="w-full rounded-2xl border border-lilac/35 bg-cream/45 py-3 pl-12 pr-4 outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
              onChange={(event) => {
                setQueryDraft(event.target.value);
                updateFilters({ query: event.target.value });
              }}
              placeholder="Buscar histórias..."
              value={queryDraft}
            />
          </label>

          <select
            aria-label="Filtrar por categoria"
            className="rounded-2xl border border-lilac/35 bg-skyPastel/25 px-4 py-3 text-plum outline-none focus:border-plum focus:ring-4 focus:ring-lilac/25"
            onChange={(event) => updateFilters({ category: event.target.value })}
            value={paramsState.category}
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
            className="rounded-2xl border border-lilac/35 bg-rose/30 px-4 py-3 text-plum outline-none focus:border-plum focus:ring-4 focus:ring-lilac/25"
            onChange={(event) => updateFilters({ ageRange: event.target.value })}
            value={paramsState.ageRange}
          >
            <option value="todas">Todas as idades</option>
            {ageRanges.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            aria-label="Ordenar histórias"
            className="rounded-2xl border border-lilac/35 bg-sun/35 px-4 py-3 text-plum outline-none focus:border-plum focus:ring-4 focus:ring-lilac/25"
            onChange={(event) => updateFilters({ sort: event.target.value as SortMode })}
            value={paramsState.sort}
          >
            <option value="recentes">Mais recentes</option>
            <option value="mais-lidas">Mais lidas</option>
            <option value="titulo">Título</option>
          </select>
        </div>
      </section>

      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-600">
        <SlidersHorizontal className="h-4 w-4 text-plum" />
        {filteredStories.length} história{filteredStories.length === 1 ? '' : 's'} encontrada
        {filteredStories.length === 1 ? '' : 's'}
      </div>

      {filteredStories.length > 0 ? (
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-[1.35rem] bg-white p-10 text-center shadow-[0_18px_55px_rgba(59,36,107,.09)] ring-1 ring-lilac/15">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose/35 text-plum">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-black text-plum">Nenhuma história encontrada</h2>
          <p className="mt-3 text-slate-600">Tente remover algum filtro ou buscar por outro título.</p>
        </section>
      )}
    </main>
  );
}
