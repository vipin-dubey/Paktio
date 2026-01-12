-- Enable pgcrypto for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Organizations (Tenants)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE, -- e.g., 'no', 'se', 'enterprise'
  plan_type TEXT DEFAULT 'free', -- 'free', 'subscription', 'enterprise'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles (User Metadata)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id),
  full_name TEXT,
  phone_number TEXT,
  locale TEXT DEFAULT 'en',
  is_mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contracts (Source of Truth)
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id),
  created_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content_json JSONB NOT NULL, -- The Block-based JSON
  current_hash TEXT, -- SHA-256 of content_json
  status TEXT DEFAULT 'draft', -- 'draft', 'pending', 'signed'
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Signatures
CREATE TABLE public.signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  version_signed INTEGER NOT NULL -- Must match contract version
);

-- THE INTEGRITY TRIGGER
CREATE OR REPLACE FUNCTION public.handle_contract_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new hash
  NEW.current_hash := encode(digest(NEW.content_json::text, 'sha256'), 'hex');

  -- If content has changed and signatures exist
  IF (OLD.current_hash IS DISTINCT FROM NEW.current_hash) THEN
    -- 1. Void all existing signatures
    DELETE FROM public.signatures WHERE contract_id = NEW.id;
    -- 2. Reset status to draft
    NEW.status := 'draft';
    -- 3. Increment version
    NEW.version := OLD.version + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invalidate_signatures
BEFORE UPDATE ON public.contracts
FOR EACH ROW
WHEN (OLD.content_json IS DISTINCT FROM NEW.content_json)
EXECUTE FUNCTION public.handle_contract_change();

-- RLS POLICIES

-- Profiles: Users can view and edit their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Contracts: Users can view/edit contracts in their organization
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view org contracts" ON public.contracts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id
  )
);
CREATE POLICY "Users can insert org contracts" ON public.contracts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id
  )
);
CREATE POLICY "Users can update org contracts" ON public.contracts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.org_id = contracts.org_id
  )
);
