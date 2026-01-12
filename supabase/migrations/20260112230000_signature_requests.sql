-- Create signature_requests table to track intended signers
CREATE TABLE IF NOT EXISTS public.signature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    signer_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(contract_id, signer_email)
);

-- Add RLS policies
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view signature requests"
ON public.signature_requests
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can insert signature requests"
ON public.signature_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_signature_requests_contract_email 
ON public.signature_requests(contract_id, signer_email);
