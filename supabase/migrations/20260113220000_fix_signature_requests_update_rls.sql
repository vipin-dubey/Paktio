
-- Fix missing UPDATE policy for signature_requests to allow upsert
CREATE POLICY "Authenticated users can update signature requests"
ON public.signature_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
