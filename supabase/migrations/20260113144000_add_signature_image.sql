-- Add signature_image to signatures table
ALTER TABLE public.signatures 
ADD COLUMN IF NOT EXISTS signature_image TEXT;

COMMENT ON COLUMN public.signatures.signature_image IS 'Base64 encoded PNG image of the handwritten signature';
