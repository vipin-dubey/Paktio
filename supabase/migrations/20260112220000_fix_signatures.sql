-- Enable pgcrypto extension for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add updated_at column to contracts if it doesn't exist
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add trigger to calculate hash on INSERT
CREATE OR REPLACE FUNCTION public.handle_contract_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate hash for new contracts
  NEW.current_hash := encode(digest(convert_to(NEW.content_json::text, 'UTF8'), 'sha256'), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_hash_on_insert ON public.contracts;
CREATE TRIGGER trigger_calculate_hash_on_insert
BEFORE INSERT ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.handle_contract_insert();

-- Remove duplicate signatures (keep only the earliest one per email per contract)
DELETE FROM public.signatures
WHERE id NOT IN (
  SELECT DISTINCT ON (contract_id, signer_email) id
  FROM public.signatures
  ORDER BY contract_id, signer_email, signed_at ASC
);

-- Add unique constraint to prevent duplicate signatures
-- (one signature per email per contract)
ALTER TABLE public.signatures 
DROP CONSTRAINT IF EXISTS unique_signature_per_contract;

ALTER TABLE public.signatures 
ADD CONSTRAINT unique_signature_per_contract 
UNIQUE (contract_id, signer_email);

