import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { decrypt } from './src/lib/crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data } = await supabase.from('whatsapp_config').select('telegram_bot_token').eq('provider', 'telegram');
  if (data && data.length > 0) {
    const encToken = data[0].telegram_bot_token;
    if (!encToken) return console.log('No token');
    const token = decrypt(encToken);
    console.log("Raw token length:", token.length);
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`).then(r => r.json());
    console.log("Webhook Info:", JSON.stringify(res, null, 2));
    
    // Let's set it!
    const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL + '/api/telegram/webhook';
    console.log("Setting to", webhookUrl);
    const res2 = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    }).then(r => r.json());
    console.log("Set Webhook Response:", JSON.stringify(res2, null, 2));
  } else {
    console.log("No config found");
  }
}
check();
