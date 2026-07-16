async function run() {
  const res = await fetch('http://localhost:3000/api/telegram/webhook', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      update_id: 12345,
      message: {
        message_id: 1,
        from: { id: 111222, is_bot: false, first_name: 'Test' },
        chat: { id: 111222, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: 'Hello'
      }
    })
  });
  console.log(res.status, await res.text());
}
run();
