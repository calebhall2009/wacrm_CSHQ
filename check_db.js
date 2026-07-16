const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: contacts } = await supabase.from('contacts').select('id, name').limit(5);
  console.log("Contacts:", contacts);

  const { data: appts, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("Appts Error:", error);
  console.log("Appts:", appts);
}

check();
