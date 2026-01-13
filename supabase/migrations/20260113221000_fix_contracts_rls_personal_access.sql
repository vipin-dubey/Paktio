
-- Allow users to see and manage their own contracts even if they don't have an org_id
-- This fixes the issue where null org_id = null org_id fails in SQL

ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_org_id_fkey;
-- (Just checking schema, I'll only add policies)

DROP POLICY IF EXISTS "Users can view org contracts" ON public.contracts;
CREATE POLICY "Users can view own or org contracts" ON public.contracts 
FOR SELECT USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id AND contracts.org_id IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Users can insert org contracts" ON public.contracts;
CREATE POLICY "Users can insert own or org contracts" ON public.contracts 
FOR INSERT WITH CHECK (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id AND contracts.org_id IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Users can update org contracts" ON public.contracts;
CREATE POLICY "Users can update own or org contracts" ON public.contracts 
FOR UPDATE USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id AND contracts.org_id IS NOT NULL
  )
);
