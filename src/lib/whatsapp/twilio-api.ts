import type {
  MetaSendResult,
} from './meta-api';

interface TwilioBaseArgs {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  to: string;
}

export interface TwilioSendTextArgs extends TwilioBaseArgs {
  text: string;
}

export interface TwilioSendMediaArgs extends TwilioBaseArgs {
  mediaUrl: string;
  caption?: string;
  mimeType?: string;
}

/**
 * Basic Twilio API wrapper for sending WhatsApp messages.
 */
export async function sendTextMessage(args: TwilioSendTextArgs): Promise<MetaSendResult> {
  const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber, to, text } = args;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  
  const fromWhatsApp = twilioPhoneNumber.startsWith('whatsapp:') ? twilioPhoneNumber : `whatsapp:${twilioPhoneNumber}`;
  const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:+${to.replace('+', '')}`;

  const body = new URLSearchParams();
  body.append('To', toWhatsApp);
  body.append('From', fromWhatsApp);
  body.append('Body', text);

  const authHeader = `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Twilio API Error: ${data.message || response.statusText}`);
  }

  return { messageId: data.sid };
}

export async function sendMediaMessage(args: TwilioSendMediaArgs): Promise<MetaSendResult> {
  const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber, to, mediaUrl, caption } = args;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  
  const fromWhatsApp = twilioPhoneNumber.startsWith('whatsapp:') ? twilioPhoneNumber : `whatsapp:${twilioPhoneNumber}`;
  const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:+${to.replace('+', '')}`;

  const body = new URLSearchParams();
  body.append('To', toWhatsApp);
  body.append('From', fromWhatsApp);
  if (caption) {
    body.append('Body', caption);
  }
  body.append('MediaUrl', mediaUrl);

  const authHeader = `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Twilio API Error: ${data.message || response.statusText}`);
  }

  return { messageId: data.sid };
}

// Unsupported mappings (stubbed to prevent crashing where they are used)

export async function sendTemplateMessage(): Promise<MetaSendResult> {
  throw new Error("Templates are not supported with the Twilio provider in this sandbox implementation.");
}

export async function sendReactionMessage(): Promise<MetaSendResult> {
  throw new Error("Reactions are not supported with the Twilio provider.");
}

export async function sendInteractiveButtons(): Promise<MetaSendResult> {
  throw new Error("Interactive buttons are not supported with the Twilio provider.");
}

export async function sendInteractiveList(): Promise<MetaSendResult> {
  throw new Error("Interactive lists are not supported with the Twilio provider.");
}
