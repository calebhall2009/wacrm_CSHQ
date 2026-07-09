const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

const automationsEn = {
  "builder": {
    "tags": {
      "placeholder": "Select a tag",
      "select": "Select tag",
      "unknown": "Unknown tag: {id}"
    },
    "fields": {
      "name": "Name",
      "email": "Email",
      "company": "Company",
      "customFields": "Custom Fields",
      "unknown": "Unknown field: {id}"
    },
    "agents": {
      "placeholder": "Select an agent",
      "select": "Select agent",
      "unknown": "Unknown agent: {id}"
    },
    "pipelines": {
      "pipelineIdLabel": "Pipeline ID",
      "stageIdLabel": "Stage ID",
      "pipelineLabel": "Pipeline",
      "selectPipeline": "Select pipeline",
      "unknownPipeline": "Unknown pipeline: {id}",
      "stageLabel": "Stage",
      "selectStage": "Select stage",
      "selectPipelineFirst": "Select a pipeline first",
      "unknownStage": "Unknown stage: {id}"
    },
    "templates": {
      "templateNameLabel": "Template Name",
      "languageLabel": "Language",
      "templateLabel": "Template",
      "select": "Select template",
      "unknown": "Unknown template: {name} ({lang})",
      "unknownLang": "Unknown language"
    },
    "toasts": {
      "saveFailed": "Save failed",
      "saved": "Automation saved",
      "created": "Automation created"
    },
    "backToAutomations": "Back to Automations",
    "untitled": "Untitled automation",
    "active": "Active",
    "activeAria": "Toggle active state",
    "save": "Save",
    "saveDraft": "Save Draft",
    "trigger": "Trigger",
    "triggerType": "Trigger Type",
    "schedule": "Schedule",
    "scheduleHint": "When should this run?",
    "keywords": "Keywords (comma separated)",
    "keywordsHint": "pricing, quote, help",
    "replyIds": "Reply IDs (comma separated)",
    "replyIdsHint": "btn_yes, btn_no",
    "replyIdsHelp": "Matches exact button or interactive reply payloads",
    "delete": "Delete",
    "addStep": "Add step",
    "branches": {
      "yes": "Yes",
      "no": "No"
    },
    "steps": {
      "sendMessage": "Send Message",
      "sendTemplate": "Send Template",
      "addTag": "Add Tag",
      "removeTag": "Remove Tag",
      "assignConversation": "Assign Conversation",
      "unassignConversation": "Unassign Conversation",
      "closeConversation": "Close Conversation",
      "setContactField": "Set Contact Field",
      "createDeal": "Create Deal",
      "wait": "Wait",
      "condition": "Condition",
      "webhook": "Webhook"
    },
    "triggers": {
      "new_message_received": {
        "label": "New message received",
        "hint": "Triggers when any inbound message is received."
      },
      "keyword_match": {
        "label": "Keyword match",
        "hint": "Triggers when message contains specific words."
      },
      "interactive_reply": {
        "label": "Interactive reply",
        "hint": "Triggers when a specific button/list reply is received."
      },
      "tag_added": {
        "label": "Tag added",
        "hint": "Triggers when a specific tag is added to a contact."
      },
      "conversation_opened": {
        "label": "Conversation opened",
        "hint": "Triggers when a conversation starts."
      },
      "conversation_closed": {
        "label": "Conversation closed",
        "hint": "Triggers when a conversation is closed."
      },
      "webhook": {
        "label": "Incoming Webhook",
        "hint": "Triggers via external webhook."
      },
      "schedule": {
        "label": "Schedule",
        "hint": "Runs on a regular schedule."
      }
    },
    "config": {
      "matchType": "Match type",
      "matchContains": "Contains any",
      "matchExact": "Exact match",
      "messageText": "Message Text",
      "placeholderMessageText": "Type your message here...",
      "tagLabel": "Tag",
      "modeLabel": "Assignment Mode",
      "modes": {
        "round_robin": "Round Robin",
        "specific": "Specific Agent"
      },
      "agentLabel": "Agent",
      "fieldLabel": "Field",
      "valueLabel": "Value",
      "placeholderValue": "New value...",
      "titleLabel": "Title",
      "amountLabel": "Amount",
      "unitLabel": "Unit",
      "units": {
        "minutes": "Minutes",
        "hours": "Hours",
        "days": "Days"
      },
      "subjectLabel": "Subject",
      "subjects": {
        "tag_presence": "Tag presence",
        "contact_field": "Contact field",
        "message_content": "Message content",
        "time_of_day": "Time of day"
      },
      "operandLabel": "Condition/Operand",
      "placeholderTime": "e.g. 09:00",
      "placeholderContact": "Field value",
      "placeholderTag": "Tag ID",
      "urlLabel": "Webhook URL",
      "bodyTemplateLabel": "Body JSON Template",
      "closeConversationHint": "Sets the conversation status to \"closed\". No configuration needed."
    }
  }
};

en.Automations = automationsEn;

