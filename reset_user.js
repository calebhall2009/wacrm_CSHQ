const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetUser() {
  const email = "narcisakimi@gmail.com";
  
  console.log(`Buscando usuario ${email}...`);
  // Get user by email (using auth.admin if possible, or just querying profiles)
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching users:", authError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.error("User not found");
    return;
  }
  
  console.log(`Usuario encontrado: ${user.id}. Buscando profile...`);
  
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("account_id")
    .eq("user_id", user.id)
    .single();
    
  if (profileError || !profile) {
    console.error("Profile error:", profileError);
    return;
  }
  
  console.log(`Account ID: ${profile.account_id}. Reseteando onboarding...`);
  
  // Reset account fields
  const { error: updateError } = await supabase
    .from("accounts")
    .update({
      name: "Mi Cuenta", // Default name
      onboarding_completed: false,
      business_industry: null,
      business_description: null,
      team_size: null,
      primary_use_case: null,
    })
    .eq("id", profile.account_id);
    
  if (updateError) {
    console.error("Error al actualizar account:", updateError);
    return;
  }
  
  console.log("¡Cuenta reseteada con éxito! El usuario volverá a ver el Onboarding.");
}

resetUser();
