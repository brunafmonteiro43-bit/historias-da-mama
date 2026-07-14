-- Histórias da Mamá CMS
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

-- Compatibilidade com versões antigas do projeto.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  color text not null default '#BFEAF5',
  accent_color text not null default '#3B246B',
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  full_description text,
  author_id uuid references public.authors(id),
  category_id uuid references public.categories(id),
  age_range text not null,
  reading_time_minutes integer not null default 5,
  theme text not null default 'imaginação',
  has_coloring_version boolean not null default false,
  is_featured boolean not null default false,
  is_story_of_week boolean not null default false,
  cover_url text,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  read_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.stories add column if not exists full_description text;
alter table public.stories add column if not exists theme text not null default 'imaginação';
alter table public.stories add column if not exists is_featured boolean not null default false;
alter table public.stories add column if not exists is_story_of_week boolean not null default false;
alter table public.stories add column if not exists read_count integer not null default 0;
alter table public.categories add column if not exists color text not null default '#BFEAF5';
alter table public.categories add column if not exists accent_color text not null default '#3B246B';

create table if not exists public.story_pages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  page_number integer not null,
  image_url text,
  content text,
  unique (story_id, page_number)
);

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  email text not null,
  title text not null,
  category text not null,
  story_text text,
  submission_type text not null default 'text' check (submission_type in ('text', 'pdf')),
  pdf_storage_path text,
  pdf_file_name text,
  pdf_file_size integer,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  created_story_id uuid references public.stories(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.story_submissions add column if not exists submission_type text not null default 'text';
alter table public.story_submissions add column if not exists pdf_storage_path text;
alter table public.story_submissions add column if not exists pdf_file_name text;
alter table public.story_submissions add column if not exists pdf_file_size integer;
alter table public.story_submissions alter column story_text drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'story_submissions_submission_type_check'
  ) then
    alter table public.story_submissions
      add constraint story_submissions_submission_type_check
      check (submission_type in ('text', 'pdf'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'story_submissions_content_check'
  ) then
    alter table public.story_submissions
      add constraint story_submissions_content_check
      check (
        (submission_type = 'text' and story_text is not null and char_length(trim(story_text)) >= 80 and pdf_storage_path is null)
        or
        (submission_type = 'pdf' and story_text is null and pdf_storage_path is not null and pdf_file_size between 1 and 10485760)
      );
  end if;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_profiles where user_id = auth.uid())
    or exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.admins enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;
alter table public.story_submissions enable row level security;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
drop policy if exists "Admins can read admin records" on public.admins;
drop policy if exists "Admins can manage admin records" on public.admins;
drop policy if exists "Public can read authors" on public.authors;
drop policy if exists "Admins can manage authors" on public.authors;
drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Visitors can read published stories" on public.stories;
drop policy if exists "Admins can manage all stories" on public.stories;
drop policy if exists "Visitors can read pages from published stories" on public.story_pages;
drop policy if exists "Admins can manage story pages" on public.story_pages;
drop policy if exists "Visitors can submit stories" on public.story_submissions;
drop policy if exists "Admins can manage story submissions" on public.story_submissions;

create policy "Admins can read admin profiles" on public.admin_profiles for select using (public.is_admin());
create policy "Admins can manage admin profiles" on public.admin_profiles for all using (public.is_admin()) with check (public.is_admin());
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

create policy "Visitors can submit stories" on public.story_submissions
for insert with check (
  status = 'pending_review'
  and reviewed_at is null
  and created_story_id is null
  and char_length(trim(author_name)) >= 2
  and position('@' in email) > 1
  and char_length(trim(title)) >= 3
  and char_length(trim(category)) >= 2
  and (
    (submission_type = 'text' and story_text is not null and char_length(trim(story_text)) >= 80 and pdf_storage_path is null)
    or
    (submission_type = 'pdf' and story_text is null and pdf_storage_path is not null and pdf_file_size between 1 and 10485760)
  )
);

create policy "Admins can manage story submissions" on public.story_submissions
for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('story-covers', 'story-covers', true, 8388608, array['image/png', 'image/jpeg', 'image/webp']),
  ('story-pages', 'story-pages', true, 8388608, array['image/png', 'image/jpeg', 'image/webp']),
  ('story-pdfs', 'story-pdfs', true, 52428800, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('story-submissions', 'story-submissions', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read story files" on storage.objects;
drop policy if exists "Admins can upload story files" on storage.objects;
drop policy if exists "Admins can update story files" on storage.objects;
drop policy if exists "Admins can delete story files" on storage.objects;
drop policy if exists "Visitors can upload submitted PDFs" on storage.objects;
drop policy if exists "Admins can read submitted PDFs" on storage.objects;
drop policy if exists "Admins can delete submitted PDFs" on storage.objects;

create policy "Public can read story files" on storage.objects
for select using (bucket_id in ('story-covers', 'story-pages', 'story-pdfs'));

create policy "Admins can upload story files" on storage.objects
for insert with check (bucket_id in ('story-covers', 'story-pages', 'story-pdfs') and public.is_admin());

create policy "Admins can update story files" on storage.objects
for update using (bucket_id in ('story-covers', 'story-pages', 'story-pdfs') and public.is_admin())
with check (bucket_id in ('story-covers', 'story-pages', 'story-pdfs') and public.is_admin());

create policy "Admins can delete story files" on storage.objects
for delete using (bucket_id in ('story-covers', 'story-pages', 'story-pdfs') and public.is_admin());

create policy "Visitors can upload submitted PDFs" on storage.objects
for insert with check (bucket_id = 'story-submissions');

create policy "Admins can read submitted PDFs" on storage.objects
for select using (bucket_id = 'story-submissions' and public.is_admin());

create policy "Admins can delete submitted PDFs" on storage.objects
for delete using (bucket_id = 'story-submissions' and public.is_admin());

insert into public.categories (name, slug, description, color, accent_color)
values
  ('Aventura', 'aventura', 'Viagens, descobertas e coragem.', '#BFEAF5', '#3B246B'),
  ('Fantasia', 'fantasia', 'Magia, castelos e mundos encantados.', '#B79BEF', '#3B246B'),
  ('Amizade', 'amizade', 'Empatia, respeito e convivência.', '#FFE7A3', '#8A5A00'),
  ('Natureza', 'natureza', 'Flores, jardins e cuidado com o planeta.', '#8FD8CF', '#235E58'),
  ('Inclusão', 'inclusao', 'Aceitação, autonomia e diversidade.', '#F9C4D2', '#F36F91')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  accent_color = excluded.accent_color;

insert into public.authors (name, bio)
values ('Histórias da Mamá', 'Autoria principal da biblioteca Histórias da Mamá.')
on conflict (name) do nothing;
