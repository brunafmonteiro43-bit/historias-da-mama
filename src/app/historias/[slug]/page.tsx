import { Maximize, Moon, Printer, Share2, ZoomIn } from 'lucide-react';
import { notFound } from 'next/navigation';
import { stories } from '@/data/stories';

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = stories.find((item) => item.slug === params.slug);

  if (!story) {
    notFound();
  }

  return (
    <main>
      <section className="px-5 py-12" style={{ background: story.color }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-bold">
            {story.category} • {story.ageRange} • {story.readingTime}
          </p>
          <h1 className="mt-3 text-5xl font-black">{story.title}</h1>
          <p className="mt-4 max-w-3xl text-lg">{story.description}</p>
          <p className="mt-3 font-bold">Autor: {story.author}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              [Share2, 'Compartilhar'],
              [Printer, 'Imprimir'],
              [Maximize, 'Tela cheia'],
              [Moon, 'Modo escuro'],
              [ZoomIn, 'Zoom'],
            ].map(([Icon, label]) => (
              <button className="rounded-full bg-white px-4 py-3 font-bold shadow" key={String(label)} type="button">
                <Icon className="mr-2 inline h-4 w-4" />
                {String(label)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-4 flex justify-between font-bold">
          <span>Miniaturas</span>
          <span>Página 1 de {story.pages.length}</span>
        </div>
        <div className="reader-page rounded-[2rem] p-10 md:p-16">
          <h2 className="mb-8 text-center text-3xl font-black">{story.title}</h2>
          {story.pages.map((page, index) => (
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-9" key={page}>
              <span className="font-black text-lilac">{index + 1}. </span>
              {page}
            </p>
          ))}
          <div className="mt-10 flex justify-between">
            <button className="rounded-full bg-ink px-5 py-3 text-white" type="button">← Página anterior</button>
            <button className="rounded-full bg-ink px-5 py-3 text-white" type="button">Próxima página →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
