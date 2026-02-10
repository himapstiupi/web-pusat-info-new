-- Add likes and dislikes columns to articles table if they don't exist
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;

-- Comment on columns
COMMENT ON COLUMN public.articles.likes IS 'Total number of likes (thumbs up)';
COMMENT ON COLUMN public.articles.dislikes IS 'Total number of dislikes (thumbs down)';
