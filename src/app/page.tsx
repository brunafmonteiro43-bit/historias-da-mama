import { BookOpen, Heart, Library, Send, Smile, Sparkles, UploadCloud } from 'lucide-react';
import Image from 'next/image';
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
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#fffaf0_0%,#fff5fa_46%,#f1ecff_100%)] pb-20 pt-14 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[8%] top-16 h-40 w-40 rounded-full bg-sun/25 blur-3xl" />
          <div className="absolute right-[13%] top-10 h-72 w-72 rounded-full bg-lilac/25 blur-3xl" />
          <div className="absolute bottom-0 right-[4%] h-64 w-80 rounded-full bg-rose/30 blur-3xl" />
        </div>

        <div className={`${shell} relative z-10 grid items-center gap-10 md:grid-cols-[minmax(0,52fr)_minmax(390px,48fr)] lg:gap-12`}>
          <div className="max-w-[600px]">
            <p className="mb-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-coral shadow-sm ring-1 ring-white/70">
              Biblioteca infantil encantada
            </p>
            <h1 className="font-display text-4xl font-black leading-[1.04] text-plum sm:text-5xl lg:text-[4rem]">
              Histórias que fazem sonhar, aprender e crescer.
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-8 text-slate-700 sm:text-lg">
              Embarque em aventuras incríveis com histórias cheias de imaginação, valores e encantamento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-7 py-3.5 text-base font-black text-white shadow-[0_18px_36px_rgba(59,36,107,.22)] transition hover:-translate-y-1 hover:bg-coral"
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

          <HeroStorybookImage />
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

function HeroStorybookImage() {
  return (
    <div className="relative mx-auto w-full max-w-[590px] md:justify-self-end">
      <div className="absolute inset-x-8 bottom-5 top-10 rounded-[45%] bg-[radial-gradient(circle_at_50%_52%,rgba(255,231,163,.34),rgba(249,196,210,.22)_42%,rgba(183,155,239,.18)_70%,transparent_100%)]" aria-hidden="true" />
      <Image
        alt="Livro aberto com castelo, árvore, flores e borboleta"
        className="relative h-auto w-full object-contain drop-shadow-[0_26px_38px_rgba(59,36,107,.16)]"
        height={2100}
        priority
        quality={100}
        sizes="(min-width: 768px) 45vw, 92vw"
        src="/brand/hero-storybook.svg"
        width={3600}
      />
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
