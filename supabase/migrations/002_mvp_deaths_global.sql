-- Mortes passam a ser globais: todos os usuários autenticados veem e atualizam os mesmos registros.
-- Se você já rodou 001 e quer manter dados, migre manualmente antes de rodar este script.

drop policy if exists "Users can read own mvp_deaths" on public.mvp_deaths;
drop policy if exists "Users can insert own mvp_deaths" on public.mvp_deaths;
drop policy if exists "Users can update own mvp_deaths" on public.mvp_deaths;
drop policy if exists "Users can delete own mvp_deaths" on public.mvp_deaths;
drop index if exists public.mvp_deaths_user_id_idx;

drop table if exists public.mvp_deaths;

create table public.mvp_deaths (
  id uuid primary key default gen_random_uuid(),
  mvp_id text not null unique,
  death_time timestamptz not null,
  map_position jsonb
);

alter table public.mvp_deaths enable row level security;

-- Qualquer usuário autenticado pode ler todos os registros
create policy "Authenticated can read all mvp_deaths"
  on public.mvp_deaths for select
  using (auth.uid() is not null);

-- Qualquer usuário autenticado pode inserir
create policy "Authenticated can insert mvp_deaths"
  on public.mvp_deaths for insert
  with check (auth.uid() is not null);

-- Qualquer usuário autenticado pode atualizar
create policy "Authenticated can update mvp_deaths"
  on public.mvp_deaths for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Qualquer usuário autenticado pode deletar
create policy "Authenticated can delete mvp_deaths"
  on public.mvp_deaths for delete
  using (auth.uid() is not null);

create index mvp_deaths_mvp_id_idx on public.mvp_deaths(mvp_id);
