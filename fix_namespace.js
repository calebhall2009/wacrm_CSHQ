const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

if (en.Automations && en.Automations.page) {
  en.Automations.list = en.Automations.page;
  delete en.Automations.page;
}

if (es.Automations && es.Automations.page) {
  es.Automations.list = es.Automations.page;
  delete es.Automations.page;
}

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Done fixing namespace.');
