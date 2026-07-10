-- Create an ENUM for plan tiers
CREATE TYPE public.billing_plan_tier AS ENUM ('trial', 'basico', 'profesional', 'premium');

-- Add billing fields to the accounts table
ALTER TABLE public.accounts 
  ADD COLUMN plan_tier public.billing_plan_tier NOT NULL DEFAULT 'trial',
  ADD COLUMN trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '14 days');

-- Create a helper function to get current limits based on the plan
CREATE OR REPLACE FUNCTION public.get_account_limits(account_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan public.billing_plan_tier;
  v_limits jsonb;
BEGIN
  SELECT plan_tier INTO v_plan FROM public.accounts WHERE id = account_id;
  
  IF v_plan = 'trial' THEN
    v_limits := '{"max_agents": 1, "max_conversations": 50, "advanced_integrations": false}'::jsonb;
  ELSIF v_plan = 'basico' THEN
    v_limits := '{"max_agents": 1, "max_conversations": 150, "advanced_integrations": false}'::jsonb;
  ELSIF v_plan = 'profesional' THEN
    v_limits := '{"max_agents": 3, "max_conversations": 1500, "advanced_integrations": true}'::jsonb;
  ELSIF v_plan = 'premium' THEN
    v_limits := '{"max_agents": 10, "max_conversations": 5000, "advanced_integrations": true}'::jsonb;
  ELSE
    v_limits := '{"max_agents": 1, "max_conversations": 50, "advanced_integrations": false}'::jsonb;
  END IF;

  RETURN v_limits;
END;
$$;
