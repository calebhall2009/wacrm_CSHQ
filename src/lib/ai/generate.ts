import {
  AiError,
  type AiConfig,
  type AiUsage,
  type ChatMessage,
  type GenerateResult,
} from './types'
import { HANDOFF_SENTINEL, aiRequestTimeoutMs } from './defaults'
import { generateOpenAi } from './providers/openai'
import { generateAnthropic } from './providers/anthropic'
import { generateGemini } from './providers/gemini'

export interface GenerateArgs {
  config: AiConfig
  /** Fully-built system prompt (see `buildSystemPrompt`). */
  systemPrompt: string
  /** Recent conversation turns, oldest first. */
  messages: ChatMessage[]
}

import { AI_TOOLS } from './tools'

/**
 * Generate the next reply from the account's configured provider.
 * Dispatches to the right adapter, then parses the handoff sentinel out
 * of the raw text. Throws `AiError` on any provider/network failure.
 */
export async function generateReply(args: GenerateArgs): Promise<GenerateResult> {
  const { config, systemPrompt, messages } = args
  const timeoutMs = aiRequestTimeoutMs()
  const providerArgs = {
    apiKey: config.apiKey,
    model: config.model,
    systemPrompt,
    messages,
    timeoutMs,
    tools: AI_TOOLS,
  }

  let result: { text: string; usage: AiUsage | null; tool_calls?: any[] }
  switch (config.provider) {
    case 'openai':
      result = await generateOpenAi(providerArgs)
      break
    case 'anthropic':
      result = await generateAnthropic(providerArgs)
      break
    case 'gemini':
      result = await generateGemini(providerArgs)
      break
    default:
      throw new AiError(`Unsupported AI provider: ${config.provider}`, {
        code: 'unsupported_provider',
        status: 400,
      })
  }

  const parsed = parseGeneration(result.text, result.usage)
    let tool_calls = result.tool_calls || []

    // Parse hallucinated or synthetic [TOOL_NAME={...}] syntax
    const syntheticRegex = /\[([A-Z_]+)\s*=\s*(.*?)\]/gi
    let match
    while ((match = syntheticRegex.exec(parsed.text)) !== null) {
      try {
        const toolName = match[1].toLowerCase()
        const argsStr = match[2].trim()
        JSON.parse(argsStr) // validate json
        tool_calls.push({
          id: `call_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          type: 'function',
          function: {
            name: toolName,
            arguments: argsStr
          }
        })
        parsed.text = parsed.text.replace(match[0], '').trim()
      } catch (err) {
        console.warn(`Failed to parse synthetic ${match[1]} json:`, err)
      }
    }

    return {
      ...parsed,
      tool_calls,
    }
}

/**
 * Split the raw model output into `{ text, handoff, usage }`. The
 * sentinel can appear alone or trailing a partial reply; either way we
 * treat the turn as a handoff and strip the marker from any remaining
 * text. `usage` is passed straight through (null when the provider
 * didn't report it).
 */
export function parseGeneration(
  raw: string,
  usage: AiUsage | null = null,
): GenerateResult {
  const handoff = raw.includes(HANDOFF_SENTINEL)
  let text = raw.split(HANDOFF_SENTINEL).join('')

  let scheduleDate: string | null = null
  const scheduleMatch = text.match(/\[SCHEDULE\((.*?)\)\]/i)
  if (scheduleMatch) {
    scheduleDate = scheduleMatch[1].trim()
    text = text.replace(scheduleMatch[0], '')
  }

  text = text.trim()
  return { text, handoff, scheduleDate, usage }
}
