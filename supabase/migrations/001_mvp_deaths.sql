-- Run this in Supabase Dashboard → SQL Editor after creating your project.
-- Creates table mvp_deaths and RLS so each user only sees their own records.

create table public.mvp_deaths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mvp_id text not null,
  death_time timestamptz not null,
  map_position jsonb,
  unique(user_id, mvp_id)
);

alter table public.mvp_deaths enable row level security;

create policy "Users can read own mvp_deaths"
  on public.mvp_deaths for select
  using (auth.uid() = user_id);

create policy "Users can insert own mvp_deaths"
  on public.mvp_deaths for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mvp_deaths"
  on public.mvp_deaths for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own mvp_deaths"
  on public.mvp_deaths for delete
  using (auth.uid() = user_id);

create index mvp_deaths_user_id_idx on public.mvp_deaths(user_id);
