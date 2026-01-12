-- Add email_verified field to signatures table
ALTER TABLE public.signatures 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_signatures_email_verified 
ON public.signatures(email_verified);
