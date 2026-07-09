const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const esPath = path.join(__dirname, 'messages', 'es.json');

const data = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Translating main Sidebar & Header
if (data.Sidebar) {
  data.Sidebar.title = "Plantilla CRM para WhatsApp";
  data.Sidebar.dashboard = "Panel";
  data.Sidebar.inbox = "Bandeja de entrada";
  data.Sidebar.notifications = "Notificaciones";
  data.Sidebar.contacts = "Contactos";
  data.Sidebar.pipelines = "Embudos";
  data.Sidebar.broadcasts = "Difusiones";
  data.Sidebar.automations = "Automatizaciones";
  data.Sidebar.calendar = "Calendario";
  data.Sidebar.flows = "Flujos";
  data.Sidebar.aiAgents = "Agentes IA";
  data.Sidebar.settings = "Ajustes";
  data.Sidebar.menuProfile = "Perfil";
  data.Sidebar.menuSettings = "Ajustes";
  data.Sidebar.menuSignOut = "Cerrar sesión";
}

if (data.Header) {
  data.Header.dashboard = "Panel";
  data.Header.inbox = "Bandeja de entrada";
  data.Header.notifications = "Notificaciones";
  data.Header.contacts = "Contactos";
  data.Header.pipelines = "Embudos";
  data.Header.broadcasts = "Difusiones";
  data.Header.automations = "Automatizaciones";
  data.Header.calendar = "Calendario";
  data.Header.settings = "Ajustes";
}

// Translating Dashboard
if (data.Dashboard) {
  if (data.Dashboard.page) {
    data.Dashboard.page.title = "Panel de Control";
    data.Dashboard.page.description = "Análisis en vivo de conversaciones, contactos, tratos, difusiones y automatizaciones.";
    data.Dashboard.page.activeConversations = "Conversaciones Activas";
    data.Dashboard.page.newContactsToday = "Nuevos Contactos Hoy";
    data.Dashboard.page.openDealsValue = "Valor de Tratos Abiertos";
    data.Dashboard.page.messagesSentToday = "Mensajes Enviados Hoy";
    data.Dashboard.page.noChange = "Sin cambios {suffix}";
    data.Dashboard.page.newTodayVsYesterday = "nuevos hoy vs ayer";
    data.Dashboard.page.vsYesterday = "vs ayer";
  }
  if (data.Dashboard.quickActions) {
    data.Dashboard.quickActions.newContact = "Nuevo Contacto";
    data.Dashboard.quickActions.newDeal = "Nuevo Trato";
    data.Dashboard.quickActions.newBroadcast = "Nueva Difusión";
    data.Dashboard.quickActions.newAutomation = "Nueva Automatización";
  }
  if (data.Dashboard.conversationsChart) {
    data.Dashboard.conversationsChart.title = "Conversaciones en el Tiempo";
    data.Dashboard.conversationsChart.description = "Volumen diario de mensajes por dirección";
    data.Dashboard.conversationsChart.noActivity = "No hay actividad de mensajes en este rango";
    data.Dashboard.conversationsChart.noActivityHint = "Envía o recibe mensajes para comenzar a poblar este gráfico.";
  }
  if (data.Dashboard.pipelineDonut) {
    data.Dashboard.pipelineDonut.title = "Valor del Embudo";
    data.Dashboard.pipelineDonut.description = "Tratos abiertos por etapa";
    data.Dashboard.pipelineDonut.noOpenDeals = "Aún no hay tratos abiertos";
    data.Dashboard.pipelineDonut.noOpenDealsHint = "Crea tratos en Embudos para ver el desglose por etapas aquí.";
  }
}

// Translating Inbox
if (data.Inbox) {
  if (data.Inbox.page) {
    data.Inbox.page.whatsappNotConnected = "WhatsApp® no está conectado. Ve a Ajustes para conectar tu cuenta.";
  }
  if (data.Inbox.conversationList) {
    data.Inbox.conversationList.searchPlaceholder = "Buscar conversaciones...";
    data.Inbox.conversationList.noConversations = "No se encontraron conversaciones";
  }
  if (data.Inbox.messageThread) {
    data.Inbox.messageThread.selectConversation = "Selecciona una conversación";
    data.Inbox.messageThread.selectConversationHint = "Elige una conversación de la izquierda para empezar a mensajear";
  }
}

// Translating Notifications
if (data.Notifications) {
  if (data.Notifications.page) {
    data.Notifications.page.title = "Notificaciones";
    data.Notifications.page.description = "Las conversaciones que otros compañeros de equipo te asignen aparecerán aquí.";
    data.Notifications.page.markAllAsRead = "Marcar todo como leído";
    data.Notifications.page.noNotifications = "Aún no hay notificaciones";
    data.Notifications.page.noNotificationsDesc = "Verás una alerta aquí cuando alguien te asigne una conversación.";
  }
}

