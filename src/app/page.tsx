import { BookOpen, Heart, Library, Send, Smile, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { StoryCarousel } from '@/components/story-carousel';
import { categories, publishedStories } from '@/data/stories';

const shell = 'mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8';

const benefitItems = [
  { icon: BookOpen, title: 'Histórias encantadoras', text: 'Narrativas selecionadas com muito carinho.', color: 'bg-lilac/20 text-plum' },
  { icon: Smile, title: 'Para todas as idades', text: 'Histórias para pequenos leitores e grandes sonhadores.', color: 'bg-sun/45 text-amber-700' },
  { icon: Heart, title: 'Valores que inspiram', text: 'Amizade, respeito, empatia e muito mais.', color: 'bg-rose/65 text-coral' },
  { icon: Sparkles, title: 'Leitura divertida', text: 'Ambiente lúdico, leve e feito para crianças.', color: 'bg-aqua/30 text-teal-700' },
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_24%,rgba(183,155,239,.22),transparent_30%),radial-gradient(circle_at_92%_78%,rgba(255,231,163,.36),transparent_26%),linear-gradient(125deg,#fffaf0_0%,#fff5f9_50%,#f2ecff_100%)] pb-20 pt-12 md:pb-24 md:pt-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="absolute right-[18%] top-16 h-14 w-24 rounded-full bg-white/45 blur-sm" />
          <span className="absolute left-[48%] top-24 h-3 w-3 rounded-full bg-sun" />
          <span className="absolute right-[8%] top-28 h-4 w-4 rounded-full bg-sun/80" />
          <span className="absolute left-[33%] top-48 h-2 w-2 rounded-full bg-coral/70" />
        </div>

        <div className={`${shell} relative z-10 grid items-center gap-10 md:grid-cols-[.92fr_1.08fr] lg:gap-12`}>
          <div className="max-w-[560px]">
            <h1 className="font-display text-4xl font-black leading-[1.06] text-plum sm:text-5xl lg:text-[3.65rem]">
              Histórias que fazem sonhar, aprender e crescer.
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-8 text-slate-700 sm:text-lg">
              Embarque em aventuras incríveis com histórias cheias de imaginação, valores e encantamento.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-7 py-3.5 text-base font-black text-white shadow-[0_16px_34px_rgba(59,36,107,.22)] transition hover:-translate-y-1 hover:bg-coral"
                href="/biblioteca"
              >
                <BookOpen className="h-5 w-5" />
                Explorar histórias
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-coral/30 bg-white/82 px-7 py-3.5 text-base font-black text-plum shadow-sm transition hover:-translate-y-1 hover:border-coral hover:text-coral"
                href={`/historias/${publishedStories[0]?.slug ?? ''}`}
              >
                <Sparkles className="h-5 w-5 text-coral" />
                Surpreenda-me
              </Link>
            </div>
          </div>

          <HeroStorybookScene />
        </div>
      </section>

      <section className={`${shell} relative z-20 -mt-10`}>
        <div className="grid items-stretch gap-4 rounded-[1.35rem] border border-lilac/15 bg-white/95 p-4 shadow-[0_22px_70px_rgba(59,36,107,.12)] backdrop-blur md:grid-cols-2 md:p-5 lg:grid-cols-4">
          {benefitItems.map(({ color, icon: Icon, text, title }) => (
            <article className="flex h-full gap-4 rounded-2xl p-3" key={title}>
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-black text-plum">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${shell} py-12`} id="historias">
        <div className="rounded-[1.35rem] border border-lilac/15 bg-white/94 p-5 shadow-[0_22px_70px_rgba(59,36,107,.11)] sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-black text-plum md:text-4xl">Descubra novas aventuras</h2>
            <Link className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-black text-plum transition hover:text-coral" href="/biblioteca">
              Ver todas as histórias
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <StoryCarousel stories={publishedStories} />
        </div>
      </section>

      <section className={`${shell} pb-12`} id="categorias">
        <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Escolha pelo clima da leitura</p>
            <h2 className="mt-2 font-display text-3xl font-black text-plum">Categorias para cada momento</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                className="rounded-2xl bg-white/88 p-4 text-sm font-black text-plum shadow-sm ring-1 ring-lilac/15 transition hover:-translate-y-1 hover:text-coral"
                href="/biblioteca"
                key={category.slug}
              >
                <span className="mb-3 block h-2 rounded-full" style={{ background: category.color }} />
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shell} pb-10`}>
        <div className="flex flex-col gap-5 rounded-[1.35rem] border border-lilac/12 bg-white/90 p-6 shadow-[0_18px_55px_rgba(59,36,107,.09)] sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-skyPastel/55 text-plum shadow-sm">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-plum">Tem uma história para compartilhar?</h2>
              <p className="mt-1 max-w-2xl leading-7 text-slate-600">
                Ajude nossa biblioteca a crescer! Envie sua história e inspire mais crianças.
              </p>
            </div>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-lilac/45 bg-white px-6 py-3.5 font-black text-plum shadow-sm transition hover:-translate-y-1 hover:border-coral hover:text-coral sm:shrink-0"
            href="/enviar-historia"
          >
            <Send className="h-5 w-5" />
            Enviar história
          </Link>
        </div>
      </section>

      <section className={`${shell} pb-10`} id="sobre">
        <div className="rounded-[1.35rem] bg-white/75 p-6 text-center shadow-sm ring-1 ring-lilac/10 md:p-8">
          <Library className="mx-auto h-8 w-8 text-coral" />
          <h2 className="mt-3 font-display text-3xl font-black text-plum">Feita para pequenas grandes imaginações</h2>
          <p className="mx-auto mt-3 max-w-3xl leading-7 text-slate-600">
            O Histórias da Mamá reúne aventuras infantis com carinho, fantasia e aprendizados para transformar a leitura em um momento gostoso do dia.
          </p>
        </div>
      </section>

      <DecorativeStorylandFooter />
    </main>
  );
}

function HeroStorybookScene() {
  return (
    <div className="mx-auto w-full max-w-[560px] md:justify-self-end">
      <div className="relative rounded-[2rem] border border-white/65 bg-white/32 p-4 shadow-[0_26px_70px_rgba(59,36,107,.16)] backdrop-blur-sm sm:p-5">
        <span className="absolute left-8 top-7 h-3 w-3 rounded-full bg-sun" />
        <span className="absolute right-10 top-9 h-4 w-4 rounded-full bg-sun/80" />
        <span className="absolute right-24 top-10 h-10 w-16 rounded-full border-4 border-white/70" />
        <svg className="h-auto w-full" viewBox="0 0 620 390" role="img" aria-label="Livro aberto com castelo, árvore, flores e nuvens">
          <defs>
            <linearGradient id="pageLeft" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#fffaf0" />
              <stop offset="1" stopColor="#ffe3bf" />
            </linearGradient>
            <linearGradient id="pageRight" x1="1" x2="0" y1="0" y2="1">
              <stop stopColor="#fffaf0" />
              <stop offset="1" stopColor="#ffd9c7" />
            </linearGradient>
            <linearGradient id="castle" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#ff9ab8" />
              <stop offset="1" stopColor="#f36f91" />
            </linearGradient>
          </defs>

          <ellipse cx="314" cy="333" rx="244" ry="34" fill="#d9c28b" opacity=".22" />
          <path d="M55 298c64-63 110-40 159-67 73-40 126-36 177 11 52 47 123 15 174 59v44H55Z" fill="#b8d889" />
          <path d="M78 318c67-27 111-6 169-25 70-23 118-18 174 8 45 22 80 8 128 21v33H78Z" fill="#8fd8cf" opacity=".5" />

          <g transform="translate(124 57) scale(.9)">
            <rect x="38" y="92" width="130" height="146" rx="15" fill="url(#castle)" />
            <rect x="77" y="148" width="45" height="90" rx="20" fill="#6a3a76" opacity=".85" />
            <rect x="15" y="128" width="52" height="110" rx="9" fill="#ffb0c6" />
            <rect x="139" y="128" width="52" height="110" rx="9" fill="#ffb0c6" />
            <path d="M14 128 42 64l27 64Z" fill="#7c4cb0" />
            <path d="m139 128 27-64 27 64Z" fill="#7c4cb0" />
            <path d="m58 92 45-86 45 86Z" fill="#8d58bf" />
            <rect x="93" y="32" width="15" height="50" fill="#8d58bf" />
            <path d="M108 33c22-15 34 7 55-5-14 20-33 18-55 7Z" fill="#f36f91" />
            <circle cx="103" cy="120" r="15" fill="#ffe7a3" />
          </g>

          <g transform="translate(427 82) scale(.85)">
            <path d="M65 218V116" stroke="#7b5438" strokeLinecap="round" strokeWidth="23" />
            <path d="M70 142c31-17 42-44 28-70 31 1 52 26 49 56 24 10 33 42 15 62 18 27-4 61-38 55-19 28-58 24-70-7-34 7-60-17-54-48-25-18-20-57 9-68-5-29 22-56 61-48-6 25-3 47 0 68Z" fill="#82be70" />
            <path d="M100 104c17 9 29 24 35 45M47 171c27-4 50-16 69-35" stroke="#6aa95f" strokeLinecap="round" strokeWidth="7" opacity=".7" />
          </g>

          <g transform="translate(147 175)">
            <path d="M153 31C91 8 38 18 1 61v104c47-44 96-50 152-24Z" fill="url(#pageLeft)" />
            <path d="M153 31c63-26 125-25 187 6v106c-63-26-125-27-187-1Z" fill="url(#pageRight)" />
            <path d="M153 31v111" stroke="#d18d7a" strokeWidth="5" opacity=".45" />
            <path d="M1 61c47 9 95 20 152 81 63-52 125-50 187 1" fill="none" stroke="#6d3f98" strokeLinecap="round" strokeWidth="15" />
            <path d="M22 82c36-15 68-13 103 4M32 108c33-10 59-9 88 4M209 76c36-9 70-4 105 13M202 104c40-7 72-1 101 11" stroke="#efb99d" strokeLinecap="round" strokeWidth="4" opacity=".82" />
            <path d="M166 153c12 20 29 19 42 0l-5 59-20-16-19 16Z" fill="#f36f91" />
            <ellipse cx="153" cy="165" rx="21" ry="14" fill="#5d347f" />
          </g>

          <g fill="#f36f91">
            <circle cx="96" cy="272" r="8" />
            <circle cx="83" cy="263" r="7" />
            <circle cx="84" cy="280" r="7" />
            <circle cx="107" cy="262" r="7" />
            <circle cx="108" cy="280" r="7" />
            <circle cx="96" cy="272" r="4" fill="#ffe7a3" />
          </g>
          <g fill="#ffe7a3">
            <circle cx="544" cy="275" r="7" />
            <circle cx="532" cy="267" r="6" />
            <circle cx="533" cy="282" r="6" />
            <circle cx="556" cy="267" r="6" />
            <circle cx="557" cy="282" r="6" />
            <circle cx="544" cy="275" r="4" fill="#f36f91" />
          </g>
          <path d="M90 303c-7-24 12-36 24-48M540 305c3-20 17-30 29-42" stroke="#5d9b7f" strokeLinecap="round" strokeWidth="5" />
        </svg>
      </div>
    </div>
  );
}

function DecorativeStorylandFooter() {
  return (
    <section className="relative mt-2 h-32 overflow-hidden bg-[linear-gradient(180deg,transparent_0%,rgba(238,247,255,.65)_100%)]" aria-hidden="true">
      <svg className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0 130c135-55 236 5 360-28 122-33 184 12 290 10 93-1 133-61 228-54 88 6 109 65 220 50 122-17 189-72 342-26v98H0Z" fill="#cfe8d0" />
        <path d="M0 155c148-28 247-4 392-24 151-21 225 29 357 13 94-11 133-42 233-24 164 30 255-12 458-1v61H0Z" fill="#a9d9bd" />
      </svg>
      <svg className="absolute bottom-5 left-8 h-20 w-20 md:left-14" viewBox="0 0 120 120">
        <rect x="38" y="52" width="50" height="50" rx="8" fill="#ffd6e8" />
        <path d="m32 54 31-39 32 39Z" fill="#f36f91" />
        <rect x="57" y="76" width="15" height="26" rx="7" fill="#6a3a76" />
        <rect x="18" y="72" width="25" height="31" rx="5" fill="#ffe7a3" />
        <path d="m15 73 15-23 16 23Z" fill="#b79bef" />
      </svg>
      <svg className="absolute bottom-6 right-8 h-20 w-28 md:right-16" viewBox="0 0 160 110">
        <path d="M37 102V64" stroke="#fff8ea" strokeLinecap="round" strokeWidth="16" />
        <path d="M18 66c4-33 39-50 63-17 8 11 5 17-8 17Z" fill="#f36f91" />
        <circle cx="42" cy="47" r="5" fill="#fff8ea" />
        <path d="M103 102V58" stroke="#fff8ea" strokeLinecap="round" strokeWidth="18" />
        <path d="M81 60c8-38 51-47 66-5 3 9-3 14-14 13Z" fill="#ff9ab8" />
        <circle cx="113" cy="44" r="6" fill="#fff8ea" />
      </svg>
    </section>
  );
}
