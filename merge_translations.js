const fs = require('fs');

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const esPath = 'messages/es.json';
const translatedPath = 'translated.json';

const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
const translated = JSON.parse(fs.readFileSync(translatedPath, 'utf8'));

const merged = deepMerge(es, translated);

fs.writeFileSync(esPath, JSON.stringify(merged, null, 2) + '\n');
console.log('Successfully merged translated.json into es.json!');
