-- Youth Callers Web Platform - Supabase SQL Schema
-- Copy and paste this directly into your Supabase SQL Editor

-- 1. Create submissions table
CREATE TABLE public.anonymous_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alias_token TEXT NOT NULL DEFAULT 'User-' || substr(md5(random()::text), 1, 6),
    text_content TEXT,
    audio_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'answered')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create solutions table
CREATE TABLE public.public_solutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES public.anonymous_submissions(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.anonymous_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_solutions ENABLE ROW LEVEL SECURITY;

-- 4. Set Policies
-- Submissions: Guests can ONLY insert. They cannot read submissions to maintain privacy.
CREATE POLICY "Allow guest inserts on submissions" ON public.anonymous_submissions
    FOR INSERT TO public WITH CHECK (true);

-- Solutions: Guests can ONLY read. Admins handle writing via Supabase dashboard/API.
CREATE POLICY "Allow guest reads on solutions" ON public.public_solutions
    FOR SELECT TO public USING (true);

-- 5. Create Storage Bucket for Voice Notes
-- Note: You can also create this manually via the Storage dashboard
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-notes', 'voice-notes', true) ON CONFLICT DO NOTHING;

-- Allow public uploads to voice-notes bucket
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'voice-notes');
