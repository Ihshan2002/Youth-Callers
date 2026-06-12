-- ============================================================
-- Youth Callers - RLS Policy Fix Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Add user_id column if it doesn't exist yet
alter table public.anonymous_problems add column if not exists user_id text;

-- 1b. Add reply metadata needed for two-way scholar responses
alter table public.solutions add column if not exists scholar_name text default 'Youth Callers Scholar';
alter table public.solutions add column if not exists audio_url text;
alter table public.solutions add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- 2. Create notifications table if it doesn't exist yet
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  recipient_id text not null,
  type text not null check (type in ('new_problem', 'new_response')),
  reference_id uuid not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.notifications enable row level security;

-- 3. Drop conflicting/broken policies
drop policy if exists "Admins can manage all tables" on public.anonymous_problems;
drop policy if exists "Admins can manage all tables" on public.solutions;
drop policy if exists "Admins can manage all tables" on public.media_board;
drop policy if exists "Admins can manage all tables" on public.daily_hadith;
drop policy if exists "Admins can manage all notifications" on public.notifications;
drop policy if exists "Users can view their own problems" on public.anonymous_problems;
drop policy if exists "Public can view answered problems" on public.anonymous_problems;

-- 4. Fix anonymous_problems policies
-- Allow viewing all problems (filtering by user_id is done server-side in API routes)
create policy "Anyone can view all problems" on public.anonymous_problems
  for select using (true);

-- Allow inserts from server-side API (using anon key)
drop policy if exists "Public can submit anonymous problems" on public.anonymous_problems;
create policy "Public can submit anonymous problems" on public.anonymous_problems
  for insert with check (true);

-- Allow status updates (admin marking as answered)
create policy "Server can update problem status" on public.anonymous_problems
  for update using (true) with check (true);

-- 5. Fix solutions policies
drop policy if exists "Public can view solutions" on public.solutions;
create policy "Anyone can view solutions" on public.solutions
  for select using (true);

-- Allow scholars to insert solutions via API
create policy "Server can insert solutions" on public.solutions
  for insert with check (true);

create policy "Server can update solutions" on public.solutions
  for update using (true) with check (true);

create policy "Server can delete solutions" on public.solutions
  for delete using (true);

-- 6. Fix notifications policies
drop policy if exists "Public can insert notifications" on public.notifications;
drop policy if exists "Users can view their own notifications" on public.notifications;
drop policy if exists "Users can update their notifications" on public.notifications;

create policy "Anyone can insert notifications" on public.notifications
  for insert with check (true);

create policy "Anyone can view notifications" on public.notifications
  for select using (true);

create policy "Anyone can update notifications" on public.notifications
  for update using (true);

-- 7. Fix media_board policies
drop policy if exists "Public can view media board" on public.media_board;
create policy "Public can view media board" on public.media_board
  for select using (true);

-- 8. Ensure storage bucket exists (ignore error if already exists)
insert into storage.buckets (id, name, public)
  values ('audio_submissions', 'audio_submissions', true)
  on conflict (id) do nothing;

-- 9. Fix storage policies
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Insert" on storage.objects;

create policy "Public Access Audio" on storage.objects
  for select using (bucket_id = 'audio_submissions');

create policy "Public Insert Audio" on storage.objects
  for insert with check (bucket_id = 'audio_submissions');

-- Done!
-- You should now be able to:
-- 1. Submit problems (user -> DB)
-- 2. View all problems in admin dashboard (DB -> admin)
-- 3. Submit scholar responses (admin -> DB)
-- 4. View responses in My Problems page (DB -> user)
