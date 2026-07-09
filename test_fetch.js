const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/automations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We can't easily fake the Next.js auth cookie with just fetch.
        // Let's write a script that signs in and gets the cookie first?
      },
      body: JSON.stringify({
        name: "Lead Qualifier Test",
        description: null,
        trigger_type: "keyword_match",
        trigger_config: { keywords: ["pricing"], match_type: "contains" },
        is_active: false,
        steps: [
          { step_type: "send_message", step_config: { text: "Hello" } }
        ]
      })
    });
    console.log(res.status);
    const body = await res.json();
    console.log(body);
  } catch (err) {
    console.error(err);
  }
}

run();
