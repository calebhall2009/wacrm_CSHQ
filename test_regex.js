const text = `Tienes tu reserva confirmada. [BOOK_APPPOINTMENT={"title":"Reserva para el 21 de julio","start_time":"2026-07-21T20:00:00Z","end_time":"2026-07-21T21:30:00Z"}]`;

let parsed = { text };
let tool_calls = [];
const syntheticRegex = /\[([A-Z_]+)\s*=\s*(.*?)\]/gi;
let match;
while ((match = syntheticRegex.exec(parsed.text)) !== null) {
  try {
    const toolName = match[1].toLowerCase();
    const argsStr = match[2].trim();
    console.log("Found toolName:", toolName);
    console.log("argsStr:", argsStr);
    JSON.parse(argsStr);
    parsed.text = parsed.text.replace(match[0], '').trim();
    console.log("Parsed success!");
  } catch (err) {
    console.warn(`Failed to parse synthetic ${match[1]} json:`, err);
  }
}

console.log("FINAL TEXT:", parsed.text);
