const fs = require('fs');
const path = require('path');

const esPath = path.join(__dirname, 'messages', 'es.json');
const data = JSON.parse(fs.readFileSync(esPath, 'utf8'));

if (!data.Settings) data.Settings = {};
if (!data.Settings.sections) data.Settings.sections = {};
data.Settings.pageTitle = "Ajustes";
data.Settings.pageDesc = "Todo en un solo lugar — tu cuenta y tu espacio de trabajo. Elige una sección para administrarla.";

data.Settings.sections = {
  overview: "Resumen",
  profile: "Tu perfil",
  security: "Inicio de sesión y seguridad",
  appearance: "Apariencia",
  whatsapp: "WhatsApp",
  templates: "Plantillas",
  fields: "Campos y etiquetas",
  deals: "Tratos y moneda",
  members: "Miembros del equipo",
  api: "Claves API"
};

if (!data.Settings.aiConfig) data.Settings.aiConfig = {};
data.Settings.aiConfig.title = "Configuración del agente";
data.Settings.aiConfig.description = "Trae tu propia clave de OpenAI o Anthropic. wacrm llama al proveedor directamente con tu clave — sin tarifas por asiento de IA, y tus datos siguen siendo tuyos. Esto potencia los borradores de IA en la bandeja de entrada, el bot de respuesta automática y el Patio de juegos.";
data.Settings.aiConfig.providerAndKey = "Proveedor y clave";
data.Settings.aiConfig.encryptionNotice = "Tu clave se encripta en reposo (AES-256-GCM) y nunca se muestra de nuevo después de guardarla.";
data.Settings.aiConfig.provider = "Proveedor";
data.Settings.aiConfig.model = "Modelo";
data.Settings.aiConfig.apiKey = "Clave API";
data.Settings.aiConfig.testKey = "Probar clave";
data.Settings.aiConfig.embeddingsKey = "Clave de Embeddings";
data.Settings.aiConfig.optionalSemanticSearch = "(opcional — habilita la búsqueda semántica en la base de conocimientos)";
data.Settings.aiConfig.embeddingsHint = "Una clave de OpenAI usada solo para incrustar tu base de conocimientos (text-embedding-3-small){sameKeyText}. Déjalo en blanco para usar la búsqueda por palabras clave en su lugar. Bórralo para apagar la búsqueda semántica.";
data.Settings.aiConfig.sameKeyText = " — puede ser la misma clave de arriba";
data.Settings.aiConfig.behaviour = "Comportamiento";
data.Settings.aiConfig.behaviourDesc = "Cuéntale al asistente sobre tu negocio — productos, tono, qué puede y qué no puede prometer. Este contexto alimenta tanto los borradores como las respuestas automáticas.";
data.Settings.aiConfig.businessContext = "Contexto del negocio e instrucciones";
data.Settings.aiConfig.promptPlaceholder = "ej. Somos Acme, una tienda de equipos de café. Sé cálido y conciso. Nunca cotices precios o fechas de entrega — transfiere a un humano para eso.";
data.Settings.aiConfig.enableAssistant = "Habilitar asistente de IA";
data.Settings.aiConfig.enableAssistantDesc = "Interruptor principal. Enciende el botón “Borrador con IA” en la bandeja de entrada.";
data.Settings.aiConfig.autoReply = "Respuesta automática a mensajes entrantes";
data.Settings.aiConfig.autoReplyDesc = "El bot responde a nuevos mensajes entrantes automáticamente (solo cuando ningún flujo los maneja y no hay agente asignado). Transfiere a un humano cuando no puede ayudar.";
data.Settings.aiConfig.maxAutoReplies = "Máx. respuestas automáticas por conversación";
data.Settings.aiConfig.maxAutoRepliesDesc = "Después de estas respuestas del bot en un hilo, el bot se queda en silencio.";
data.Settings.aiConfig.handoffTo = "Transferir a";
data.Settings.aiConfig.handoffToDesc = "Cuando el bot no puede ayudar — o alcanza el límite de respuestas — se pausa y enruta el chat aquí, con una nota corta de lo que pasó.";
data.Settings.aiConfig.handoffQueue = "Cola sin asignar (cualquier agente puede tomarla)";
data.Settings.aiConfig.save = "Guardar";
data.Settings.aiConfig.remove = "Eliminar";

if (!data.Settings.aiKnowledge) data.Settings.aiKnowledge = {};
data.Settings.aiKnowledge.title = "Base de conocimientos";
data.Settings.aiKnowledge.description = "Añade FAQs, políticas o detalles de productos. El asistente recupera las partes relevantes al hacer borradores y responder automáticamente, para que pueda responder en lugar de transferir.{searchType}";
data.Settings.aiKnowledge.addDoc = "Añadir documento";
data.Settings.aiKnowledge.saveDoc = "Guardar documento";
data.Settings.aiKnowledge.cancel = "Cancelar";

if (!data.AIAgents) data.AIAgents = {};
if (!data.AIAgents.playgroundTab) data.AIAgents.playgroundTab = {};
data.AIAgents.playgroundTab.emptyTitle = "Envía un mensaje para ver cómo respondería tu agente.";
data.AIAgents.playgroundTab.emptyDesc = "Usa tu base de conocimientos y se comporta exactamente como el bot de respuesta automática — incluyendo transferencias.";
data.AIAgents.playgroundTab.notSetup = "¿Aún no está configurado? Ve a Configuración →";
data.AIAgents.playgroundTab.inputPlaceholder = "Escribe un mensaje de cliente...";

if (!data.AIAgents.usageTab) data.AIAgents.usageTab = {};
data.AIAgents.usageTab.title = "Uso de tokens";
data.AIAgents.usageTab.description = "Tokens gastados en tu clave de proveedor por borradores y el bot de respuesta automática. Solo recuentos — no se almacena contenido de mensajes aquí.";
data.AIAgents.usageTab.emptyTitle = "Aún no hay uso de IA en los últimos 30 días.";
data.AIAgents.usageTab.emptyDesc = "Esto se llena a medida que el asistente hace borradores y responde automáticamente.";

fs.writeFileSync(esPath, JSON.stringify(data, null, 2));
console.log('es.json updated with Settings and AI Agents translations.');
