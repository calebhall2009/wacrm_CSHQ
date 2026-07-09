-- ============================================================
-- 036_sandbox_messages.sql — Persistencia para el simulador AI
--
-- Tabla para guardar el historial de las conversaciones del
-- widget de pruebas de la IA, separada de `messages` para
-- no ensuciar la bandeja de entrada real del CRM.
-- ============================================================

CREATE TABLE IF NOT EXISTS sandbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sandbox_messages ENABLE ROW LEVEL SECURITY;

-- SELECT: Cualquier miembro de la cuenta puede leer el historial
CREATE POLICY sandbox_messages_select ON sandbox_messages FOR SELECT
  USING (is_account_member(account_id));

-- INSERT: Cualquier miembro de la cuenta puede guardar mensajes
CREATE POLICY sandbox_messages_insert ON sandbox_messages FOR INSERT
  WITH CHECK (is_account_member(account_id));

-- DELETE: Miembros pueden borrar su propio historial de sandbox
CREATE POLICY sandbox_messages_delete ON sandbox_messages FOR DELETE
  USING (is_account_member(account_id));
