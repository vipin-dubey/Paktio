This is the final, ready-to-code Product Requirements Document (PRD). It has been refined to include the Paktio brand, the updated subdomain strategy, real-time collaboration details, and the hard-coded Postgres integrity triggers.Product Requirements Document (PRD): PaktioVersion: 1.2Date: January 12, 2026Status: Approved for DevelopmentTarget: Antigravity Engineering Team1. Executive SummaryPaktio is a high-end, AI-native contract platform designed for the Scandinavian and EEA markets. It transitions from static PDF signing to dynamic, real-time collaborative agreements. Using Gemini 1.5 Pro for block-based generation and a strict "Integrity Rule," it ensures legal compliance under eIDAS Advanced Electronic Signature (AdES) standards without requiring a physical QES token.2. Infrastructure & Multi-Tenancy ArchitectureThe system utilizes a "Single-Engine, Multi-Shell" architecture via Vercel Edge Middleware to isolate regional legal contexts while maintaining a shared database backend.2.1 Subdomain StrategyHostnameRolepaktio.comGlobal Brand, Marketing, and Enterprise redirects.no.paktio.comNorway: Norwegian UI, Avtaleloven legal defaults.se.paktio.comSweden: Swedish UI, Avtalslagen legal defaults.dk.paktio.comDenmark: Danish UI, Danish contract law defaults.app.paktio.comUnified SaaS Engine: Central dashboard for all drafting and signing.3. Core Technical Features3.1 Gemini 1.5 Pro "Legal Architect"The platform converts natural language prompts into structured JSON "Blocks."Contextual Injection: System instructions automatically append regional laws based on the subdomain (e.g., "Apply Norwegian tenancy law").Structured Output: The API is configured with a responseSchema to ensure every contract follows a valid Block Schema.3.2 Real-time Collaboration (CRDT)Live Sync: Powered by Yjs (CRDT) for conflict-free character-level syncing.Presence: Supabase Realtime broadcasts cursors, active users, and document "Locked" states.History: Git-like version tracking for all AI-generated or human edits.3.3 The Signature "Integrity Rule"To ensure compliance under eIDAS (AdES), Paktio enforces absolute document immutability during the signing phase.Hashing: When a signature is requested, the system takes a SHA-256 hash of the block content.Invalidation Trigger: If a user modifies any block while signatures are present, a Postgres trigger voids all signatures and reverts the document to Draft.4. Technical Specification: SQL SchemaThis schema is designed for Supabase to hard-code the "Integrity Rule" via Postgres triggers.SQL-- Enable pgcrypto for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Organizations (Tenants)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE, -- e.g., 'no', 'se', 'enterprise'
  plan_type TEXT DEFAULT 'free', -- 'free', 'subscription', 'enterprise'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contracts (Source of Truth)
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id),
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
5. Gemini 1.5 Pro: System InstructionProvide this to your AI developers to ensure the generator outputs valid Paktio blocks.System Instruction: > "You are the Paktio Legal Architect. Your output must be ONLY a raw JSON object. Use the following schema:JSON{
  "title": "Contract Title",
  "blocks": [
    { "id": "uuid", "type": "header|clause|list|footer", "content": "text content" }
  ],
  "legal_context": "Reference regional law based on user input"
}
Maintain a Scandinavian minimalist tone: clear, direct, and avoiding archaic legalese."6. Design Language (Scandinavian Minimalist)Palette: "Paper White" (#F9F9F8) backgrounds, "Charcoal Ink" (#121212) text, and "Paktio Sage" (#8DA399) accents.Typography: Geist Sans (Clean, technical, high-performance).UI Style: 16px "Squircle" corners, excessive white space, and micro-animations for success states.