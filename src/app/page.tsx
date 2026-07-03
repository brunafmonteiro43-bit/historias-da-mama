import { Compass, Flower2, HeartHandshake, Library, Search, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff8ed_0%,#eff9ff_48%,#fff3f8_100%)] px-5 py-16 md:py-20">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white/45" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Biblioteca infantil premium
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] text-ink md:text-7xl">Histórias da Mamá</h1>
            <p className="mt-6 max-w-xl text-xl leading-9 text-slate-700">
              Um cantinho livre para crianças, famílias e educadores lerem histórias ilustradas com calma, encanto e segurança.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link className="rounded-[1.35rem] bg-ink px-7 py-4 font-black text-white shadow-soft transition hover:-translate-y-1" href="/biblioteca">
                Começar a ler
              </Link>
              <Link className="rounded-[1.35rem] bg-white px-7 py-4 font-black text-ink shadow-soft transition hover:-translate-y-1" href="#destaques">
                Ver destaques
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
            <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">Explorar por tema</p>
            <h2 className="mt-2 text-4xl font-black text-ink">Categorias e faixa etária</h2>
          </div>
          <Link className="rounded-full bg-slate-100 px-5 py-3 font-black text-ink" href="/biblioteca">
            Abrir biblioteca
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? Library;

            return (
              <article className="rounded-3xl bg-white p-6 shadow-soft" key={category.name}>
                <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: category.color }}>
                  <Icon className="h-7 w-7" style={{ color: category.accentColor }} />
                </div>
                <h3 className="mt-5 text-xl font-black text-ink">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3" id="sobre">
        {[
          { icon: Library, title: 'Leitura livre', text: 'Visitantes acessam histórias publicadas sem conta e sem barreiras.' },
          { icon: Search, title: 'Biblioteca organizada', text: 'Busca, filtros e ordenação ajudam famílias a encontrar a próxima leitura.' },
          { icon: ShieldCheck, title: 'Admin protegido', text: 'Somente administradores cadastrados no Supabase gerenciam o conteúdo.' },
        ].map(({ icon: Icon, text, title }) => (
          <article className="rounded-[2rem] bg-white p-8 shadow-soft" key={title}>
            <Icon className="h-9 w-9 text-violet-700" />
            <h2 className="mt-5 text-2xl font-black text-ink">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function Shelf({ id, items, title }: { id?: string; items: Story[]; title: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12" id={id}>
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-ink">{title}</h2>
        <div className="hidden h-3 flex-1 rounded-full bg-[linear-gradient(90deg,#FFE8A3,#DCCBFF,#BDEFE7)] md:block" />
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
      <svg className="h-auto w-full drop-shadow-[0_30px_55px_rgba(67,56,120,.22)]" role="img" viewBox="0 0 720 520">
        <title>Estante de livros encantada</title>
        <path d="M71 438C58 304 91 150 229 93c109-45 250-20 334 59 83 78 105 210 43 291-67 87-217 75-324 67-84-6-200 31-211-72Z" fill="#FFF4D8" />
        <path d="M123 121h474c20 0 36 16 36 36v280H87V157c0-20 16-36 36-36Z" fill="#7C5CC4" opacity=".14" />
        <path d="M116 158h488v275H116z" fill="#fffdf7" stroke="#293241" strokeWidth="10" />
        <path d="M116 248h488M116 340h488" stroke="#293241" strokeWidth="10" />
        {[
          ['150', '183', '34', '65', '#BFE7FF'],
          ['192', '174', '32', '74', '#FFD6E8'],
          ['232', '190', '44', '58', '#FFE8A3'],
          ['292', '166', '36', '82', '#BDEFE7'],
          ['342', '180', '55', '68', '#DCCBFF'],
          ['423', '170', '35', '78', '#BFE7FF'],
          ['465', '186', '54', '62', '#FFE8A3'],
          ['154', '272', '50', '68', '#DCCBFF'],
          ['218', '263', '36', '77', '#BDEFE7'],
          ['266', '282', '58', '58', '#FFD6E8'],
          ['352', '262', '42', '78', '#BFE7FF'],
          ['411', '278', '62', '62', '#FFE8A3'],
          ['499', '258', '36', '82', '#BDEFE7'],
          ['150', '363', '44', '70', '#FFE8A3'],
          ['211', '356', '34', '77', '#BFE7FF'],
          ['260', '373', '70', '60', '#DCCBFF'],
          ['358', '360', '42', '73', '#FFD6E8'],
          ['420', '372', '70', '61', '#BDEFE7'],
          ['515', '356', '35', '77', '#DCCBFF'],
        ].map(([x, y, width, height, fill]) => (
          <g key={`${x}-${y}`}>
            <rect fill={fill} height={height} rx="8" width={width} x={x} y={y} />
            <path d={`M${Number(x) + 10} ${Number(y) + 12}h${Number(width) - 20}`} stroke="#293241" strokeLinecap="round" strokeWidth="4" opacity=".28" />
          </g>
        ))}
        <path d="M85 442h570" stroke="#293241" strokeLinecap="round" strokeWidth="14" />
        <path d="M268 84c12-24 30-36 54-36s42 12 54 36" fill="none" stroke="#293241" strokeLinecap="round" strokeWidth="10" />
        <circle cx="545" cy="100" fill="#FFE8A3" r="20" />
        <path d="M544 63v22M544 115v23M507 100h22M560 100h22" stroke="#D99000" strokeLinecap="round" strokeWidth="7" />
        <path d="M104 101c21-20 41-20 62 0M576 459c20-14 39-14 58 0" fill="none" stroke="#BDEFE7" strokeLinecap="round" strokeWidth="10" />
      </svg>
    </div>
  );
}
