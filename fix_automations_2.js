const fs = require('fs');

// 1. Fix en.json and es.json toasts
const enPath = 'messages/en.json';
const esPath = 'messages/es.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

if (!en.Automations.builder.toasts) {
  en.Automations.builder.toasts = {
    saved: "Automation saved",
    created: "Automation created",
    saveFailed: "Save failed"
  };
}
if (!es.Automations.builder.toasts) {
  es.Automations.builder.toasts = {
    saved: "Automatización guardada",
    created: "Automatización creada",
    saveFailed: "Error al guardar"
  };
}

// Write back
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync(esPath, JSON.stringify(es, null, 2) + '\n');
console.log('Fixed locales.');

// 2. Fix templates.ts corruption
let templates = fs.readFileSync('src/lib/automations/templates.ts', 'utf8');

// Replace corrupted welcome_message strings
templates = templates.replace(/Respuesta autom.*tica con un saludo a los contactos nuevos\./g, "Respuesta automática con un saludo a los contactos nuevos.");
templates = templates.replace(/¡Hola!.*Gracias por contactarnos\. Te responderemos en breve\./g, "¡Hola! 👋 Gracias por contactarnos. Te responderemos en breve.");

// Replace corrupted out_of_office strings
templates = templates.replace(/Respuesta autom.*tica fuera de horario para que nadie se quede esperando\./g, "Respuesta automática fuera de horario para que nadie se quede esperando.");
templates = templates.replace(/¡Gracias por tu mensaje! Nuestro equipo est.* desconectado en este momento \(9am.*6pm\) y te responderemos a primera hora ma.*ana\./g, "¡Gracias por tu mensaje! Nuestro equipo está desconectado en este momento (9am-6pm) y te responderemos a primera hora mañana.");

// Replace corrupted lead_qualifier strings
templates = templates.replace(/Haz preguntas de calificaci.*n para filtrar prospectos entrantes\./g, "Haz preguntas de calificación para filtrar prospectos entrantes.");
templates = templates.replace(/¡Genial!.*Estaremos encantados de ayudarte\. Una pregunta r.*pida:.*aproximadamente qu.* cantidad buscas\?/g, "¡Genial! 📝 Estaremos encantados de ayudarte. Una pregunta rápida: ¿aproximadamente qué cantidad buscas?");

// Replace corrupted follow_up_reminder strings
templates = templates.replace(/Env.*a un recordatorio si un contacto no ha respondido en 24 horas\./g, "Envía un recordatorio si un contacto no ha respondido en 24 horas.");
templates = templates.replace(/Solo pasaba a preguntar\.\.\. .*tienes alguna otra consulta para nosotros\? .*Estaremos encantados de ayudarte!/g, "Solo pasaba a preguntar... ¿tienes alguna otra consulta para nosotros? ¡Estaremos encantados de ayudarte!");

fs.writeFileSync('src/lib/automations/templates.ts', templates);
console.log('Fixed templates.ts.');
