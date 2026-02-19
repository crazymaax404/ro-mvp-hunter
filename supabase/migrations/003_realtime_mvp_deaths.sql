-- Enable Realtime for mvp_deaths so clients can subscribe to INSERT/UPDATE/DELETE.
-- Run this after 002_mvp_deaths_global.sql (table must exist).

alter publication supabase_realtime add table public.mvp_deaths;
