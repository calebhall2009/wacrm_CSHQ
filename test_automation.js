const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase URL or Service Role Key");
  process.exit(1);
}

const admin = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: accounts } = await admin.from('accounts').select('id, owner_user_id').limit(1);
  if (!accounts || accounts.length === 0) {
    console.log("No accounts found");
    return;
  }
  const acc = accounts[0];
  
  const payload = {
    user_id: acc.owner_user_id,
    account_id: acc.id,
    name: "Test Automation",
    description: null,
    trigger_type: "keyword_match",
    trigger_config: { keywords: ["pricing"], match_type: "contains" },
    is_active: false,
  };

  console.log("Inserting automation:", payload);
  const { data: automation, error: insertErr } = await admin
    .from('automations')
    .insert(payload)
    .select()
    .single();

  if (insertErr) {
    console.error("Insert Automation Error:", insertErr);
    return;
  }
  console.log("Automation inserted:", automation.id);

  // Now insert steps
  const crypto = require('crypto');
  const steps = [
    {
      id: crypto.randomUUID(),
      automation_id: automation.id,
      parent_step_id: null,
      branch: null,
      step_type: 'send_message',
      step_config: { text: "Great — happy to help with pricing! Quick question: roughly how many seats are you looking for?" },
      position: 0
    },
    {
      id: crypto.randomUUID(),
      automation_id: automation.id,
      parent_step_id: null,
      branch: null,
      step_type: 'wait',
      step_config: { amount: 10, unit: "minutes" },
      position: 1
    },
    {
      id: crypto.randomUUID(),
      automation_id: automation.id,
      parent_step_id: null,
      branch: null,
      step_type: 'assign_conversation',
      step_config: { mode: "round_robin" },
      position: 2
    }
  ];

  console.log("Inserting steps:", steps);
  const { error: stepsErr } = await admin.from('automation_steps').insert(steps);
  if (stepsErr) {
    console.error("Insert Steps Error:", stepsErr);
  } else {
    console.log("Steps inserted successfully");
  }
}

run();
