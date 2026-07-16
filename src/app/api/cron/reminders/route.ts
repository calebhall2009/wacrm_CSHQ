import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { engineSendText } from '@/lib/flows/meta-send'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() { /* Service role ignores cookies */ }
      }
    }
  )

  const now = new Date()
  
  // To use the free 24-hour window, we look for conversations where the last message 
  // was between 23 and 23.5 hours ago. (This cron should run every 30 minutes).
  const windowStart = new Date(now.getTime() - 23.5 * 60 * 60 * 1000).toISOString()
  const windowEnd = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString()

  // Find conversations closing soon
  const { data: conversations, error: queryErr } = await supabase
    .from('conversations')
    .select('id, contact_id, account_id, last_message_at')
    .gte('last_message_at', windowStart)
    .lte('last_message_at', windowEnd)

  if (queryErr) {
    return NextResponse.json({ error: queryErr.message }, { status: 500 })
  }

  let sent = 0
  for (const conv of conversations) {
    if (!conv.contact_id) continue

    try {
      // Check if this contact has an upcoming appointment in the future
      const { data: upcomingAppts } = await supabase
        .from('appointments')
        .select('*')
        .eq('contact_id', conv.contact_id)
        .gte('start_time', now.toISOString())
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true })
        .limit(1)

      if (!upcomingAppts || upcomingAppts.length === 0) continue
      
      const appt = upcomingAppts[0]

      // Find an owner for this account to use as the sending user
      const { data: member } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('account_id', conv.account_id)
        .limit(1)
        .single()

      if (!member) continue

      const dateString = new Date(appt.start_time).toLocaleDateString()
      const timeString = new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const text = `¡Hola! Aprovechamos para recordarte que tienes una cita programada para el ${dateString} a las ${timeString}: "${appt.title}". ¡Te esperamos!`

      await engineSendText({
        accountId: conv.account_id,
        userId: member.user_id,
        conversationId: conv.id,
        contactId: conv.contact_id,
        text,
        aiGenerated: false
      })
      sent++
    } catch (e) {
      console.error('Error sending reminder for conv:', conv.id, e)
    }
  }

  return NextResponse.json({ 
    message: 'Window-based reminders processed', 
    count: conversations.length, 
    sent 
  })
}
