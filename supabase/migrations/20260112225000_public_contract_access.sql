-- Allow public (unauthenticated) users to view contracts that are pending or signed
-- This is necessary for external signers to view contracts they need to sign

CREATE POLICY "Public can view pending/signed contracts"
ON public.contracts
FOR SELECT
TO anon, authenticated
USING (status IN ('pending', 'signed'));

-- Allow anyone to insert signatures (they'll be authenticated via OTP in the app)
CREATE POLICY "Anyone can insert signatures"
ON public.signatures
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view signatures for audit purposes
CREATE POLICY "Anyone can view signatures"
ON public.signatures
FOR SELECT
TO anon, authenticated
USING (true);
