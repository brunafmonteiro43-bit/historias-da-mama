import { BookOpen, Heart, Library, Send, Smile, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { MagicBookshelf } from '@/components/magic-bookshelf';
import { StoryCarousel } from '@/components/story-carousel';
import { SurpriseStoryButton } from '@/components/surprise-story-button';
import { getPublicCategories, getPublicStories } from '@/lib/public-data';

const shell = 'mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8';

export const dynamic = 'force-dynamic';

const benefitItems = [
  { icon: BookOpen, title: 'Histórias encantadoras', text: 'Narrativas selecionadas com muito carinho.', color: 'bg-lilac/20 text-plum' },
  { icon: Smile, title: 'Para todas as idades', text: 'Histórias para pequenos leitores e grandes sonhadores.', color: 'bg-sun/45 text-amber-700' },
  { icon: Heart, title: 'Valores que inspiram', text: 'Amizade, respeito, empatia e muito mais.', color: 'bg-rose/65 text-coral' },
  { icon: Sparkles, title: 'Leitura divertida', text: 'Ambiente lúdico, leve e feito para crianças.', color: 'bg-aqua/30 text-teal-700' },
];

export default async function Home() {
  const [categories, publishedStories] = await Promise.all([getPublicCategories(), getPublicStories()]);

  return (
    <main className="overflow-x-clip bg-[#fffaf2]">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#fff9ed_0%,#fff4fb_43%,#f0ecff_100%)] pb-20 pt-12 [contain:paint] md:pb-24 md:pt-16">
        <MagicalHeroBackdrop />

        <div className={`${shell} relative z-10 grid min-h-[580px] items-center gap-9 xl:grid-cols-[minmax(0,50fr)_minmax(390px,50fr)] xl:gap-12`}>
          <div className="max-w-[590px] pt-2">
            <p className="mb-5 inline-flex rounded-full bg-white/72 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-coral shadow-[0_12px_32px_rgba(59,36,107,.08)] ring-1 ring-white/80 backdrop-blur">
              Biblioteca infantil encantada
            </p>
            <h1 className="font-display text-4xl font-black leading-[1.02] tracking-[-0.01em] text-plum sm:text-5xl lg:text-[4.35rem]">
              Histórias que fazem sonhar, aprender e crescer.
            </h1>
            <p className="mt-6 max-w-[530px] text-base leading-8 text-slate-700 sm:text-lg">
              Embarque em aventuras incríveis com histórias cheias de imaginação, valores e encantamento.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-7 py-3.5 text-base font-black text-white shadow-[0_18px_42px_rgba(59,36,107,.24)] transition duration-300 hover:-translate-y-1 hover:bg-coral hover:shadow-[0_24px_52px_rgba(243,111,145,.28)]"
                href="/biblioteca"
              >
                <BookOpen className="h-5 w-5 transition group-hover:-rotate-6" />
                Explorar histórias
              </Link>
              <SurpriseStoryButton stories={publishedStories} />
            </div>
          </div>

          <MagicBookshelf stories={publishedStories} />
        </div>
      </section>

      <div className="relative z-10 bg-[linear-gradient(180deg,#fffaf2_0%,#fff6fb_45%,#f8fbff_100%)]">
        <section className={`${shell} relative pt-10`}>
          <div className="grid items-stretch gap-3 rounded-[1.65rem] border border-white/80 bg-white p-4 shadow-[0_24px_80px_rgba(59,36,107,.12)] md:grid-cols-2 md:p-5 lg:grid-cols-4">
            {benefitItems.map(({ color, icon: Icon, text, title }) => (
              <article className="flex h-full gap-4 rounded-[1.2rem] p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-cream/45" key={title}>
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-sm ${color}`}>
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

        <section className={`${shell} py-14`} id="historias">
        <div className="rounded-[1.75rem] border border-white/80 bg-white/92 p-5 shadow-[0_24px_85px_rgba(59,36,107,.10)] backdrop-blur sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Biblioteca ilustrada</p>
              <h2 className="mt-2 font-display text-3xl font-black text-plum md:text-4xl">Descubra novas aventuras</h2>
            </div>
            <Link className="inline-flex items-center gap-2 rounded-full bg-cream/75 px-4 py-2.5 text-sm font-black text-plum transition hover:-translate-y-0.5 hover:bg-rose/60 hover:text-coral" href="/biblioteca">
              Ver todas as histórias
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <StoryCarousel stories={publishedStories} />
        </div>
      </section>

        <section className={`${shell} pb-14`} id="categorias">
        <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Escolha pelo clima da leitura</p>
            <h2 className="mt-2 font-display text-3xl font-black text-plum">Categorias para cada momento</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                className="rounded-[1.2rem] bg-white/86 p-4 text-sm font-black text-plum shadow-[0_12px_32px_rgba(59,36,107,.06)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:text-coral hover:shadow-[0_18px_42px_rgba(59,36,107,.12)]"
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

        <section className={`${shell} pb-12`}>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_22px_70px_rgba(59,36,107,.10)] backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-5 md:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-rose/45 blur-3xl" aria-hidden="true" />
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
      </div>
    </main>
  );
}

function MagicalHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[4%] top-20 h-48 w-48 rounded-full bg-sun/24 blur-3xl" />
      <div className="absolute right-[14%] top-5 h-72 w-72 rounded-full bg-lilac/24 blur-3xl" />
      <div className="absolute bottom-2 right-[2%] h-64 w-96 rounded-full bg-rose/30 blur-3xl" />

      <div className="cloud-drift absolute left-[6%] top-[18%] h-10 w-28 rounded-full bg-white/50 shadow-[34px_8px_0_-8px_rgba(255,255,255,.48),-24px_10px_0_-10px_rgba(255,255,255,.42)]" />
      <div className="cloud-drift-slow absolute right-[18%] top-[16%] h-12 w-36 rounded-full bg-white/42 shadow-[42px_10px_0_-10px_rgba(255,255,255,.45),-28px_11px_0_-11px_rgba(255,255,255,.35)]" />
      <span className="twinkle absolute left-[48%] top-[18%] h-2 w-2 rounded-full bg-white" />
      <span className="twinkle-delay absolute left-[60%] top-[12%] h-2.5 w-2.5 rounded-full bg-sun" />
      <span className="twinkle absolute right-[8%] top-[31%] h-2 w-2 rounded-full bg-white" />
      <span className="magic-star absolute left-[39%] top-[37%] text-xl text-sun">✦</span>
      <span className="magic-star twinkle-delay absolute right-[24%] top-[27%] text-lg text-white">✦</span>
      <span className="butterfly-drift absolute right-[38%] top-[22%] h-8 w-9" aria-hidden="true">
        <span className="absolute left-0 top-1 h-5 w-4 rounded-full rounded-br-sm bg-coral/55" />
        <span className="absolute right-0 top-0 h-6 w-5 rounded-full rounded-bl-sm bg-rose/80" />
        <span className="absolute left-[16px] top-2 h-7 w-1 rounded-full bg-plum/45" />
      </span>
      <span className="leaf-float absolute bottom-[20%] left-[44%] h-4 w-8 rounded-[100%_0] bg-aqua/45 rotate-12" />
      <span className="leaf-float-delay absolute bottom-[15%] right-[12%] h-4 w-9 rounded-[100%_0] bg-[#a9d9bd]/55 -rotate-12" />
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
