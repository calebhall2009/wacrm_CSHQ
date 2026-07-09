const fs = require('fs');
const path = require('path');

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return target;
}

const enPath = path.join(__dirname, 'messages', 'en.json');
const esPath = path.join(__dirname, 'messages', 'es.json');

try {
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));

  const mergedData = deepMerge(enData, esData);

  // Add the specific quick-replies translation that was missing
  if (mergedData.Settings && mergedData.Settings.sections) {
    mergedData.Settings.sections['quick-replies'] = 'Respuestas rápidas';
  }

  fs.writeFileSync(esPath, JSON.stringify(mergedData, null, 2));
  console.log('es.json has been deep merged with en.json to fix missing keys.');
} catch (err) {
  console.error('Error during merge:', err);
}
