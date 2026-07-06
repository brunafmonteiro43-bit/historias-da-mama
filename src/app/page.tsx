import { Baby, BookOpen, ChevronLeft, ChevronRight, Cloud, Flower2, Heart, Search, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { BrandIllustration } from '@/components/brand-illustration';
import { StoryCard } from '@/components/story-card';
import { featured } from '@/data/stories';

const benefits = [
  { icon: BookOpen, title: 'Histórias encantadoras', text: 'Narrativas selecionadas com muito carinho.' },
  { icon: Baby, title: 'Para todas as idades', text: 'Para pequenos leitores e grandes sonhadores.' },
  { icon: Heart, title: 'Valores que inspiram', text: 'Amizade, respeito, empatia e muito mais.' },
  { icon: Sparkles, title: 'Leitura divertida', text: 'Ambiente leve, lúdico e feito para crianças.' },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FFF8EA_0%,#F2ECFF_48%,#FFF0F5_100%)] px-5 py-16 md:py-20">
        <Cloud className="cloud-drift absolute right-20 top-16 h-20 w-20 text-white/70" />
        <Cloud className="cloud-drift-slow absolute left-1/2 top-28 h-14 w-14 text-white/60" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[.85fr_1.15fr]">
          <div className="relative z-10">
            <h1 className="font-display text-5xl font-black leading-[1.02] text-plum md:text-7xl">Histórias que fazem sonhar, aprender e crescer.</h1>
            <p className="mt-6 max-w-xl text-xl leading-9 text-slate-700">Embarque em aventuras cheias de imaginação, valores e encantamento.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link className="inline-flex items-center gap-2 rounded-[1.35rem] bg-plum px-7 py-4 font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-coral" href="/biblioteca">
                <BookOpen className="h-5 w-5" />Explorar histórias
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-[1.35rem] bg-white px-7 py-4 font-black text-plum shadow-soft ring-1 ring-coral/25 transition hover:-translate-y-1" href={`/historias/${featured[0]?.slug ?? ''}`}>
                <Sparkles className="h-5 w-5 text-coral" />Surpreenda-me
              </Link>
            </div>
          </div>
          <div className="relative z-10">
            <Sparkles className="brand-twinkle absolute left-10 top-8 h-8 w-8 text-sun" />
            <Flower2 className="brand-twinkle-delay absolute bottom-16 left-8 h-10 w-10 text-coral" />
            <Wand2 className="brand-butterfly absolute right-16 top-10 h-12 w-12 text-coral" />
            <BrandIllustration className="brand-float h-auto w-full drop-shadow-[0_30px_55px_rgba(59,36,107,.22)]" title="Livro aberto com castelo, árvore, borboleta, estrelas, nuvens e flores" />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-7xl px-5">
        <div className="grid gap-4 rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-lilac/20 md:grid-cols-4">
          {benefits.map(({ icon: Icon, text, title }) => (
            <article className="flex gap-4 rounded-3xl p-4" key={title}>
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lilac/35 text-plum"><Icon className="h-7 w-7" /></div>
              <div><h3 className="font-black text-plum">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12" id="destaques">
        <div className="rounded-[2rem] bg-white/88 p-6 shadow-soft ring-1 ring-lilac/20">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-black text-plum">Descubra novas aventuras</h2>
            <Link className="font-black text-plum hover:text-coral" href="/biblioteca">Ver todas as histórias</Link>
          </div>
          <div className="relative">
            <button className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 text-plum shadow-soft md:block" type="button" aria-label="anterior"><ChevronLeft /></button>
            <div className="flex gap-6 overflow-x-auto pb-4">{featured.concat(featured).slice(0, 6).map((story, i) => <StoryCard key={`${story.slug}-${i}`} story={story} />)}</div>
            <button className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 text-plum shadow-soft md:block" type="button" aria-label="próximo"><ChevronRight /></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6" id="sobre">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[2rem] bg-white/82 p-8 shadow-soft ring-1 ring-lilac/20">
          <div className="flex items-center gap-5"><div className="grid h-16 w-16 place-items-center rounded-full bg-skyPastel/55 text-plum"><Search /></div><div><h2 className="text-2xl font-black text-plum">Tem uma história para compartilhar?</h2><p className="mt-1 text-slate-600">Ajude nossa biblioteca a crescer! Envie sua história e inspire mais crianças.</p></div></div>
          <Link className="rounded-full border border-lilac/40 bg-white px-6 py-3 font-black text-plum shadow-sm hover:bg-lilac/20" href="/enviar-historia">Enviar história</Link>
        </div>
      </section>
    </main>
  );
}
