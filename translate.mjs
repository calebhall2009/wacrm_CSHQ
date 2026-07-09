import fs from 'fs/promises';
import { translate } from '@vitalets/google-translate-api';
import path from 'path';

async function traverseAndTranslate(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      console.log(`Translating section: ${key}...`);
      result[key] = await traverseAndTranslate(obj[key]);
    } else if (typeof obj[key] === 'string') {
      try {
        // Simple regex to protect variables like {count} or {mode}
        let original = obj[key];
        
        // Very basic protection for next-intl variables, replace {var} with <var> before translation
        let tempStr = original.replace(/\{([^}]+)\}/g, '<$1>');

        const res = await translate(tempStr, { to: 'es' });
        
        // Restore {var}
        let translatedStr = res.text.replace(/<([^>]+)>/g, '{$1}');
        
        // Minor fixes for common Next-intl plural formats if they get messed up
        // Next-intl plurals look like: {count, plural, =1 {message} other {messages}}
        if (original.includes(', plural,')) {
          // It's too complex to translate ICU messages safely with basic string translation.
          // For now, if it contains plural, we leave the outer structure and just translate it best effort or leave as is.
          console.warn(`Warning: Skipping complex ICU plural format for key: ${key}`);
          result[key] = original; // Safest fallback for complex ICU
          continue;
        }

        result[key] = translatedStr;
      } catch (err) {
        console.error(`Failed to translate key: ${key}, keeping original. Error: ${err.message}`);
        result[key] = obj[key];
      }
      // Add a small delay to prevent rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

async function main() {
  console.log("Starting translation...");
  const filePath = path.join(process.cwd(), 'messages', 'en.json');
  const outPath = path.join(process.cwd(), 'messages', 'es.json');
  
  const content = await fs.readFile(filePath, 'utf-8');
  const enData = JSON.parse(content);
  
  const esData = await traverseAndTranslate(enData);
  
  await fs.writeFile(outPath, JSON.stringify(esData, null, 2), 'utf-8');
  console.log("Translation complete! Saved to es.json.");
}

main().catch(console.error);
