-- Execute este arquivo no SQL Editor de um novo projeto Supabase.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Conteúdo público pode ser lido"
on public.site_content for select
to anon, authenticated
using (true);

create policy "Usuários autenticados podem editar"
on public.site_content for update
to authenticated
using (true)
with check (true);

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Imagens do site são públicas"
on storage.objects for select
to public
using (bucket_id = 'site-media');

create policy "Usuários autenticados enviam imagens"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media');

create policy "Usuários autenticados atualizam imagens"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

create policy "Usuários autenticados excluem imagens"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media');

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null default '',
  project_type text not null check (char_length(project_type) between 2 and 80),
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

create policy "Visitantes podem enviar pedidos"
on public.contact_requests for insert
to anon, authenticated
with check (status = 'new');

create policy "Usuários autenticados podem ler pedidos"
on public.contact_requests for select
to authenticated
using (true);

create policy "Usuários autenticados podem atualizar pedidos"
on public.contact_requests for update
to authenticated
using (true)
with check (true);

create policy "Usuários autenticados podem excluir pedidos"
on public.contact_requests for delete
to authenticated
using (true);
