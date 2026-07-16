const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));

const missing = {};
let count = 0;

function findMissing(enObj, esObj, path = []) {
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      findMissing(enObj[key], esObj?.[key] || {}, [...path, key]);
    } else {
      const enVal = enObj[key];
      const esVal = esObj?.[key];
      // If it's missing or exactly the same as English (and not a very short universal word like 'URL' or 'ID')
      if (esVal === undefined || (esVal === enVal && enVal.length > 3 && !enVal.match(/^[A-Z0-9]+$/))) {
        let current = missing;
        for (let i = 0; i < path.length; i++) {
          if (!current[path[i]]) current[path[i]] = {};
          current = current[path[i]];
        }
        current[key] = enVal;
        count++;
      }
    }
  }
}

findMissing(en, es);
fs.writeFileSync('missing.json', JSON.stringify(missing, null, 2));
console.log(`Found ${count} untranslated or missing keys.`);
