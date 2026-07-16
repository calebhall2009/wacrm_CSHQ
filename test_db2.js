const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: config } = await supabaseAdmin
    .from('whatsapp_config')
    .select('id, account_id, user_id')
    .eq('provider', 'telegram')
    .limit(1)
    .maybeSingle()

  if (!config) {
    console.log('No config');
    return
  }

  const accountId = config.account_id
  const userId = config.user_id
  const chatId = "111222"
  const contactName = "Test"
  
  const { data: newContact, error } = await supabaseAdmin
    .from('contacts')
    .insert({
      account_id: accountId,
      user_id: userId,
      phone: chatId,
      name: contactName
    })
    .select()
    .single()

  console.log('Result:', newContact, 'Error:', error)
}
run();
