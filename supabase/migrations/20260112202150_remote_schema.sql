drop extension if exists "pg_net";

drop policy "Users can view org contracts" on "public"."contracts";

alter table "public"."contracts" add column "is_template" boolean default false;

CREATE INDEX idx_contracts_is_template ON public.contracts USING btree (is_template);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, locale, is_mfa_enabled)
  VALUES (new.id, 'en', false);
  RETURN new;
END;
$function$
;


  create policy "Users can view org contracts and system templates"
  on "public"."contracts"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.org_id = contracts.org_id)))) OR ((org_id IS NULL) AND (auth.role() = 'authenticated'::text))));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


