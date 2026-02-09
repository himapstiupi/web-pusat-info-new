-- Add related_links column to articles table to store optional links
-- Structure: JSONB array of objects [{ label: string, url: string }]
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS related_links JSONB DEFAULT '[]'::JSONB;

-- Comment on column
COMMENT ON COLUMN public.articles.related_links IS 'Array of optional links [{label, url}] for the article';
