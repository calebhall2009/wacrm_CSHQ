import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    // Simular un pequeño retraso de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let responseText = "¡Hola! Soy el asistente virtual de demostración. ¿En qué te puedo ayudar hoy?"
    const msgLower = message.toLowerCase()
    
    if (msgLower.includes("precio") || msgLower.includes("costo")) {
      responseText = "Nuestros precios varían según el plan, pero puedes empezar gratis. ¡Escríbeme si quieres que un agente se comunique contigo!"
    } else if (msgLower.includes("agente") || msgLower.includes("humano")) {
      responseText = "¡Claro! En un entorno real, aquí transferiría el chat a un agente humano en el CRM para que tome el control de la conversación."
    } else if (msgLower.includes("whatsapp")) {
      responseText = "Esta es una simulación web, pero nuestro CRM se conecta a la API oficial de WhatsApp Business para responder a tus clientes reales."
    } else if (message.length > 5) {
      responseText = `He recibido tu mensaje: "${message}". Como esto es una demostración rápida, mis respuestas son limitadas. En producción, usaría el conocimiento de tu empresa (RAG) para responder con precisión.`
    }

    return NextResponse.json({ reply: responseText })
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando mensaje' }, { status: 500 })
  }
}
