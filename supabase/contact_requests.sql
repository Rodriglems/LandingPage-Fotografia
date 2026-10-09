-- Execute este arquivo uma vez no SQL Editor do projeto Supabase já existente.

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

drop policy if exists "Visitantes podem enviar pedidos" on public.contact_requests;
create policy "Visitantes podem enviar pedidos"
on public.contact_requests for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Usuários autenticados podem ler pedidos" on public.contact_requests;
create policy "Usuários autenticados podem ler pedidos"
on public.contact_requests for select
to authenticated
using (true);

drop policy if exists "Usuários autenticados podem atualizar pedidos" on public.contact_requests;
create policy "Usuários autenticados podem atualizar pedidos"
on public.contact_requests for update
to authenticated
using (true)
with check (true);

drop policy if exists "Usuários autenticados podem excluir pedidos" on public.contact_requests;
create policy "Usuários autenticados podem excluir pedidos"
on public.contact_requests for delete
to authenticated
using (true);
