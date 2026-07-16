import type { ChatMessage } from './types'

/** Longest the quoted customer message runs before we ellipsize it —
 *  keeps the internal note to a glanceable one-liner. */
const MAX_QUOTE_LEN = 160

/**
 * Build the short internal note the auto-reply bot leaves on a
 * conversation when it hands off to a human. Deterministic — composed
 * from context we already have (no extra LLM call / token spend), so it
 * can't fail or add latency to the handoff.
 *
 * Reads as, e.g.:
 *   "🤖 AI agent handed off after 2 replies. Last customer message:
 *    “can I speak to a manager about my refund?”"
 *
 * `replyCount` is the bot's auto-reply tally for the thread (0 when it
 * bailed on the very first inbound without answering).
 */
export function buildHandoffSummary(args: {
  messages: ChatMessage[]
  replyCount: number
}): string {
  const { messages, replyCount } = args

  // Extract up to 3 most recent customer messages.
  const customerMessages = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content ?? '')
    .filter((c) => c.trim().length > 0)

  let synopsis = ''
  if (customerMessages.length > 0) {
    const lastCustomer = customerMessages[customerMessages.length - 1]
    const quote = truncate(lastCustomer.trim(), MAX_QUOTE_LEN)
    synopsis = `Last customer message: “${quote}”`
  }

  return [
    `🤖 AI agent handed off after ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}.`,
    synopsis,
  ]
    .filter(Boolean)
    .join('\n')
}

function truncate(text: string, max: number): string {
  const collapsed = text.replace(/\s+/g, ' ')
  if (collapsed.length <= max) return collapsed
  return `${collapsed.slice(0, max - 1).trimEnd()}…`
}
