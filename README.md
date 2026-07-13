# Histórias da Mamá

Site infantil público com um painel secreto para cadastrar e publicar histórias sem alterar código, sem commit e sem novo deploy.

## Como funciona

- Visitantes acessam `/`, `/biblioteca`, `/historias/[slug]` e `/historias/[slug]/ler`.
- Administradoras acessam somente `/hm-admin`.
- O login usa Supabase Auth.
- As histórias, categorias e páginas ficam no PostgreSQL do Supabase.
- Capas, PDFs e imagens das páginas ficam no Supabase Storage.
- Ao publicar uma história no painel, ela aparece automaticamente na Home, Biblioteca, categoria e páginas públicas.

## Variáveis de ambiente

Crie `.env.local` com:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

Na Vercel, crie as mesmas variáveis em Project Settings > Environment Variables.

## Migrations do Supabase

1. Abra o projeto no Supabase.
2. Vá em SQL Editor.
3. Execute todo o arquivo:

```text
supabase/schema.sql
```

Esse arquivo cria/revisa:

- `stories`
- `story_pages`
- `categories`
- `admin_profiles`
- `authors`
- buckets `story-covers`, `story-pages`, `story-pdfs`
- função `is_admin()`
- políticas RLS para visitantes e administradoras

## Criar o primeiro admin

1. No Supabase, vá em Authentication > Users.
2. Clique em Add user.
3. Cadastre e-mail e senha da administradora.
4. Copie o `User UID`.
5. No SQL Editor, execute:

```sql
insert into public.admin_profiles (user_id, full_name)
values ('COLE_O_USER_UID_AQUI', 'Nome da Administradora');
```

Depois disso, a pessoa consegue entrar em `/hm-admin`.

## Testar cadastro e publicação

1. Acesse `/hm-admin`.
2. Faça login com o e-mail e senha criados no Supabase Auth.
3. Entre em `/hm-admin/dashboard`.
4. Clique em `Cadastrar nova história`.
5. Preencha:
   - título
   - descrição curta
   - descrição completa
   - autor
   - categoria
   - faixa etária
   - tempo de leitura
   - tema principal
   - capa
   - PDF
   - imagens das páginas
   - destaque
   - história da semana
   - versão para colorir
   - status
6. Escolha `Salvar rascunho` ou `Publicar`.
7. Clique em `Salvar / Publicar`.
8. Confira:
   - rascunho não aparece no site público
   - publicada aparece na Home
   - publicada aparece em `/biblioteca`
   - publicada abre em `/historias/[slug]`
   - leitor abre em `/historias/[slug]/ler`

## Ações disponíveis no painel

- salvar rascunho
- publicar
- editar
- despublicar
- excluir
- upload de capa
- upload de PDF
- upload de imagens das páginas
- preview de capa e páginas
- reordenar páginas por arrastar e soltar
- logout

## Permissões

Visitantes:

- leem apenas histórias publicadas
- leem páginas de histórias publicadas
- leem arquivos dos buckets públicos

Administradoras autorizadas:

- criam, editam, publicam, despublicam e excluem histórias
- criam categorias
- fazem upload e gestão dos arquivos nos buckets

## Comandos locais

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Se o Supabase não estiver configurado, o site público usa dados demo para não quebrar, e o painel mostra aviso para configurar as variáveis.
