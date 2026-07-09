const fs = require('fs');
const path = require('path');

const esPath = path.join(__dirname, 'messages', 'es.json');
const data = JSON.parse(fs.readFileSync(esPath, 'utf8'));

if (data.Broadcasts) {
  if (data.Broadcasts.new) {
    data.Broadcasts.new.title = "Nueva Difusión";
    data.Broadcasts.new.subtitle = "Crea y envía un mensaje masivo a tus contactos.";
    data.Broadcasts.new.steps = {
      template: "Plantilla",
      audience: "Audiencia",
      personalize: "Personalizar",
      send: "Enviar"
    };
  }
  if (data.Broadcasts.wizard) {
    data.Broadcasts.wizard.next = "Siguiente";
    data.Broadcasts.wizard.back = "Atrás";
    data.Broadcasts.wizard.cancel = "Cancelar";
    
    if (data.Broadcasts.wizard.chooseTemplate) {
      data.Broadcasts.wizard.chooseTemplate.title = "Elige una Plantilla";
      data.Broadcasts.wizard.chooseTemplate.subtitle = "Selecciona una plantilla de mensaje aprobada para tu difusión.";
      data.Broadcasts.wizard.chooseTemplate.noTemplates = "No hay plantillas disponibles.";
      data.Broadcasts.wizard.chooseTemplate.createFirst = "Crea una plantilla en Ajustes primero.";
    }
  }
}

fs.writeFileSync(esPath, JSON.stringify(data, null, 2));
console.log('es.json updated with New Broadcast translations.');
