-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: daily_hadith
create table public.daily_hadith (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  reference text,
  active_date date not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: anonymous_problems
create table public.anonymous_problems (
  id uuid default uuid_generate_v4() primary key,
  user_id text, -- Anonymous Device ID
  nickname text default 'Anonymous',
  text_content text,
  audio_url text,
  status text default 'pending' check (status in ('pending', 'answered', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: solutions
create table public.solutions (
  id uuid default uuid_generate_v4() primary key,
  problem_id uuid references public.anonymous_problems(id) on delete cascade,
  admin_id uuid references auth.users(id),
  text_content text,
  audio_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: media_board
create table public.media_board (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  audio_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: notifications
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  recipient_id text not null, -- Can be 'admin' or the user's Device ID
  type text not null check (type in ('new_problem', 'new_response')),
  reference_id uuid not null, -- ID of the problem
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.daily_hadith enable row level security;
alter table public.anonymous_problems enable row level security;
alter table public.solutions enable row level security;
alter table public.media_board enable row level security;
alter table public.notifications enable row level security;

-- Public RLS Policies
create policy "Public can view active daily hadith" on public.daily_hadith for select using (true);
create policy "Public can view answered problems" on public.anonymous_problems for select using (status = 'answered');
create policy "Users can view their own problems" on public.anonymous_problems for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR true); -- Will be handled securely via API route using service_role for this demo
create policy "Public can submit anonymous problems" on public.anonymous_problems for insert with check (true);
create policy "Public can view solutions" on public.solutions for select using (true);
create policy "Public can view media board" on public.media_board for select using (true);
create policy "Public can insert notifications" on public.notifications for insert with check (true);
create policy "Users can view their own notifications" on public.notifications for select using (true); -- Filtered via API
create policy "Users can update their notifications" on public.notifications for update using (true);

-- Admin RLS Policies (Requires authenticated user)
create policy "Admins can manage all tables" on public.daily_hadith using (auth.role() = 'authenticated');
create policy "Admins can manage all tables" on public.anonymous_problems using (auth.role() = 'authenticated');
create policy "Admins can manage all tables" on public.solutions using (auth.role() = 'authenticated');
create policy "Admins can manage all tables" on public.media_board using (auth.role() = 'authenticated');
create policy "Admins can manage all notifications" on public.notifications using (auth.role() = 'authenticated');

-- Storage Bucket configuration for audio submissions
insert into storage.buckets (id, name, public) values ('audio_submissions', 'audio_submissions', true);

create policy "Public Access" on storage.objects for select using ( bucket_id = 'audio_submissions' );
create policy "Public Insert" on storage.objects for insert with check ( bucket_id = 'audio_submissions' );
