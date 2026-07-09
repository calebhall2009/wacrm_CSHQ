-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  account_id uuid NOT NULL,
  contact_id uuid NULL,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_account_id_fkey FOREIGN KEY (account_id)
    REFERENCES public.accounts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
  CONSTRAINT appointments_contact_id_fkey FOREIGN KEY (contact_id)
    REFERENCES public.contacts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view appointments in their accounts" ON public.appointments;
CREATE POLICY "Users can view appointments in their accounts"
  ON public.appointments
  FOR SELECT
  USING (is_account_member(account_id));

DROP POLICY IF EXISTS "Users can insert appointments in their accounts" ON public.appointments;
CREATE POLICY "Users can insert appointments in their accounts"
  ON public.appointments
  FOR INSERT
  WITH CHECK (is_account_member(account_id, 'agent'));

DROP POLICY IF EXISTS "Users can update appointments in their accounts" ON public.appointments;
CREATE POLICY "Users can update appointments in their accounts"
  ON public.appointments
  FOR UPDATE
  USING (is_account_member(account_id, 'agent'))
  WITH CHECK (is_account_member(account_id, 'agent'));

DROP POLICY IF EXISTS "Users can delete appointments in their accounts" ON public.appointments;
CREATE POLICY "Users can delete appointments in their accounts"
  ON public.appointments
  FOR DELETE
  USING (is_account_member(account_id, 'agent'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_account_id ON public.appointments USING btree (account_id);
CREATE INDEX IF NOT EXISTS idx_appointments_contact_id ON public.appointments USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments USING btree (date);

DROP TRIGGER IF EXISTS set_updated_at ON public.appointments;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
