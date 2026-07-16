import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { loadAiConfig } from '@/lib/ai/config'
import { generateReply } from '@/lib/ai/generate'
import { getCurrentAccount } from '@/lib/auth/account'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    
    // Check auth to get account id
    const { accountId } = await getCurrentAccount()

    // 1. Get Conversation
    const { data: conv, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id, account_id, status')
      .eq('id', conversationId)
      .eq('account_id', accountId)
      .single()

    if (convError || !conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // 2. Load recent messages
    const { data: messages, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('sender_type, content_text')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(30) // last 30 messages should be enough to capture sentiment
      
    if (msgError || !messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages to summarize' }, { status: 400 })
    }

    // format messages
    const formattedMessages = messages.reverse().map(m => {
      const role = m.sender_type === 'customer' ? 'Customer' : 'Agent'
      return `${role}: ${m.content_text || '[media]'}`
    }).join('\n')

    // 3. Load AI Config
    const aiConfig = await loadAiConfig(supabaseAdmin, conv.account_id)
    if (!aiConfig?.apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 400 })
    }

    // 4. Prompt for Summary and Sentiment
    const systemPrompt = `You are an expert sales analyst. 
Analyze the following conversation and return a JSON object with two fields:
1. "summary": A brief 1-2 sentence summary of what the customer wants and the outcome.
2. "sentiment": A single string representing the sales temperature/sentiment. Choose EXACTLY one of: "Frio", "Tibio", "Caliente".

Conversation:
${formattedMessages}`

    // 5. Generate
    // Instead of forcing JSON mode on all providers, we just ask for valid JSON.
    const response = await generateReply({
      config: aiConfig,
      systemPrompt,
      messages: [{ role: 'user', content: 'Generate the JSON analysis. Reply ONLY with valid JSON.' }]
    })
    
    const text = response.text || ''
    
    // Extract JSON in case the model added markdown blocks
    let parsed: { summary: string; sentiment: string }
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      console.error('Failed to parse AI output', text)
      return NextResponse.json({ error: 'Failed to generate valid summary format' }, { status: 500 })
    }
    
    // Fallback normalization
    const allowedSentiments = ['Frio', 'Tibio', 'Caliente']
    if (!allowedSentiments.includes(parsed.sentiment)) {
      if (parsed.sentiment.toLowerCase().includes('cal')) parsed.sentiment = 'Caliente'
      else if (parsed.sentiment.toLowerCase().includes('tib')) parsed.sentiment = 'Tibio'
      else parsed.sentiment = 'Frio'
    }

    // 6. Save to Supabase
    // If migration 050 was not run, this might fail. We'll handle gracefully.
    const { error: updateError } = await supabaseAdmin
      .from('conversations')
      .update({
        summary: parsed.summary,
        sentiment: parsed.sentiment
      })
      .eq('id', conversationId)
      
    if (updateError) {
      console.error('Failed to save summary, did you run migration 050?', updateError)
      // Return success anyway to show in UI, but alert that DB failed
      return NextResponse.json({ 
        ...parsed, 
        _dbError: updateError.message 
      })
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
