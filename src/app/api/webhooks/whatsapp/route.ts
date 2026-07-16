import { NextResponse } from 'next/server';

// Este es el token que tú inventas. Debe ser el mismo que pongas en el panel de Meta.
// Lo ideal es luego ponerlo en tu archivo .env
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto_123';

// ----------------------------------------------------------------------
// GET: Sirve única y exclusivamente para que Meta verifique tu Webhook.
// ----------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado exitosamente por Meta!');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificación inválido' }, { status: 403 });
}

// ----------------------------------------------------------------------
// POST: Aquí es donde Meta enviará los mensajes que te escriban.
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Imprimimos el cuerpo completo para ver la estructura que manda WhatsApp
    console.log('📥 Evento recibido de WhatsApp:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (value?.messages) {
        // ¡Alguien nos envió un mensaje!
        const message = value.messages[0];
        const contact = value.contacts[0];
        
        console.log(`💬 Nuevo mensaje de ${contact.profile.name} (${message.from}): ${message.text?.body}`);
        
        // TODO: En el futuro, aquí guardaremos el mensaje en Supabase
      }
    }

    // Meta SIEMPRE requiere que le respondamos con un 200 OK rápido.
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error procesando el webhook:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
