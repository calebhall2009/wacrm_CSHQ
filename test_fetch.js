async function run() {
  const payload = {
    name: "Lead Qualifier Test",
    description: null,
    trigger_type: "keyword_match",
    trigger_config: { keywords: ["pricing"], match_type: "contains" },
    is_active: false,
    steps: [
      { step_type: "send_message", step_config: { text: "Hello" } },
      { step_type: "wait", step_config: { amount: 10, unit: "minutes" } },
      { step_type: "assign_conversation", step_config: { mode: "round_robin" } }
    ]
  };
  // Need to authenticate. We will just use the Supabase token of the session... Wait, I don't have the token.
}
