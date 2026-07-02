'use client';

import { ImagePlus, Layers3, Save, Trash2, UploadCloud } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { categories, stories } from '@/data/stories';

const storySchema = z.object({
  title: z.string().min(3, 'Informe o título da história.'),
  description: z.string().min(10, 'Escreva uma descrição simples.'),
  author: z.string().min(2, 'Informe o autor.'),
  category: z.string().min(1, 'Escolha uma categoria.'),
  ageRange: z.string().min(1, 'Informe a idade indicada.'),
  readingTime: z.string().min(1, 'Informe o tempo de leitura.'),
  hasColoringVersion: z.boolean().default(false),
  pages: z.array(z.object({ label: z.string() })).default([]),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function AdminStoryForm() {
  const form = useForm<StoryFormValues>({
    defaultValues: {
      title: '',
      description: '',
      author: 'Histórias da Mamá',
      category: categories[0]?.name ?? '',
      ageRange: '4 a 6 anos',
      readingTime: '5 min',
      hasColoringVersion: false,
      pages: [{ label: 'Página 1' }, { label: 'Página 2' }],
    },
  });

  const { fields, move, append, remove } = useFieldArray({ control: form.control, name: 'pages' });

  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
      <form className="grid gap-5 rounded-[2rem] bg-white p-6 shadow-soft md:p-8" onSubmit={form.handleSubmit(() => undefined)}>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-500">Formulário simples</p>
          <h2 className="mt-2 text-3xl font-black">Cadastrar ou editar história</h2>
          <p className="mt-2 text-slate-600">Preencha os campos principais, envie a capa e publique quando estiver pronto.</p>
        </div>

        <label className="grid gap-2 font-bold">
          1. Título da história
          <input className="rounded-2xl border p-3" placeholder="Ex.: O Pintinho Corajoso" {...form.register('title')} />
        </label>

        <label className="grid gap-2 font-bold">
          2. Descrição
          <textarea className="min-h-28 rounded-2xl border p-3" placeholder="Resumo curto para famílias e professores" {...form.register('description')} />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 font-bold">
            Autor
            <input className="rounded-2xl border p-3" {...form.register('author')} />
          </label>
          <label className="grid gap-2 font-bold">
            3. Categoria
            <select className="rounded-2xl border p-3" {...form.register('category')}>
              {categories.map((category) => (
                <option key={category.name}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 font-bold">
            4. Idade indicada
            <select className="rounded-2xl border p-3" {...form.register('ageRange')}>
              <option>2 a 4 anos</option>
              <option>4 a 6 anos</option>
              <option>6 a 8 anos</option>
              <option>8 a 10 anos</option>
              <option>10+ anos</option>
            </select>
          </label>
          <label className="grid gap-2 font-bold">
            Tempo de leitura
            <input className="rounded-2xl border p-3" placeholder="5 min" {...form.register('readingTime')} />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-aqua/40 p-4 font-bold">
          <input type="checkbox" className="h-5 w-5" {...form.register('hasColoringVersion')} />
          Esta história tem versão para colorir
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="rounded-3xl border-2 border-dashed p-6 font-bold">
            <ImagePlus className="mb-3 h-7 w-7" />
            5. Capa
            <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-3 block text-sm" />
          </label>
          <label className="rounded-3xl border-2 border-dashed p-6 font-bold">
            <UploadCloud className="mb-3 h-7 w-7" />
            6. PDF ou DOCX
            <input type="file" accept=".pdf,.docx" className="mt-3 block text-sm" />
          </label>
          <label className="rounded-3xl border-2 border-dashed p-6 font-bold">
            <Layers3 className="mb-3 h-7 w-7" />
            Imagens das páginas
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="mt-3 block text-sm" />
          </label>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-black">Organizar ordem das páginas</h3>
            <button type="button" className="rounded-full bg-white px-4 py-2 font-bold" onClick={() => append({ label: `Página ${fields.length + 1}` })}>
              Adicionar página
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            {fields.map((field, index) => (
              <div className="flex items-center justify-between rounded-2xl bg-white p-3" key={field.id}>
                <span className="font-bold">{field.label}</span>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full bg-slate-100 px-3 py-1" onClick={() => index > 0 && move(index, index - 1)}>↑</button>
                  <button type="button" className="rounded-full bg-slate-100 px-3 py-1" onClick={() => index < fields.length - 1 && move(index, index + 1)}>↓</button>
                  <button type="button" className="rounded-full bg-rose px-3 py-1" onClick={() => remove(index)}>Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-ink px-6 py-3 font-bold text-white" type="submit">7. Publicar</button>
          <button className="rounded-full bg-sun px-6 py-3 font-bold" type="button"><Save className="mr-2 inline h-4 w-4" />Salvar rascunho</button>
          <button className="rounded-full bg-aqua px-6 py-3 font-bold" type="button">Publicar / despublicar</button>
          <button className="rounded-full bg-rose px-6 py-3 font-bold" type="button"><Trash2 className="mr-2 inline h-4 w-4" />Excluir</button>
        </div>
      </form>

      <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black">Histórias existentes</h2>
        <p className="mt-2 text-sm text-slate-600">Selecione uma história para editar, publicar, despublicar ou excluir.</p>
        <div className="mt-5 grid gap-3">
          {stories.map((story) => (
            <button className="rounded-2xl border p-4 text-left hover:bg-slate-50" key={story.slug} type="button">
              <strong>{story.title}</strong>
              <span className="mt-1 block text-sm text-slate-500">{story.status === 'published' ? 'Publicado' : 'Rascunho'} • {story.category}</span>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
