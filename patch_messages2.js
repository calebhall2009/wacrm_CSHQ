const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

en.Automations.page = {
  "title": "Automations",
  "subtitle": "Create flows that run automatically based on events.",
  "create": "Create automation",
  "templatesTitle": "Templates",
  "emptyTitle": "No automations yet",
  "emptyDesc": "Create your first automation to save time and streamline your workflow.",
  "deleteTitle": "Delete automation?",
  "deleteDesc": "Are you sure you want to delete '{name}'? This action cannot be undone.",
  "cancel": "Cancel",
  "delete": "Delete",
  "runs": "{count} run",
  "runsPlural": "{count} runs",
  "lastRun": "Last run: {time}",
  "deactivate": "Deactivate",
  "activate": "Activate",
  "edit": "Edit",
  "duplicate": "Duplicate",
  "viewLogs": "View logs",
  "retry": "Retry",
  "toasts": {
    "updateError": "Failed to update",
    "activated": "Automation activated",
    "paused": "Automation paused",
    "duplicateError": "Failed to duplicate",
    "duplicated": "Automation duplicated",
    "deleteError": "Failed to delete",
    "deleted": "Automation deleted"
  }
};

es.Automations.page = {
  "title": "Automatizaciones",
  "subtitle": "Crea flujos que se ejecutan automáticamente basados en eventos.",
  "create": "Crear automatización",
  "templatesTitle": "Plantillas",
  "emptyTitle": "Aún no hay automatizaciones",
  "emptyDesc": "Crea tu primera automatización para ahorrar tiempo y optimizar tu flujo de trabajo.",
  "deleteTitle": "¿Eliminar automatización?",
  "deleteDesc": "¿Estás seguro de que quieres eliminar '{name}'? Esta acción no se puede deshacer.",
  "cancel": "Cancelar",
  "delete": "Eliminar",
  "runs": "{count} ejecución",
  "runsPlural": "{count} ejecuciones",
  "lastRun": "Última ejecución: {time}",
  "deactivate": "Desactivar",
  "activate": "Activar",
  "edit": "Editar",
  "duplicate": "Duplicar",
  "viewLogs": "Ver registros",
  "retry": "Reintentar",
  "toasts": {
    "updateError": "Error al actualizar",
    "activated": "Automatización activada",
    "paused": "Automatización pausada",
    "duplicateError": "Error al duplicar",
    "duplicated": "Automatización duplicada",
    "deleteError": "Error al eliminar",
    "deleted": "Automatización eliminada"
  }
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Done patching automations page.');
