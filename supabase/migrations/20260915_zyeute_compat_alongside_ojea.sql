-- Additive Zyeute compatibility on MexicoV5.
-- Does NOT drop or rewrite live Ojea tables (clips, comments, profiles, likes, saves, follows, dms).

alter table public.profiles
  add column if not exists city text,
  add column if not exists region text default 'MX',
  add column if not exists hive_id text default 'mexico';

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username varchar(50) not null unique,
  email varchar(255),
  display_name varchar(100),
  bio text,
  avatar_url text,
  region text default 'MX',
  role text default 'ciudadano',
  is_admin boolean default false,
  is_premium boolean default false,
  plan text default 'free',
  credits integer default 0,
  city text,
  region_id text,
  hive_id text default 'mexico',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  ojea_clip_id text unique,
  user_id uuid references public.user_profiles (id) on delete set null,
  type text default 'video',
  media_url text,
  thumbnail_url text,
  content text not null default '',
  caption text,
  visibility text default 'public',
  reactions_count integer default 0,
  comments_count integer default 0,
  city text,
  region text default 'MX',
  region_id text,
  hive_id text default 'mexico',
  hashtags text[] default '{}',
  created_at timestamptz default now() not null
);

create index if not exists publications_created_at_idx on public.publications (created_at desc);
create index if not exists publications_hive_idx on public.publications (hive_id, created_at desc);
create index if not exists user_profiles_hive_idx on public.user_profiles (hive_id);

insert into public.user_profiles (id, username, display_name, city, region, hive_id, created_at, updated_at)
select p.id, p.username, p.display_name, p.city, coalesce(p.region, 'MX'), coalesce(p.hive_id, 'mexico'), p.created_at, p.created_at
from public.profiles p
on conflict (id) do update set
  username = excluded.username,
  display_name = excluded.display_name,
  city = excluded.city,
  hive_id = excluded.hive_id,
  updated_at = now();

insert into public.publications (
  ojea_clip_id, user_id, type, media_url, thumbnail_url, content, caption,
  reactions_count, city, region, hive_id, hashtags, created_at
)
select
  c.id,
  c.author_id,
  'video',
  coalesce(c.video, c.image),
  c.image,
  coalesce(c.caption, ''),
  c.caption,
  coalesce(c.likes_count, 0),
  c.city,
  'MX',
  'mexico',
  coalesce(c.tags, '{}'),
  c.created_at
from public.clips c
on conflict (ojea_clip_id) do update set
  media_url = excluded.media_url,
  thumbnail_url = excluded.thumbnail_url,
  content = excluded.content,
  caption = excluded.caption,
  reactions_count = excluded.reactions_count,
  city = excluded.city,
  hashtags = excluded.hashtags;

alter table public.user_profiles enable row level security;
alter table public.publications enable row level security;

drop policy if exists "public read user_profiles" on public.user_profiles;
create policy "public read user_profiles" on public.user_profiles for select using (true);
drop policy if exists "own user_profiles insert" on public.user_profiles;
create policy "own user_profiles insert" on public.user_profiles for insert with check (auth.uid() = id);
drop policy if exists "own user_profiles update" on public.user_profiles;
create policy "own user_profiles update" on public.user_profiles for update using (auth.uid() = id);

drop policy if exists "public read publications" on public.publications;
create policy "public read publications" on public.publications for select using (true);
drop policy if exists "auth insert publications" on public.publications;
create policy "auth insert publications" on public.publications for insert with check (auth.uid() = user_id);
drop policy if exists "own update publications" on public.publications;
create policy "own update publications" on public.publications for update using (auth.uid() = user_id);

create or replace function public.sync_profile_to_user_profiles()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.user_profiles (id, username, display_name, city, region, hive_id, created_at, updated_at)
  values (new.id, new.username, new.display_name, new.city, coalesce(new.region, 'MX'), coalesce(new.hive_id, 'mexico'), new.created_at, now())
  on conflict (id) do update set
    username = excluded.username,
    display_name = excluded.display_name,
    city = excluded.city,
    region = excluded.region,
    hive_id = excluded.hive_id,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_sync_profile_to_user_profiles on public.profiles;
create trigger trg_sync_profile_to_user_profiles
after insert or update on public.profiles
for each row execute function public.sync_profile_to_user_profiles();

create or replace function public.sync_clip_to_publication()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.publications (
    ojea_clip_id, user_id, type, media_url, thumbnail_url, content, caption,
    reactions_count, city, region, hive_id, hashtags, created_at
  ) values (
    new.id, new.author_id, 'video', coalesce(new.video, new.image), new.image,
    coalesce(new.caption, ''), new.caption, coalesce(new.likes_count, 0),
    new.city, 'MX', 'mexico', coalesce(new.tags, '{}'), new.created_at
  )
  on conflict (ojea_clip_id) do update set
    media_url = excluded.media_url,
    thumbnail_url = excluded.thumbnail_url,
    content = excluded.content,
    caption = excluded.caption,
    reactions_count = excluded.reactions_count,
    city = excluded.city,
    hashtags = excluded.hashtags;
  return new;
end;
$$;

drop trigger if exists trg_sync_clip_to_publication on public.clips;
create trigger trg_sync_clip_to_publication
after insert or update on public.clips
for each row execute function public.sync_clip_to_publication();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.profiles (id, username, display_name, hive_id, region)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)),
    'mexico',
    'MX'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
