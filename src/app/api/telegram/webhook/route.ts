import { NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { findExistingContact } from '@/lib/contacts/dedupe'
import { dispatchWebhookEvent } from '@/lib/webhooks/deliver'

let _adminClient: any = null
function supabaseAdmin() {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _adminClient
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    await processTelegramWebhook(body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Telegram Webhook error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

async function processTelegramWebhook(update: any) {
  // We only handle standard messages for now
  if (!update.message) return

  const message = update.message
  if (!message.text) return // Only handle text messages for now

  const chatId = message.chat.id.toString()
  const contactName = message.from?.first_name || 'Telegram User'
  const text = message.text
  const messageId = message.message_id.toString()

  // Find the Telegram config
  const { data: config } = await supabaseAdmin()
    .from('whatsapp_config')
    .select('id, account_id, user_id')
    .eq('provider', 'telegram')
    .limit(1)
    .maybeSingle()

  if (!config) {
    console.warn('Received Telegram webhook but no Telegram provider config found')
    return
  }

  const accountId = config.account_id
  const userId = config.user_id

  // Find or Create Contact (using chat ID as phone)
  let contactRecord = await findExistingContact(supabaseAdmin(), accountId, chatId)
  
  if (!contactRecord) {
    const { data: newContact, error } = await supabaseAdmin()
      .from('contacts')
      .insert({
        account_id: accountId,
        user_id: userId,
        phone: chatId,
        name: contactName
      })
      .select()
      .single()

    if (error || !newContact) {
      console.error('Failed to create Telegram contact:', error)
      return
    }
    contactRecord = newContact
  }

  // Find or Create Conversation
  let conversation: any = null
  const { data: existingConv } = await supabaseAdmin()
    .from('conversations')
    .select('*')
    .eq('contact_id', contactRecord.id)
    .maybeSingle()

  if (existingConv) {
    conversation = existingConv
  } else {
    const { data: newConv, error } = await supabaseAdmin()
      .from('conversations')
      .insert({
        account_id: accountId,
        user_id: userId,
        contact_id: contactRecord.id,
        status: 'open',
        unread_count: 0
      })
      .select()
      .single()

    if (error || !newConv) {
      console.error('Failed to create Telegram conversation:', error)
      return
    }
    conversation = newConv

    await dispatchWebhookEvent(supabaseAdmin(), accountId, 'conversation.created', {
      conversation_id: conversation.id,
      contact_id: contactRecord.id,
    })
  }

  // Insert Message
  const { error: msgError } = await supabaseAdmin().from('messages').insert({
    conversation_id: conversation.id,
    sender_type: 'customer',
    content_type: 'text',
    content_text: text,
    message_id: messageId,
    status: 'delivered',
    created_at: new Date(message.date * 1000).toISOString()
  })

  if (msgError) {
    console.error('Failed to insert Telegram message:', msgError)
    return
  }

  // Update Conversation
  await supabaseAdmin()
    .from('conversations')
    .update({
      last_message_text: text,
      last_message_at: new Date().toISOString(),
      unread_count: (conversation.unread_count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversation.id)

  // Dispatch Webhook Event
  await dispatchWebhookEvent(supabaseAdmin(), accountId, 'message.received', {
    conversation_id: conversation.id,
    contact_id: contactRecord.id,
    message_type: 'text',
    message_text: text,
  })
}
