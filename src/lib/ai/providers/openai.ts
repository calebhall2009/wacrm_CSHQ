import { AiError, type ProviderResult } from '../types'
import { MAX_OUTPUT_TOKENS } from '../defaults'
import {
  mergeConsecutive,
  normalizeUsage,
  providerHttpError,
  toNetworkError,
  type ProviderArgs,
} from './shared'

const DEFAULT_OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface OpenAiResponse {
  choices?: { message?: { content?: string, tool_calls?: any[] } }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

/**
 * Call OpenAI's Chat Completions endpoint with the caller's own key.
 * Returns the raw assistant text + token usage (handoff parsing happens
 * in `generateReply`).
 */
export async function generateOpenAi(args: ProviderArgs): Promise<ProviderResult> {
  const { apiKey, model, systemPrompt, messages, timeoutMs, baseURL } = args

  const isGroq = !baseURL && (process.env.GROQ_API_KEY || model.includes('llama3') || model.includes('llama-3') || model.includes('mixtral'))
  const endpointUrl = baseURL ? `${baseURL.replace(/\/$/, '')}/chat/completions` : (isGroq ? GROQ_URL : DEFAULT_OPENAI_URL)
  const finalApiKey = isGroq && process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY : apiKey
  const finalModel = isGroq && !model.includes('llama') ? 'llama-3.1-8b-instant' : model

  let res: Response
  try {
    const bodyPayload: any = {
      model: finalModel,
      messages: [
        { role: 'system', content: systemPrompt },
        ...mergeConsecutive(messages),
      ],
      max_completion_tokens: MAX_OUTPUT_TOKENS,
    }
    if (args.tools && args.tools.length > 0) {
      bodyPayload.tools = args.tools
    }

    res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${finalApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    throw toNetworkError(err)
  }

  if (!res.ok) {
    throw await providerHttpError('OpenAI', res)
  }

  const data = (await res.json().catch(() => null)) as OpenAiResponse | null
  const message = data?.choices?.[0]?.message
  const text = message?.content ?? ''
  const tool_calls = message?.tool_calls

  if (!text.trim() && (!tool_calls || tool_calls.length === 0)) {
    throw new AiError('OpenAI returned an empty response.', {
      code: 'empty_response',
    })
  }

  const usage = normalizeUsage({
    prompt: data?.usage?.prompt_tokens,
    completion: data?.usage?.completion_tokens,
    total: data?.usage?.total_tokens,
  })
  return { text, usage, tool_calls }
}
