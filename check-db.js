require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('whatsapp_config').select('*');
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : null);
  if (data && data.length > 0) {
    console.log("First row phone_number_id:", data[0].phone_number_id);
  }
}
run();