const automationsEs = {
  "builder": {
    "tags": {
      "placeholder": "Selecciona una etiqueta",
      "select": "Seleccionar etiqueta",
      "unknown": "Etiqueta desconocida: {id}"
    },
    "fields": {
      "name": "Nombre",
      "email": "Correo electrónico",
      "company": "Empresa",
      "customFields": "Campos Personalizados",
      "unknown": "Campo desconocido: {id}"
    },
    "agents": {
      "placeholder": "Selecciona un agente",
      "select": "Seleccionar agente",
      "unknown": "Agente desconocido: {id}"
    },
    "pipelines": {
      "pipelineIdLabel": "ID del Embudo",
      "stageIdLabel": "ID de la Etapa",
      "pipelineLabel": "Embudo",
      "selectPipeline": "Seleccionar embudo",
      "unknownPipeline": "Embudo desconocido: {id}",
      "stageLabel": "Etapa",
      "selectStage": "Seleccionar etapa",
      "selectPipelineFirst": "Selecciona un embudo primero",
      "unknownStage": "Etapa desconocida: {id}"
    },
    "templates": {
      "templateNameLabel": "Nombre de la Plantilla",
      "languageLabel": "Idioma",
      "templateLabel": "Plantilla",
      "select": "Seleccionar plantilla",
      "unknown": "Plantilla desconocida: {name} ({lang})",
      "unknownLang": "Idioma desconocido"
    },
    "toasts": {
      "saveFailed": "Error al guardar",
      "saved": "Automatización guardada",
      "created": "Automatización creada"
    },
    "backToAutomations": "Volver a Automatizaciones",
    "untitled": "Automatización sin título",
    "active": "Activo",
    "activeAria": "Cambiar estado de activación",
    "save": "Guardar",
    "saveDraft": "Guardar Borrador",
    "trigger": "Disparador",
    "triggerType": "Tipo de disparador",
    "schedule": "Horario",
    "scheduleHint": "¿Cuándo debería ejecutarse?",
    "keywords": "Palabras clave (separadas por comas)",
    "keywordsHint": "precios, ayuda, comprar",
    "replyIds": "IDs de respuesta (separados por comas)",
    "replyIdsHint": "btn_si, btn_no",
    "replyIdsHelp": "Coincide con botones exactos o respuestas interactivas",
    "delete": "Eliminar",
    "addStep": "Agregar paso",
    "branches": {
      "yes": "Sí",
      "no": "No"
    },
    "steps": {
      "sendMessage": "Enviar Mensaje",
      "sendTemplate": "Enviar Plantilla",
      "addTag": "Agregar Etiqueta",
      "removeTag": "Quitar Etiqueta",
      "assignConversation": "Asignar Conversación",
      "unassignConversation": "Desasignar Conversación",
      "closeConversation": "Cerrar Conversación",
      "setContactField": "Establecer Campo de Contacto",
      "createDeal": "Crear Trato",
      "wait": "Esperar",
      "condition": "Condición",
      "webhook": "Webhook"
    },
    "triggers": {
      "new_message_received": {
        "label": "Nuevo mensaje recibido",
        "hint": "Se activa cuando se recibe cualquier mensaje entrante."
      },
      "keyword_match": {
        "label": "Coincidencia de palabras",
        "hint": "Se activa cuando el mensaje contiene palabras específicas."
      },
      "interactive_reply": {
        "label": "Respuesta interactiva",
        "hint": "Se activa cuando se recibe un botón o respuesta de lista específica."
      },
      "tag_added": {
        "label": "Etiqueta agregada",
        "hint": "Se activa cuando se agrega una etiqueta específica a un contacto."
      },
      "conversation_opened": {
        "label": "Conversación abierta",
        "hint": "Se activa cuando comienza una conversación."
      },
      "conversation_closed": {
        "label": "Conversación cerrada",
        "hint": "Se activa cuando se cierra una conversación."
      },
      "webhook": {
        "label": "Webhook entrante",
        "hint": "Se activa a través de un webhook externo."
      },
      "schedule": {
        "label": "Horario",
        "hint": "Se ejecuta en un horario regular."
      }
    },
    "config": {
      "matchType": "Tipo de coincidencia",
      "matchContains": "Contiene alguna",
      "matchExact": "Coincidencia exacta",
      "messageText": "Texto del Mensaje",
      "placeholderMessageText": "Escribe tu mensaje aquí...",
      "tagLabel": "Etiqueta",
      "modeLabel": "Modo de Asignación",
      "modes": {
        "round_robin": "Equitativo (Round Robin)",
        "specific": "Agente Específico"
      },
      "agentLabel": "Agente",
      "fieldLabel": "Campo",
      "valueLabel": "Valor",
      "placeholderValue": "Nuevo valor...",
      "titleLabel": "Título",
      "amountLabel": "Cantidad",
      "unitLabel": "Unidad",
      "units": {
        "minutes": "Minutos",
        "hours": "Horas",
        "days": "Días"
      },
      "subjectLabel": "Sujeto",
      "subjects": {
        "tag_presence": "Presencia de etiqueta",
        "contact_field": "Campo de contacto",
        "message_content": "Contenido del mensaje",
        "time_of_day": "Hora del día"
      },
      "operandLabel": "Condición/Operador",
      "placeholderTime": "ej. 09:00",
      "placeholderContact": "Valor del campo",
      "placeholderTag": "ID de la etiqueta",
      "urlLabel": "URL del Webhook",
      "bodyTemplateLabel": "Plantilla JSON del cuerpo",
      "closeConversationHint": "Establece el estado de la conversación como \"cerrado\". No requiere configuración."
    }
  }
};

es.Automations = automationsEs;

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Done patching messages.');
