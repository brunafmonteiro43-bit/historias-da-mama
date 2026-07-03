# Histórias da Mamá

Biblioteca infantil pública com leitura livre para visitantes e painel administrativo privado protegido por Supabase Auth.

## Acesso correto

- Visitantes acessam a home, `/biblioteca` e histórias publicadas sem login.
- Não existe conta de leitor, perfil público, favoritos ou comentários.
- Somente administradores acessam `/admin` com e-mail e senha.
- `/admin` mostra apenas a tela de login quando não há sessão válida.
- Após login válido e autorização na tabela `admins`, o usuário é enviado para `/admin/dashboard`.
- Rotas como `/admin/dashboard`, `/admin/stories`, `/admin/stories/new`, `/admin/stories/[id]/edit` e `/admin/categories` são protegidas por middleware e verificação server-side.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variáveis obrigatórias:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute todo o arquivo `supabase/schema.sql`.
4. Em Authentication, habilite login por e-mail e senha.
5. Em Storage, confirme que o bucket público `stories` existe.
6. Confirme que as políticas RLS foram criadas para `stories`, `story_pages`, `categories`, `authors`, `admins` e `storage.objects`.

## Criar o primeiro administrador

1. No Supabase, acesse Authentication > Users.
2. Clique em Add user.
3. Cadastre o e-mail e a senha da pessoa administradora.
4. Copie o `User UID`.
5. No SQL Editor, execute:

```sql
insert into public.admins (user_id, full_name)
values ('COLE_O_USER_UID_AQUI', 'Nome da Administradora');
```

Depois disso, esse usuário poderá entrar em `/admin`.

## Usar o painel

1. Acesse `/admin`.
2. Informe e-mail e senha do administrador.
3. O sistema valida a sessão no Supabase Auth.
4. O sistema chama `is_admin()` para confirmar autorização.
5. Após sucesso, abre `/admin/dashboard`.

O painel inclui:

- Dashboard com total de histórias, publicadas, rascunhos e categorias.
- Lista de histórias em `/admin/stories`.
- Cadastro em `/admin/stories/new`.
- Edição em `/admin/stories/[id]/edit`.
- Categorias em `/admin/categories`.
- Logout real com `supabase.auth.signOut()`.

## Cadastrar uma história

1. Entre no painel.
2. Clique em “Cadastrar nova história”.
3. Preencha as etapas:
   - Informações básicas.
   - Capa e arquivos.
   - Páginas da história.
   - Publicação.
4. Envie capa em PNG, JPG ou WEBP.
5. Envie PDF opcional da história.
6. Adicione textos e/ou imagens das páginas.
7. Salve como rascunho ou publique.

## Publicar e despublicar

Em `/admin/stories`, use a ação “Publicar” para tornar uma história visível na biblioteca pública. Use “Despublicar” para voltar a rascunho. Visitantes só conseguem visualizar registros com `status = 'published'`.

## Storage

O bucket `stories` aceita:

- PDF até 50 MB.
- PNG, JPG e WEBP até 8 MB por imagem.

As políticas de storage permitem leitura pública dos arquivos e escrita apenas para administradores autenticados.

## Proteção de rotas

A proteção acontece em duas camadas:

- `middleware.ts` bloqueia acesso direto às rotas administrativas privadas.
- `requireAdmin()` valida a sessão no servidor antes de renderizar dashboard, histórias, edição e categorias.

As permissões do banco também protegem os dados:

- Administradores podem criar, editar, publicar, despublicar e excluir histórias.
- Visitantes só podem ler histórias publicadas e páginas ligadas a histórias publicadas.

## Leitor público

A página de história tem visual de livro aberto, miniaturas, botões de página anterior/próxima, zoom, tela cheia e link de volta para a biblioteca.
