
-- This SQL should be run in Supabase to generate updated types
-- After running, download the updated types.ts file and replace your existing one

-- First, ensure the table has the right structure
ALTER TABLE public.user_api_keys 
  ADD CONSTRAINT user_api_keys_pkey PRIMARY KEY (user_id, provider) 
  ON CONFLICT DO NOTHING;
