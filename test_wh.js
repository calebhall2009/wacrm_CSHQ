const fetch = require('node-fetch');

const payload = {
  update_id: 123456789,
  message: {
    message_id: 1,
    from: {
      id: 1111111,
      is_bot: false,
      first_name: "TestUser",
      language_code: "en"
    },
    chat: {
      id: 1111111,
      first_name: "TestUser",
      type: "private"
    },
    date: Math.floor(Date.now() / 1000),
    text: "hola from test script"
  }
};

async function test() {
  const url = "https://wacrm-cshq-kzw8-jmrfr52ql-calebhall2009s-projects.vercel.app/api/telegram/webhook";
  console.log("Sending to", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
