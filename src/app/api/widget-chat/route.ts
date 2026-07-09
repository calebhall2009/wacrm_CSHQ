import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/ai/admin-client'
import { loadAiConfig } from '@/lib/ai/config'
import { generateReply } from '@/lib/ai/generate'
import { retrieveKnowledge } from '@/lib/ai/knowledge'
import { buildSystemPrompt } from '@/lib/ai/defaults'
import type { ChatMessage } from '@/lib/ai/types'

// Mock Data para el Gestor de Demos Estático
const KNOWLEDGE_BASES: Record<string, any> = {
  "Agencia-Marketing": {
    name: "Agencia de Marketing Digital 'GrowthX'",
    services: "Ofrecemos SEO técnico, Gestión avanzada de pautas en Google Ads y Meta Ads...",
    greeting: "¡Hola! Soy el asistente experto de GrowthX. ¿Estás buscando escalar tus ventas y dominar tu nicho con marketing digital?",
    sales_trigger: ["me interesa el plan", "quiero empezar", "contratar"],
    follow_up_config: "Si el usuario no responde después de pedir precios, enviar mensaje de seguimiento a las 24 hrs.",
    objections: {
      "caro": "Entiendo perfectamente que pueda parecer una inversión fuerte al inicio. Sin embargo, nuestros clientes suelen ver un Retorno de Inversión (ROI) del 300%."
    }
  },
  "Clinica-Dental": {
    name: "Clínica Odontológica 'Sonrisas Blancas'",
    services: "Realizamos Limpiezas profundas con ultrasonido, Blanqueamientos LED...",
    greeting: "¡Hola! Bienvenido a la Clínica Sonrisas Blancas. ¿En qué podemos ayudarte hoy?",
    sales_trigger: ["quiero agendar", "sacar cita", "reservar"],
    follow_up_config: "Descuento en 48 hrs.",
    objections: {
      "caro": "Sabemos que la salud y estética dental es una inversión importante. Ofrecemos financiamiento a 12 meses."
    }
  },
  "Tienda-Deportes": {
    name: "SportLife Store",
    services: "Vendemos Ropa deportiva de alto rendimiento, Zapatillas...",
    greeting: "¡Hola, atleta! Soy el asistente virtual de SportLife.",
    sales_trigger: ["quiero comprar", "lo llevo", "añadir al carrito"],
    follow_up_config: "Recordatorio de carrito abandonado en 12 hrs.",
    objections: {
      "caro": "Nuestros precios reflejan que somos distribuidores autorizados de productos originales con garantía."
    }
  }
}

