export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    })
  })
  
  const result = await response.json()
  
  if (!result.ok) {
    console.error('Telegram send message failed:', result)
    throw new Error(result.description || 'Failed to send Telegram message')
  }
  
  return {
    messageId: result.result.message_id.toString()
  }
}
