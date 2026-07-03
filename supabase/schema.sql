-- Histórias da Mamá: somente administradores autenticados gerenciam conteúdo.
-- Visitantes não têm conta, perfil, favoritos ou comentários públicos.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz default now()
);

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  author_id uuid references public.authors(id),
  category_id uuid references public.categories(id),
  age_range text not null,
  reading_time_minutes integer not null default 5,
  has_coloring_version boolean not null default false,
  cover_url text,
  pdf_url text,
  docx_source_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

create table public.story_pages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  page_number integer not null,
  image_url text,
  content text,
  unique (story_id, page_number)
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;

create policy "Admins can read admin records" on public.admins for select using (public.is_admin());
create policy "Admins can manage admin records" on public.admins for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read authors" on public.authors for select using (true);
create policy "Admins can manage authors" on public.authors for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read categories" on public.categories for select using (true);
create policy "Admins can manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Visitors can read published stories" on public.stories for select using (status = 'published');
create policy "Admins can manage all stories" on public.stories for all using (public.is_admin()) with check (public.is_admin());
create policy "Visitors can read pages from published stories" on public.story_pages for select using (
  exists (select 1 from public.stories where stories.id = story_pages.story_id and stories.status = 'published')
);
create policy "Admins can manage story pages" on public.story_pages for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'stories',
  'stories',
  true,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
)
on conflict (id) do nothing;

create policy "Public can read story files" on storage.objects
for select using (bucket_id = 'stories');

create policy "Admins can upload story files" on storage.objects
for insert with check (bucket_id = 'stories' and public.is_admin());

create policy "Admins can update story files" on storage.objects
for update using (bucket_id = 'stories' and public.is_admin()) with check (bucket_id = 'stories' and public.is_admin());

create policy "Admins can delete story files" on storage.objects
for delete using (bucket_id = 'stories' and public.is_admin());

insert into public.categories (name, slug, description)
values
  ('Aventura', 'aventura', 'Viagens, descobertas e coragem.'),
  ('Fantasia', 'fantasia', 'Magia, castelos e mundos encantados.'),
  ('Amizade', 'amizade', 'Empatia, respeito e convivência.'),
  ('Natureza', 'natureza', 'Flores, jardins e cuidado com o planeta.'),
  ('Inclusão', 'inclusao', 'Aceitação, autonomia e diversidade.')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.authors (name, bio)
values ('Histórias da Mamá', 'Autoria principal da biblioteca Histórias da Mamá.')
on conflict do nothing;
