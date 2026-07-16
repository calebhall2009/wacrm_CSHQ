const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function decrypt(text) {
  const ALGORITHM = 'aes-256-gcm';
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const [ivHex, encryptedHex, authTagHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function run() {
  const { data, error } = await supabase.from('whatsapp_config').select('telegram_bot_token').eq('provider', 'telegram').limit(1).maybeSingle();
  if (error || !data) { console.log('Error', error); return; }
  const token = decrypt(data.telegram_bot_token);
  console.log('Token is decrypted');
  
  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const json = await res.json();
  console.log('Webhook info:', JSON.stringify(json, null, 2));
}
run();