// Translating Contacts
if (data.Contacts) {
  if (data.Contacts.page) {
    data.Contacts.page.title = "Contactos";
    data.Contacts.page.subtitle = "Administra tu lista de contactos. {count} contactos en total.";
    data.Contacts.page.subtitleZero = "Administra tu lista de contactos.";
    data.Contacts.page.customFieldsBtn = "Campos personalizados";
    data.Contacts.page.importBtn = "Importar";
    data.Contacts.page.addContactBtn = "+ Agregar Contacto";
    data.Contacts.page.searchPlaceholder = "Buscar por nombre, teléfono o correo...";
    data.Contacts.page.filterByTags = "Filtrar por etiquetas";
    data.Contacts.page.noContactsYet = "Aún no hay contactos.";
    data.Contacts.page.addFirstContact = "+ Agregar tu primer contacto";
    data.Contacts.page.tableColumns = {
      name: "Nombre",
      phone: "Teléfono",
      email: "Correo",
      company: "Empresa",
      tags: "Etiquetas",
      createdAt: "Creado"
    };
  }
}

// Translating Pipelines
if (data.Pipelines) {
  if (data.Pipelines.page) {
    data.Pipelines.page.addPipeline = "+ Agregar Embudo";
    data.Pipelines.page.addDeal = "+ Agregar Trato";
    data.Pipelines.page.noPipelinesYet = "Aún no hay embudos";
    data.Pipelines.page.createToStartTracking = "Crea un embudo para empezar a rastrear tratos";
  }
  if (data.Pipelines.analytics) {
    data.Pipelines.analytics.totalDeals = "TOTAL DE TRATOS";
    data.Pipelines.analytics.pipelineValue = "VALOR DEL EMBUDO";
    data.Pipelines.analytics.avgDealSize = "TAMAÑO PROM. DEL TRATO";
    data.Pipelines.analytics.weightedValue = "VALOR PONDERADO";
    data.Pipelines.analytics.wonThisMonth = "GANADOS ESTE MES";
    data.Pipelines.analytics.lostThisMonth = "PERDIDOS ESTE MES";
  }
}

// Translating Broadcasts
if (data.Broadcasts) {
  if (data.Broadcasts.page) {
    data.Broadcasts.page.title = "Difusiones";
    data.Broadcasts.page.subtitle = "Envía mensajes masivos a tus contactos usando plantillas aprobadas.";
    data.Broadcasts.page.newBroadcast = "+ Nueva Difusión";
    data.Broadcasts.page.noBroadcastsYet = "Aún no hay difusiones";
    data.Broadcasts.page.createFirst = "Crea tu primera difusión para llegar a tus contactos a gran escala.";
  }
}

// Translating Automations
if (data.Automations) {
  if (data.Automations.list) {
    data.Automations.list.title = "Automatizaciones";
    data.Automations.list.subtitle = "Construye flujos de trabajo que reaccionan a eventos de WhatsApp® automáticamente.";
    data.Automations.list.create = "+ Crear Automatización";
    data.Automations.list.templatesTitle = "Plantillas de inicio rápido";
    data.Automations.list.emptyTitle = "Aún no hay automatizaciones";
    data.Automations.list.emptyDesc = "Elige una plantilla de arriba o crea una desde cero.";
  }
}

// Translating AI Agents
if (data.AIAgents) {
  data.AIAgents.title = "Agentes IA";
  data.AIAgents.subtitle = "Tu propio agente de IA — configúralo, luego pruébalo en el patio de juegos antes de que responda a los clientes en la bandeja de entrada.";
  data.AIAgents.playground = "Patio de juegos";
  data.AIAgents.setup = "Configuración";
  data.AIAgents.usage = "Uso";
  
  if (data.AIAgents.setupTab) {
    data.AIAgents.setupTab.title = "Configuración del Agente";
    data.AIAgents.setupTab.description = "Trae tu propia clave de OpenAI o Anthropic. wacrm llama al proveedor directamente con tu clave — sin tarifas por asiento de IA, y tus datos siguen siendo tuyos. Esto potencia los borradores de IA en la bandeja de entrada, el bot de respuesta automática y el Patio de juegos.";
    data.AIAgents.setupTab.providerKeyTitle = "Proveedor y clave";
  }
}

// Translating Settings
if (data.Settings) {
  if (data.Settings.page) {
    data.Settings.page.title = "Ajustes";
    data.Settings.page.subtitle = "Todo en un solo lugar — tu cuenta y tu espacio de trabajo. Elige una sección para administrarla.";
  }
}

fs.writeFileSync(esPath, JSON.stringify(data, null, 2));
console.log('es.json has been updated with Spanish translations.');
