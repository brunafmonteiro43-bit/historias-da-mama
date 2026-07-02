# Histórias da Mamá

Biblioteca digital infantil premium criada com Next.js, TypeScript, Tailwind CSS, Framer Motion, Supabase, React Hook Form, Zod, TanStack Query, Shadcn UI-ready e Lucide Icons.

## Recursos

- Home comercial com hero, catálogo em prateleiras, categorias, destaques, recentes e mais lidas.
- Biblioteca estilo Netflix Kids com cards, busca e filtros.
- Página de história com leitor visual, botões de favoritar, compartilhar, imprimir, tela cheia, modo escuro e zoom.
- Painel administrativo visual para publicar histórias sem editar código.
- PWA instalável, sitemap, robots, Open Graph e manifesto.
- Schema Supabase com autenticação, favoritos, comentários moderados, autores, categorias, storage e políticas RLS.
- Estrutura preparada para audiolivros, IA, vídeos, atividades, área do professor, downloads e estatísticas.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Ative login por e-mail em Authentication.
4. Use o bucket `stories` para capas, PDFs, DOCX e páginas ilustradas.

## Como cadastrar histórias

Acesse `/admin`, preencha título, descrição, autor, categoria, faixa etária e tempo de leitura. Envie capa e PDF, DOCX ou imagens. Em produção, conecte o formulário aos serviços Supabase e a uma função server-side para converter DOCX e gerar miniaturas de PDF.

## Trocar logo, cores e domínio

- Logo: edite `public/brand/logo.svg` e `src/components/logo.tsx`.
- Cores: edite `tailwind.config.ts` e tokens em `src/app/globals.css`.
- Domínio: configure `NEXT_PUBLIC_SITE_URL` e o domínio na hospedagem.

## Backup

- Exporte o banco via Supabase Dashboard ou CLI.
- Faça download do bucket `stories` periodicamente.
- Versione `supabase/schema.sql` a cada alteração estrutural.

## Publicação

Recomendado: Vercel para Next.js e Supabase para banco/storage/auth. Configure variáveis de ambiente, rode `npm run build` e publique a branch principal.
