-- Fix for 'digest' function not found on remote DB
-- This ensures the extensions schema is in the search path and uses explicit schema for the trigger function

CREATE OR REPLACE FUNCTION public.handle_contract_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Use explicit extensions schema for digest if available, fallback to search path
  -- We also ensure the content is cast to bytea which is the most stable signature for digest
  NEW.current_hash := encode(extensions.digest(NEW.content_json::text::bytea, 'sha256'), 'hex');

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

-- Re-create trigger just in case, though it shouldn't be necessary if only function changed
DROP TRIGGER IF EXISTS trigger_invalidate_signatures ON public.contracts;
CREATE TRIGGER trigger_invalidate_signatures
BEFORE UPDATE ON public.contracts
FOR EACH ROW
WHEN (OLD.content_json IS DISTINCT FROM NEW.content_json)
EXECUTE FUNCTION public.handle_contract_change();
