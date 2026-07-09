-- ============================================================
-- 037_add_gemini.sql — Agregar soporte para Gemini
--
-- Elimina las restricciones CHECK de las tablas ai_configs y
-- ai_usage_log para permitir a 'gemini' como un proveedor válido.
-- ============================================================

ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check;
ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check CHECK (provider IN ('openai', 'anthropic', 'gemini'));

ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;
ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check CHECK (provider IN ('openai', 'anthropic', 'gemini'));
