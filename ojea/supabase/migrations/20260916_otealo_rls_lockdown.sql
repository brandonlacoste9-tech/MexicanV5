-- Otealo MexicoV5: lock public tables. Feed stays readable. Writes need a logged-in user.
-- Run in the Supabase SQL editor on project oqaswdsyqyecufdmwmxs AFTER the comment user_id deploy.

alter table if exists public.comments add column if not exists user_id uuid;
alter table if exists public.notifications add column if not exists actor_id uuid;
alter table if exists public.dms add column if not exists sender_id uuid;

alter table if exists public.clips enable row level security;
alter table if exists public.comments enable row level security;
alter table if exists public.likes enable row level security;
alter table if exists public.saves enable row level security;
alter table if exists public.follows enable row level security;
alter table if exists public.reports enable row level security;
alter table if exists public.notifications enable row level security;
alter table if exists public.dms enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.clip_submissions enable row level security;

drop policy if exists "otealo clips read" on public.clips;
drop policy if exists "otealo clips insert" on public.clips;
drop policy if exists "otealo clips update" on public.clips;
drop policy if exists "otealo clips delete" on public.clips;
create policy "otealo clips read" on public.clips for select using (true);
create policy "otealo clips insert" on public.clips for insert to authenticated
  with check (auth.uid() = author_id);
create policy "otealo clips update" on public.clips for update to authenticated
  using (auth.uid() = author_id);
create policy "otealo clips delete" on public.clips for delete to authenticated
  using (auth.uid() = author_id);

drop policy if exists "otealo comments read" on public.comments;
drop policy if exists "otealo comments insert" on public.comments;
drop policy if exists "otealo comments delete" on public.comments;
create policy "otealo comments read" on public.comments for select using (true);
create policy "otealo comments insert" on public.comments for insert to authenticated
  with check (auth.uid() = user_id);
create policy "otealo comments delete" on public.comments for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "otealo likes read" on public.likes;
drop policy if exists "otealo likes write" on public.likes;
drop policy if exists "otealo likes delete" on public.likes;
create policy "otealo likes read" on public.likes for select to authenticated
  using (auth.uid() = user_id);
create policy "otealo likes write" on public.likes for insert to authenticated
  with check (auth.uid() = user_id);
create policy "otealo likes delete" on public.likes for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "otealo saves read" on public.saves;
drop policy if exists "otealo saves write" on public.saves;
drop policy if exists "otealo saves delete" on public.saves;
create policy "otealo saves read" on public.saves for select to authenticated
  using (auth.uid() = user_id);
create policy "otealo saves write" on public.saves for insert to authenticated
  with check (auth.uid() = user_id);
create policy "otealo saves delete" on public.saves for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "otealo follows read" on public.follows;
drop policy if exists "otealo follows write" on public.follows;
drop policy if exists "otealo follows delete" on public.follows;
create policy "otealo follows read" on public.follows for select using (true);
create policy "otealo follows write" on public.follows for insert to authenticated
  with check (auth.uid() = follower_id);
create policy "otealo follows delete" on public.follows for delete to authenticated
  using (auth.uid() = follower_id);

drop policy if exists "otealo reports insert" on public.reports;
drop policy if exists "otealo reports read" on public.reports;
create policy "otealo reports insert" on public.reports for insert to authenticated
  with check (auth.uid() = reporter_id);
create policy "otealo reports read" on public.reports for select to authenticated
  using (auth.uid() = reporter_id);

drop policy if exists "otealo notes read" on public.notifications;
drop policy if exists "otealo notes insert" on public.notifications;
drop policy if exists "otealo notes update" on public.notifications;
create policy "otealo notes read" on public.notifications for select to authenticated
  using (recipient = (select username from public.profiles where id = auth.uid()));
create policy "otealo notes insert" on public.notifications for insert to authenticated
  with check (actor = (select username from public.profiles where id = auth.uid()));
create policy "otealo notes update" on public.notifications for update to authenticated
  using (recipient = (select username from public.profiles where id = auth.uid()));

drop policy if exists "otealo dms read" on public.dms;
drop policy if exists "otealo dms insert" on public.dms;
create policy "otealo dms read" on public.dms for select to authenticated
  using (
    sender_id = auth.uid()
    or recipient = (select username from public.profiles where id = auth.uid())
  );
create policy "otealo dms insert" on public.dms for insert to authenticated
  with check (sender_id = auth.uid());

drop policy if exists "otealo profiles read" on public.profiles;
drop policy if exists "otealo profiles write" on public.profiles;
drop policy if exists "otealo profiles update" on public.profiles;
create policy "otealo profiles read" on public.profiles for select using (true);
create policy "otealo profiles write" on public.profiles for insert to authenticated
  with check (auth.uid() = id);
create policy "otealo profiles update" on public.profiles for update to authenticated
  using (auth.uid() = id);

drop policy if exists "otealo ideas insert" on public.clip_submissions;
drop policy if exists "otealo ideas read" on public.clip_submissions;
create policy "otealo ideas insert" on public.clip_submissions for insert to authenticated
  with check (auth.uid() = user_id);
create policy "otealo ideas read" on public.clip_submissions for select to authenticated
  using (auth.uid() = user_id);

-- Storage: public watch, only you upload into your folder.
drop policy if exists "otealo storage read" on storage.objects;
drop policy if exists "otealo storage write" on storage.objects;
create policy "otealo storage read" on storage.objects for select
  using (bucket_id = 'clips');
create policy "otealo storage write" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'clips'
    and split_part(name, '/', 1) = auth.uid()::text
  );
