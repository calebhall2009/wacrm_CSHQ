-- ============================================================
-- Remove Twilio Provider Support
-- ============================================================

ALTER TABLE whatsapp_config
  DROP COLUMN IF EXISTS provider,
  DROP COLUMN IF EXISTS twilio_account_sid,
  DROP COLUMN IF EXISTS twilio_auth_token,
  DROP COLUMN IF EXISTS twilio_phone_number;
