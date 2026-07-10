-- ============================================================
-- 042_onboarding.sql
-- Adds fields to accounts and profiles to track and store
-- onboarding wizard data.
-- ============================================================

-- Add onboarding tracking to accounts
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Add business details to accounts
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS business_industry TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS business_description TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS primary_use_case TEXT;

-- Add user details to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_in_company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
