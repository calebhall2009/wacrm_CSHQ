const fs = require('fs');
const crypto = require('node:crypto');

// 1. Cargar variables de entorno
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, ...v] = line.split('='); 
  if(k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^"|"$/g, ''); 
  return acc; 
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const META_APP_SECRET = env.META_APP_SECRET;

async function run() {
  console.log("Configurando el mensaje de prueba...");

  // Intentamos obtener una cuenta y usuario válidos
  let validAccountId = null;
  let validUserId = null;
  const { data: accounts } = await supabase.from('accounts').select('id, owner_user_id').limit(1);
  if (accounts && accounts.length > 0) {
    validAccountId = accounts[0].id;
    validUserId = accounts[0].owner_user_id;
  } else {
    console.error("No se encontró una cuenta en la base de datos.");
    return;
  }

  const fakePhoneId = "100000000000001"; // ID de teléfono falso para la prueba

  // Insertar configuración de WhatsApp falsa para que el webhook lo acepte
  try {
    await supabase.from('whatsapp_config').upsert({
      id: "11111111-2222-3333-4444-555555555555",
      account_id: validAccountId,
      user_id: validUserId,
      phone_number_id: fakePhoneId,
      access_token: "test_token",
      waba_id: "test_waba"
    });
  } catch(e) {}

  // Construir el payload del webhook (Lo que Meta enviaría)
  const userPhone = "593999999999";
  const payload = {
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
                "phone_number_id": fakePhoneId
              },
              "contacts": [
                {
                  "profile": { "name": "Cliente de Prueba" },
                  "wa_id": userPhone
                }
              ],
              "messages": [
                {
                  "from": userPhone,
                  "id": `wamid.${crypto.randomBytes(16).toString('hex')}`,
                  "timestamp": Math.floor(Date.now() / 1000).toString(),
                  "type": "text",
                  "text": { "body": "¡Hola! Este es un mensaje de prueba desde el webhook local." }
                }
              ]
            }
          }
        ]
      }
    ]
  };

  const rawBody = JSON.stringify(payload);
  const signature = 'sha256=' + crypto.createHmac('sha256', META_APP_SECRET).update(rawBody).digest('hex');

  console.log("Enviando mensaje al CRM local...");

  try {
    const res = await fetch('http://localhost:3000/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signature
      },
      body: rawBody
    });

    if (res.ok) {
      console.log("✅ ¡Mensaje enviado con éxito!");
      console.log("Revisa la interfaz de tu CRM en 'Conversaciones' para ver el mensaje de 'Cliente de Prueba'.");
    } else {
      console.error(`❌ Falló con estado ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error('❌ Error de conexión. ¿Está corriendo Next.js (npm run dev)?', err.message);
  }
}

run().catch(console.error);
