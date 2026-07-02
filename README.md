# Histórias da Mamá

Biblioteca digital infantil premium criada com Next.js, TypeScript, Tailwind CSS, Framer Motion, Supabase, React Hook Form, Zod, TanStack Query, Shadcn UI-ready e Lucide Icons.

## Regra principal de acesso

- Visitantes, crianças, pais, professores e leitores acessam todas as histórias publicadas livremente.
- Não existe login para leitores.
- Não existe perfil infantil, perfil de visitante, favoritos com conta ou comentários públicos.
- Somente o administrador entra com e-mail e senha em `/admin` para cadastrar, editar, excluir, publicar e despublicar histórias.

## Recursos

- Home comercial com hero, catálogo em prateleiras, categorias, destaques, recentes e mais lidas.
- Biblioteca estilo Netflix Kids com cards, busca e filtros.
- Página de história com leitor visual, botões de compartilhar, imprimir, tela cheia, modo escuro e zoom.
- Painel administrativo privado e visual para pessoa leiga publicar histórias sem editar código.
- Upload de capa, PDF, DOCX e imagens das páginas.
- Organização manual da ordem das páginas no painel.
- Campo para marcar se a história possui versão para colorir.
- PWA instalável, sitemap, robots, Open Graph e manifesto.
- Schema Supabase com autenticação de administrador, histórias, autores, categorias, páginas, storage e políticas RLS.
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

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Copie e execute todo o arquivo `supabase/schema.sql`.
4. Em Authentication, habilite login por e-mail e senha.
5. Confirme que o bucket `stories` foi criado em Storage.

## Como criar o primeiro usuário administrador

1. No Supabase, acesse Authentication > Users.
2. Clique em Add user.
3. Cadastre o e-mail e a senha da pessoa responsável pelo site.
4. Copie o `User UID` criado.
5. No SQL Editor, rode:

```sql
insert into public.admins (user_id, full_name)
values ('COLE_O_USER_UID_AQUI', 'Nome da Administradora');
```

Depois disso, esse usuário poderá acessar `/admin` com e-mail e senha.

## Como acessar o painel `/admin`

1. Abra o domínio do site.
2. Acesse `/admin` no navegador.
3. Informe e-mail e senha do administrador.
4. Clique em “Acessar painel”.
5. O painel mostra as áreas Dashboard, Histórias, Categorias, Autores e Configurações.

## Como cadastrar uma história nova

1. Acesse `/admin`.
2. No formulário “Cadastrar ou editar história”, preencha:
   - Título da história.
   - Descrição.
   - Autor.
   - Categoria.
   - Idade indicada.
   - Tempo de leitura.
3. Marque “Esta história tem versão para colorir” se existir material de colorir.
4. Envie a capa.
5. Envie o PDF/DOCX ou as imagens das páginas.
6. Organize a ordem das páginas usando os botões de subir e descer.
7. Clique em “Publicar”.

## Como subir capa

1. No campo “5. Capa”, clique para selecionar arquivo.
2. Use PNG, JPG ou WEBP.
3. Prefira imagens verticais, leves e com boa legibilidade do título.

## Como subir PDF ou imagens

- Para uma história em arquivo único, use o campo “6. PDF ou DOCX”.
- Para páginas já ilustradas separadamente, use “Imagens das páginas”.
- O bucket Supabase aceita PDF, DOCX, PNG, JPG e WEBP.
- Em produção, a conversão automática de DOCX e a geração de miniaturas de PDF devem rodar em função server-side.

## Como publicar, salvar rascunho e despublicar

- “Publicar” deixa a história visível para todos os visitantes.
- “Salvar rascunho” guarda a história sem aparecer na biblioteca pública.
- “Publicar / despublicar” alterna entre visível e oculto.

## Como editar uma história

1. Acesse `/admin`.
2. Na lista “Histórias existentes”, selecione a história.
3. Edite título, descrição, categoria, idade, capa, arquivos ou ordem das páginas.
4. Clique em “Publicar” ou “Salvar rascunho”.

## Como excluir uma história

1. Acesse `/admin`.
2. Selecione a história existente.
3. Clique em “Excluir”.
4. Confirme a exclusão antes de remover definitivamente os dados e arquivos.

## Trocar logo, cores e domínio

- Logo: edite `public/brand/logo.svg` e `src/components/logo.tsx`.
- Cores: edite `tailwind.config.ts` e tokens em `src/app/globals.css`.
- Domínio: configure `NEXT_PUBLIC_SITE_URL` e o domínio na hospedagem.

## Backup

- Exporte o banco via Supabase Dashboard ou CLI.
- Faça download do bucket `stories` periodicamente.
- Versione `supabase/schema.sql` a cada alteração estrutural.

## Publicação

Recomendado: Vercel para Next.js e Supabase para banco, storage e autenticação. Configure variáveis de ambiente, rode `npm run build` e publique a branch principal.
