const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://behparpvdlhkfoxahbdh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaHBhcnB2ZGxoa2ZveGFoYmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUzNjgwNSwiZXhwIjoyMDk5MTEyODA1fQ.QE_bepwvPugW2nvaZxFBJmouHPGRJXE5iMyLlvdmz3Q'
);

async function check() {
  const { data, error } = await supabase.from('whatsapp_config').select('telegram_bot_token').eq('provider', 'telegram');
  if (data && data.length > 0) {
    const token = data[0].telegram_bot_token;
    console.log("Token in DB:", `"${token}"`);
    if (!token) return console.log('No token set');
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`).then(r => r.json());
    console.log(JSON.stringify(res, null, 2));
    
    // While we're here, let's just forcefully set the webhook to the correct Vercel URL
    // Wait, I don't know the Vercel URL exactly. The user said wacrm-cshq-kzw8.vercel.app?
    // Let me check what URL the user visited in the screenshot.
    // The screenshot URL was: wacrm-cshq-kzw8-jmfr52ql-calebhall2009s-projects.vercel.app
    // Or wacrm-cshq-kzw8.vercel.app
  } else {
    console.log('No config found or error:', error);
  }
}
check();
