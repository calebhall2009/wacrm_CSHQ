const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

if (!en.Automations.edit) {
  en.Automations.edit = {
    "loadError": "Failed to load automation (Status: {status})",
    "back": "Back to Automations"
  };
}

if (!es.Automations.edit) {
  es.Automations.edit = {
    "loadError": "Error al cargar la automatización (Estado: {status})",
    "back": "Volver a Automatizaciones"
  };
}

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Added edit namespace.');