const getRandomFallback = () => {
  const fallbacks = [
    "Comprendo. ¿Hay algún servicio o producto en particular del que te gustaría que te dé más información?",
    "Entiendo perfectamente. ¿Te gustaría que revisemos opciones o prefieres consultar sobre nuestros precios primero?",
    "¡Claro! Cuéntame, ¿qué es lo que más estás buscando mejorar o resolver en este momento?",
    "Vale, lo anoto. ¿Tienes alguna otra pregunta sobre lo que hacemos o cómo podemos ayudarte?",
    "De acuerdo. Estoy aquí para aclarar cualquier duda, ¿te gustaría agendar una charla con alguien del equipo para verlo a detalle?"
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    
    if (!clientId) return NextResponse.json({ messages: [] })

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)
    
    if (isUUID) {
      return NextResponse.json({ messages: [] })
    }

    return NextResponse.json({ messages: [] })
  } catch (err) {
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { message, clientId, history = [] } = await req.json()
    
    // --------------------------------------------------------
    // MODO PRODUCCIÓN: Si el clientId es un UUID de Supabase
    // --------------------------------------------------------
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)
    
    if (isUUID) {
      const db = supabaseAdmin()
      const config = await loadAiConfig(db, clientId, { requireActive: false })
      
      if (!config) {
        return NextResponse.json({ 
          reply: "El entorno de IA no está configurado para esta cuenta. Por favor, configura tu API Key en los ajustes del CRM.",
          meta: { systemLog: "[ERROR]: AI Config not found or invalid API key." }
        })
      }

      // Convertir historial al formato del proveedor
      const aiMessages: ChatMessage[] = history.map((m: any) => ({
        role: m.role === 'system' ? 'assistant' : m.role, // Omitimos 'system' log entries en el prompt real
        content: m.content
      }))
      aiMessages.push({ role: 'user', content: message })

      try {
        const knowledge = await retrieveKnowledge(db, clientId, config, message)
        const systemPrompt = buildSystemPrompt({
          userPrompt: config.systemPrompt || "Eres un asistente útil y amigable.",
          mode: 'draft', // Usamos draft para que no genere el sentinel de handoff en el sandbox
          knowledge,
        })

        const result = await generateReply({
          config,
          systemPrompt,
          messages: aiMessages
        })



        return NextResponse.json({ 
          reply: result.text,
          meta: { systemLog: `[PRODUCCIÓN]: Mensaje procesado con el modelo ${config.model} vía ${config.provider}.` }
        })

      } catch (err: any) {
        return NextResponse.json({ 
          reply: "Hubo un error al comunicarse con el proveedor de IA. Revisa tu clave API.",
          meta: { systemLog: `[ERROR]: ${err.message}` }
        }, { status: 500 })
      }
    }

    // --------------------------------------------------------
    // MODO MOCK: Para la demo estática original (Agencia, Clínica, etc)
    // --------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let responseText = ""
    let stageUpdated = false
    let systemLog = ""

    const msgLower = message.toLowerCase()
    const lastBotMessage = history.length > 0 ? history[history.length - 1].content.toLowerCase() : ""
    
    const context = KNOWLEDGE_BASES[clientId] || KNOWLEDGE_BASES["Agencia-Marketing"]

    // Protecciones
    const isPromptInjection = ["ignora", "olvida", "instrucciones", "prompt", "sistema", "system", "actua como"].some(w => msgLower.includes(w));
    if (isPromptInjection) {
      return NextResponse.json({ 
        reply: "Lo siento, como asistente, mi función es ayudarte con información sobre la empresa.",
        meta: { systemLog: `[SECURITY GUARDRAIL]: Intento de Prompt Injection bloqueado.` }
      })
    }

    const botAskedForCall = lastBotMessage.includes("llamada") || lastBotMessage.includes("asesoría") || lastBotMessage.includes("cita")
    const userAccepts = ["si", "claro", "me parece bien", "ok", "vale", "dale"].some(w => msgLower === w || msgLower.includes(` ${w} `) || msgLower.startsWith(w));

    if (botAskedForCall && userAccepts && !msgLower.includes("precio")) {
      return NextResponse.json({ 
        reply: "¡Excelente! Para agendar tu espacio, por favor indícame qué día de la semana te viene mejor.",
        meta: { stageUpdated: true, systemLog: `[CRM Automatizado]: Lead movido a "Interesado / Agendando".` }
      })
    }

    const isGreeting = ["hola", "start", "buenas", "que tal", "saludos"].some(w => msgLower.includes(w));
    const isPricing = ["precio", "costo", "cuanto", "vale", "planes"].some(w => msgLower.includes(w));
    const isServices = ["servicio", "ofrecen", "que hacen", "producto"].some(w => msgLower.includes(w));
    const isObjectionCaro = ["caro", "dinero", "muy alto", "no me alcanza"].some(w => msgLower.includes(w));
    const isSalesTrigger = context.sales_trigger.some((trigger: string) => msgLower.includes(trigger));

    if (isSalesTrigger) {
      responseText = "¡Perfecto! Un agente experto tomará tu caso ahora mismo."
      stageUpdated = true
      systemLog = `[CRM Automatizado]: update_deal_stage(deal_id: 849, new_stage: "Lead Calificado / Cierre").`
    } else if (isObjectionCaro) {
      responseText = context.objections.caro
      systemLog = `[Análisis de Sentimiento]: Objeción de precio manejada para ${clientId}.`
    } else if (isPricing) {
      responseText = `Claro que sí, aquí tienes la información: ${context.pricing}`
    } else if (isServices) {
      responseText = `Te detallo nuestra oferta: ${context.services}`
    } else if (isGreeting && message.length < 20) {
      responseText = context.greeting
      systemLog = `[RAG]: Contexto cargado exitosamente para ${clientId}.`
    } else {
      responseText = getRandomFallback()
    }

    return NextResponse.json({ 
      reply: responseText,
      meta: { stageUpdated, systemLog }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando mensaje' }, { status: 500 })
  }
}
