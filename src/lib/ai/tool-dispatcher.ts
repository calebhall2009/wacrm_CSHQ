import { SupabaseClient } from '@supabase/supabase-js'

export async function dispatchToolCall(
  db: SupabaseClient,
  accountId: string,
  contactId: string,
  toolCall: { name: string; arguments: string }
): Promise<string> {
  try {
    const args = JSON.parse(toolCall.arguments)

    switch (toolCall.name) {
      case 'check_availability': {
        const { date } = args
        // date is YYYY-MM-DD
        const startDate = new Date(`${date}T00:00:00Z`)
        const endDate = new Date(`${date}T23:59:59Z`)

        const { data: appointments, error } = await db
          .from('appointments')
          .select('title, start_time, end_time')
          .eq('account_id', accountId)
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString())
          .order('start_time', { ascending: true })

        if (error) {
          return JSON.stringify({ error: `Failed to check calendar: ${error.message}` })
        }

        if (!appointments || appointments.length === 0) {
          return JSON.stringify({ success: true, message: `The calendar is completely free on ${date}.` })
        }

        const busySlots = appointments.map(a => `- ${new Date(a.start_time).toLocaleTimeString()} to ${new Date(a.end_time).toLocaleTimeString()} (${a.title})`).join('\n')
        
        return JSON.stringify({ 
          success: true, 
          message: `The following time slots are already booked on ${date}:\n${busySlots}\n\nAny time outside of these slots is available.` 
        })
      }

      case 'book_appointment': {
        const { title, start_time, notes } = args
        let { end_time } = args
        
        // Default end time to 1 hour after start if missing
        if (!end_time) {
          const start = new Date(start_time)
          start.setHours(start.getHours() + 1)
          end_time = start.toISOString()
        }

        // Check for conflicts
        const { data: conflicts, error: conflictErr } = await db
          .from('appointments')
          .select('id')
          .eq('account_id', accountId)
          .lt('start_time', end_time)
          .gt('end_time', start_time)
          .limit(1)

        if (conflictErr) {
          return JSON.stringify({ error: `Failed to check conflicts: ${conflictErr.message}` })
        }

        if (conflicts && conflicts.length > 0) {
          return JSON.stringify({ error: `Conflict: The time slot from ${start_time} to ${end_time} is already booked. Please ask the user for a different time.` })
        }

        // Fetch contact to get name and phone
        const { data: contact } = await db
          .from('contacts')
          .select('name, phone')
          .eq('id', contactId)
          .single()

        if (!contact) {
          return JSON.stringify({ error: 'Contact not found' })
        }

        const { error: apptError } = await db.from('appointments').insert({
          account_id: accountId,
          contact_id: contactId,
          title: title,
          start_time: start_time,
          end_time: end_time,
          notes: notes,
          status: 'scheduled',
          customer_name: contact.name || 'Unknown',
          customer_phone: contact.phone || ''
        })

        if (apptError) {
          return JSON.stringify({ error: `Failed to book appointment: ${apptError.message}` })
        }
        return JSON.stringify({ success: true, message: `Appointment '${title}' booked successfully.` })
      }

      case 'update_deal_stage': {
        const { stage_name, deal_value, notes } = args
        
        // Find existing pipeline stage by name
        const { data: stages } = await db
          .from('pipeline_stages')
          .select('id')
          .eq('account_id', accountId)
          .ilike('name', stage_name)
          .limit(1)

        if (!stages || stages.length === 0) {
          return JSON.stringify({ error: `Pipeline stage '${stage_name}' not found.` })
        }

        const stageId = stages[0].id

        // Try to find existing deal for this contact
        const { data: deals } = await db
          .from('deals')
          .select('id')
          .eq('account_id', accountId)
          .eq('contact_id', contactId)
          .limit(1)

        if (deals && deals.length > 0) {
          // Update existing deal
          const { error: updateErr } = await db.from('deals').update({
            stage_id: stageId,
            value: deal_value !== undefined ? deal_value : undefined,
            notes: notes !== undefined ? notes : undefined
          }).eq('id', deals[0].id)
          
          if (updateErr) {
            return JSON.stringify({ error: `Failed to update deal: ${updateErr.message}` })
          }
          return JSON.stringify({ success: true, message: `Deal updated to stage '${stage_name}'.` })
        } else {
          // Create new deal
          // Need to find a pipeline to attach it to, use the stage's pipeline
          const { data: stageInfo } = await db
            .from('pipeline_stages')
            .select('pipeline_id')
            .eq('id', stageId)
            .single()
            
          if (!stageInfo) {
             return JSON.stringify({ error: 'Could not determine pipeline_id' })
          }

          const { error: insertErr } = await db.from('deals').insert({
            account_id: accountId,
            pipeline_id: stageInfo.pipeline_id,
            stage_id: stageId,
            contact_id: contactId,
            title: 'New Deal',
            value: deal_value || 0,
            notes: notes
          })

          if (insertErr) {
             return JSON.stringify({ error: `Failed to create deal: ${insertErr.message}` })
          }
          return JSON.stringify({ success: true, message: `New deal created in stage '${stage_name}'.` })
        }
      }


      case 'update_contact': {
        const { name, email, company } = args
        const updates: any = {}
        if (name) updates.name = name
        if (email) updates.email = email
        if (company) updates.company = company
        
        if (Object.keys(updates).length > 0) {
          const { error } = await db.from('contacts').update(updates).eq('id', contactId)
          if (error) return JSON.stringify({ error: `Failed to update contact: ${error.message}` })
        }
        return JSON.stringify({ success: true, message: 'Contact updated successfully.' })
      }

      case 'add_tag': {
        const { tag } = args
        if (!tag) return JSON.stringify({ error: 'Tag name is required.' })
        
        // 1. Find or create tag
        let tagId: string
        const { data: existingTags } = await db.from('tags').select('id').eq('account_id', accountId).ilike('name', tag).limit(1)
        if (existingTags && existingTags.length > 0) {
          tagId = existingTags[0].id
        } else {
          const { data: newTag, error: newTagErr } = await db.from('tags').insert({ account_id: accountId, name: tag, color: '#e2e8f0' }).select('id').single()
          if (newTagErr || !newTag) return JSON.stringify({ error: `Failed to create tag: ${newTagErr?.message}` })
          tagId = newTag.id
        }

        // 2. Link tag to contact
        const { error: linkErr } = await db.from('contact_tags').insert({ contact_id: contactId, tag_id: tagId }).select('id').maybeSingle()
        // Ignore unique constraint violation if they already have the tag
        if (linkErr && linkErr.code !== '23505') {
           return JSON.stringify({ error: `Failed to link tag: ${linkErr.message}` })
        }

        return JSON.stringify({ success: true, message: `Tag '${tag}' added to contact.` })
      }

      case 'add_internal_note': {
        const { note } = args
        if (!note) return JSON.stringify({ error: 'Note content is required.' })

        // Get the account's user to link the note (or just use a bot identifier, but we need user_id as per schema).
        // Let's find the contact's user_id
        const { data: contact } = await db.from('contacts').select('user_id').eq('id', contactId).single()
        if (!contact) return JSON.stringify({ error: 'Contact not found.' })

        const { error } = await db.from('contact_notes').insert({
          contact_id: contactId,
          user_id: contact.user_id,
          note_text: `[AI Note] ${note}`
        })
        
        if (error) return JSON.stringify({ error: `Failed to add note: ${error.message}` })
        return JSON.stringify({ success: true, message: 'Internal note added.' })
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolCall.name}` })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return JSON.stringify({ error: `Tool execution failed: ${msg}` })
  }
}
