-- Add additional signer information fields to signatures table
ALTER TABLE public.signatures 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS ssn TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_signatures_first_name ON public.signatures(first_name);
CREATE INDEX IF NOT EXISTS idx_signatures_last_name ON public.signatures(last_name);
