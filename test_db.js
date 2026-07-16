const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('whatsapp_config').select('id, account_id, provider');
  console.log('Configs:', data, 'Error:', error);
  
  const { data: contacts } = await supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(2);
  console.log('Recent contacts:', contacts);
  
  const { data: convs } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false }).limit(2);
  console.log('Recent convs:', convs);
  
  const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(2);
  console.log('Recent msgs:', msgs);
}
run();
