
-- Create a stored procedure for upserting API keys
CREATE OR REPLACE FUNCTION public.upsert_api_key(
  p_user_id UUID,
  p_provider TEXT,
  p_api_key TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_api_keys (user_id, provider, api_key, created_at, updated_at)
  VALUES (p_user_id, p_provider, p_api_key, NOW(), NOW())
  ON CONFLICT (user_id, provider) 
  DO UPDATE SET 
    api_key = p_api_key,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
