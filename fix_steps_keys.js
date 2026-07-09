const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

function fixSteps(lang) {
  if (lang.Automations && lang.Automations.builder && lang.Automations.builder.steps) {
    const steps = lang.Automations.builder.steps;
    steps.send_message = steps.sendMessage || steps.send_message;
    steps.send_template = steps.sendTemplate || steps.send_template;
    steps.add_tag = steps.addTag || steps.add_tag;
    steps.remove_tag = steps.removeTag || steps.remove_tag;
    steps.assign_conversation = steps.assignConversation || steps.assign_conversation;
    steps.unassign_conversation = steps.unassignConversation || steps.unassign_conversation;
    steps.close_conversation = steps.closeConversation || steps.close_conversation;
    steps.set_contact_field = steps.setContactField || steps.set_contact_field;
    steps.create_deal = steps.createDeal || steps.create_deal;
    
    // delete old ones
    delete steps.sendMessage;
    delete steps.sendTemplate;
    delete steps.addTag;
    delete steps.removeTag;
    delete steps.assignConversation;
    delete steps.unassignConversation;
    delete steps.closeConversation;
    delete steps.setContactField;
    delete steps.createDeal;
  }
}

fixSteps(en);
fixSteps(es);

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('messages/es.json', JSON.stringify(es, null, 2) + '\n');
console.log('Fixed step keys.');
