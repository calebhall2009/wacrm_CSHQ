const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

if (!en.Automations.builder.steps.send_buttons) en.Automations.builder.steps.send_buttons = "Send Buttons";
if (!en.Automations.builder.steps.send_list) en.Automations.builder.steps.send_list = "Send List";
if (!en.Automations.builder.steps.update_contact_field) en.Automations.builder.steps.update_contact_field = "Update Contact Field";
if (!en.Automations.builder.steps.send_webhook) en.Automations.builder.steps.send_webhook = "Send Webhook";

if (!es.Automations.builder.steps.send_buttons) es.Automations.builder.steps.send_buttons = "Enviar Botones";
if (!es.Automations.builder.steps.send_list) es.Automations.builder.steps.send_list = "Enviar Lista";
if (!es.Automations.builder.steps.update_contact_field) es.Automations.builder.steps.update_contact_field = "Actualizar Campo de Contacto";
if (!es.Automations.builder.steps.send_webhook) es.Automations.builder.steps.send_webhook = "Enviar Webhook";

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Added missing step translations.');
