import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { engineSendText } from '@/lib/flows/meta-send'

// This endpoint should ideally be protected by a CRON secret in a real production app.
export async function GET(req: Request) {
  const cookieStore = cookies()
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
  const tomorrowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString()
  const tomorrowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString()

  // Find appointments roughly 24 hours from now
  const { data: appointments, error: queryErr } = await supabase
    .from('appointments')
    .select('*, contacts(id, phone)')
    .gte('date', tomorrowStart)
    .lte('date', tomorrowEnd)
    .eq('status', 'confirmed')

  if (queryErr) {
    if (queryErr.code === '42P01') {
      return NextResponse.json({ message: 'Table does not exist yet' }, { status: 200 })
    }
    return NextResponse.json({ error: queryErr.message }, { status: 500 })
  }

  let sent = 0
  for (const appt of appointments) {
    if (!appt.contact_id) continue

    try {
      // Find a conversation for this contact
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('contact_id', appt.contact_id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (!conv) continue

      // Find an owner for this account to use as the sending user
      const { data: member } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('account_id', appt.account_id)
        .limit(1)
        .single()

      if (!member) continue

      const timeString = new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const text = `¡Hola! Te recordamos que tienes una cita programada para mañana a las ${timeString}: "${appt.title}". ¡Te esperamos!`

      await engineSendText({
        accountId: appt.account_id,
        userId: member.user_id,
        conversationId: conv.id,
        contactId: appt.contact_id,
        text,
        aiGenerated: false
      })
      sent++
    } catch (e) {
      console.error('Error sending reminder for appt:', appt.id, e)
    }
  }

  return NextResponse.json({ 
    message: 'Reminders processed', 
    count: appointments.length, 
    sent 
  })
}
