const fs = require('fs');
const crypto = require('node:crypto');

// 1. Read env
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, ...v] = line.split('='); 
  if(k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^"|"$/g, ''); 
  return acc; 
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const NUM_CONCURRENT = parseInt(process.argv[2]) || 10;
const DURATION_SEC = parseInt(process.argv[3]) || 10;

const META_APP_SECRET = env.META_APP_SECRET;

async function run() {
  // Create a fake config using the first available account and user
  let phoneNumberId = "1234567890_test";
  try {
    const { data: accounts } = await supabase.from('accounts').select('id, owner_user_id').limit(1);
    if (accounts && accounts.length > 0) {
      const validAccountId = accounts[0].id;
      const validUserId = accounts[0].owner_user_id;

      const res = await supabase.from('whatsapp_config').upsert({
        id: "00000000-0000-0000-0000-000000000002",
        account_id: validAccountId,
        user_id: validUserId,
        phone_number_id: phoneNumberId,
        access_token: "fake",
        waba_id: "fake"
      });
      if (res.error) console.error("Upsert error:", res.error);
    }
  } catch (e) {
    console.error("Upsert exception:", e);
  }

  // Double check if it exists now
  let { data: configs, error } = await supabase.from('whatsapp_config').select('*').limit(1);
  if (error) {
    console.error('Error fetching config:', error);
    return;
  }
  if (!configs || !configs.length) {
    console.error('No whatsapp config found in DB. Need at least one valid config to test webhooks.');
    return;
  }
  const config = configs[0];
  phoneNumberId = config.phone_number_id;
  console.log(`Using phone_number_id: ${phoneNumberId}`);
  console.log(`Starting load test with ${NUM_CONCURRENT} concurrent workers for ${DURATION_SEC} seconds`);

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();
  let keepRunning = true;

  setTimeout(() => { keepRunning = false; }, DURATION_SEC * 1000);

  function createPayload(workerId) {
    // Generate a phone number based on workerId so we have distinct users (to test concurrency issues on new contacts)
    const phone = `59399999${workerId.toString().padStart(4, '0')}`;
    return {
      "entry": [
        {
          "id": "12345",
          "changes": [
            {
              "field": "messages",
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "1234567890",
                  "phone_number_id": phoneNumberId
                },
                "contacts": [
                  {
                    "profile": { "name": `Test User ${workerId}` },
                    "wa_id": phone
                  }
                ],
                "messages": [
                  {
                    "from": phone,
                    "id": `wamid.${crypto.randomBytes(16).toString('hex')}`,
                    "timestamp": Math.floor(Date.now() / 1000).toString(),
                    "type": "text",
                    "text": { "body": "Load Test Message" }
                  }
                ]
              }
            }
          ]
        }
      ]
    };
  }

  async function worker(workerId) {
    while (keepRunning) {
      const payload = createPayload(workerId);
      const rawBody = JSON.stringify(payload);
      
      const signature = 'sha256=' + crypto.createHmac('sha256', META_APP_SECRET).update(rawBody).digest('hex');

      try {
        const res = await fetch('http://localhost:3000/api/whatsapp/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hub-signature-256': signature
          },
          body: rawBody
        });
        if (res.ok) successCount++;
        else {
          failCount++;
          console.error(`Status ${res.status}: ${await res.text()}`);
        }
      } catch (err) {
        failCount++;
        console.error('Fetch error:', err.message);
      }
    }
  }

  const workers = Array.from({ length: NUM_CONCURRENT }, (_, i) => worker(i));
  await Promise.all(workers);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`\n--- Load Test Complete ---`);
  console.log(`Duration: ${duration.toFixed(2)} seconds`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`RPS (Req/s): ${(successCount / duration).toFixed(2)}`);
}

run().catch(console.error);
