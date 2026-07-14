import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Twilio webhook format is application/x-www-form-urlencoded
// Need a raw route to handle the incoming request.

export async function POST(req: Request) {
  try {
    const textBody = await req.text();
    const formData = new URLSearchParams(textBody);

    const from = formData.get('From'); // e.g. "whatsapp:+14155238886"
    const to = formData.get('To');     // e.g. "whatsapp:+1234567890"
    const body = formData.get('Body');
    const mediaUrl0 = formData.get('MediaUrl0');
    const mediaContentType0 = formData.get('MediaContentType0');
    const messageSid = formData.get('MessageSid');
    const accountSid = formData.get('AccountSid');

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing From or To' }, { status: 400 });
    }

    const fromPhone = from.replace('whatsapp:', '');
    const toPhone = to.replace('whatsapp:', '');

    // Get the admin supabase client to find the account based on Twilio Account SID
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find the whatsapp_config matching the twilio_account_sid
    const { data: config, error: configError } = await supabaseAdmin
      .from('whatsapp_config')
      .select('account_id')
      .eq('twilio_account_sid', accountSid)
      .eq('provider', 'twilio')
      .maybeSingle();

    if (configError || !config) {
      console.error('Twilio webhook: No account found for accountSid', accountSid);
      return NextResponse.json({ success: true }); // Acknowledge Twilio anyway to avoid retries
    }

    const accountId = config.account_id;

    // 2. Find or create the contact based on 'From'
    let { data: contact, error: contactError } = await supabaseAdmin
      .from('contacts')
      .select('id, name')
      .eq('account_id', accountId)
      .eq('phone', fromPhone)
      .maybeSingle();

    if (!contact) {
      const { data: newContact, error: insertContactError } = await supabaseAdmin
        .from('contacts')
        .insert({
          account_id: accountId,
          phone: fromPhone,
          name: fromPhone,
        })
        .select('id, name')
        .single();
      
      if (insertContactError || !newContact) {
        throw new Error('Failed to create contact');
      }
      contact = newContact;
    }

    // 3. Find or create the conversation
    let { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('account_id', accountId)
      .eq('contact_id', contact.id)
      .maybeSingle();

    if (!conversation) {
      const { data: newConv, error: insertConvError } = await supabaseAdmin
        .from('conversations')
        .insert({
          account_id: accountId,
          contact_id: contact.id,
          status: 'open',
          unread_count: 0,
        })
        .select('id')
        .single();
      
      if (insertConvError || !newConv) {
        throw new Error('Failed to create conversation');
      }
      conversation = newConv;
    }

    // 4. Save the incoming message
    const messageType = mediaUrl0 ? (mediaContentType0?.includes('video') ? 'video' : 'image') : 'text';

    const { error: messageInsertError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'customer',
        sender_id: contact.id,
        status: 'delivered',
        content_type: messageType,
        content_text: body,
        media_url: mediaUrl0 || null,
        message_id: messageSid,
      });

    if (messageInsertError) {
      console.error('Error inserting Twilio message:', messageInsertError);
    } else {
      // Update unread count
      await supabaseAdmin.rpc('increment_unread_count', {
        conv_id: conversation.id,
      });
    }

    // TODO: Ideally trigger AI / flows here, but for testing UI display is enough.
    // Flow/AI logic is normally triggered via webhooks handlers which are heavily Meta specific.
    // For now this provides basic incoming message routing for Sandbox testing.

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Twilio Webhook Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
