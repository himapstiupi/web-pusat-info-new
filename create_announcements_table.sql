-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('running_text', 'popup')),
    content TEXT NOT NULL,
    button_label TEXT,
    button_link TEXT,
    show_on_pages TEXT[] DEFAULT ARRAY['*']::TEXT[],
    exclude_pages TEXT[] DEFAULT ARRAY['/admin*', '/superadmin*']::TEXT[],
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active announcements
CREATE POLICY "Allow public read access to active announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

-- Allow admins to read all
CREATE POLICY "Allow authenticated read all" ON public.announcements
    FOR SELECT TO authenticated USING (true);

-- Allow admins to insert
CREATE POLICY "Allow authenticated insert" ON public.announcements
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow admins to update
CREATE POLICY "Allow authenticated update" ON public.announcements
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow admins to delete
CREATE POLICY "Allow authenticated delete" ON public.announcements
    FOR DELETE TO authenticated USING (true);
