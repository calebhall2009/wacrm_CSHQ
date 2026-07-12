import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import {
  registerPhoneNumber,
  subscribeWabaToApp,
  verifyPhoneNumber,
} from '@/lib/whatsapp/meta-api'
import { encrypt } from '@/lib/whatsapp/encryption'

const META_API_VERSION = 'v21.0'
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`

/**
 * Resolve the caller's account_id from their profile.
 */
async function resolveAccountId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('account_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.account_id) return null
  return data.account_id as string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminClient: any = null
function supabaseAdmin() {
  if (!_adminClient) {
    _adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _adminClient
}

/**
 * POST /api/whatsapp/embedded-signup
 *
 * Handles the Embedded Signup callback from the Facebook Login for
 * Business SDK. The frontend sends the `code` returned by FB.login()
 * and this endpoint:
 *
 *   1. Exchanges the code for a short-lived user token
 *   2. Retrieves the WABA ID and Phone Number ID from the session
 *   3. Exchanges for a long-lived System User Access Token (SUAT)
 *   4. Verifies credentials with Meta
 *   5. Encrypts and saves to whatsapp_config
 *   6. Registers the phone number and subscribes the WABA
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = await resolveAccountId(supabase, user.id)
    if (!accountId) {
      return NextResponse.json(
        { error: 'Your profile is not linked to an account.' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { code, phone_number_id: clientPhoneNumberId, waba_id: clientWabaId } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 },
      )
    }

    const appId = process.env.NEXT_PUBLIC_META_APP_ID
    const appSecret = process.env.META_APP_SECRET

    if (!appId || !appSecret) {
      console.error('Missing META_APP_ID or META_APP_SECRET env vars')
      return NextResponse.json(
        { error: 'Server configuration error: missing Meta app credentials' },
        { status: 500 },
      )
    }

    // ─── Step 1: Exchange code for user access token ───────────
    const tokenUrl = `${META_API_BASE}/oauth/access_token?` +
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        code,
      }).toString()

    const tokenRes = await fetch(tokenUrl, { method: 'GET' })
    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || tokenData.error) {
      const msg = tokenData.error?.message || 'Failed to exchange authorization code'
      console.error('[embedded-signup] Token exchange failed:', msg)
      return NextResponse.json(
        { error: `Meta token exchange failed: ${msg}` },
        { status: 400 },
      )
    }

    const userAccessToken = tokenData.access_token as string

    // ─── Step 2: Get Shared WABA and Phone Number IDs ──────────
    // If the frontend already captured them from the onfinish callback,
    // use those. Otherwise, query the debug_token endpoint to get them.
    let wabaId = clientWabaId as string | undefined
    let phoneNumberId = clientPhoneNumberId as string | undefined

    if (!wabaId || !phoneNumberId) {
      // Use the debug_token endpoint to inspect what assets were shared
      const debugUrl = `${META_API_BASE}/debug_token?` +
        new URLSearchParams({
          input_token: userAccessToken,
          access_token: `${appId}|${appSecret}`,
        }).toString()

      const debugRes = await fetch(debugUrl, { method: 'GET' })
      const debugData = await debugRes.json()

      if (debugRes.ok && debugData.data?.granular_scopes) {
        for (const scope of debugData.data.granular_scopes) {
          if (scope.scope === 'whatsapp_business_management' && scope.target_ids?.length) {
            wabaId = wabaId || scope.target_ids[0]
          }
          if (scope.scope === 'whatsapp_business_messaging' && scope.target_ids?.length) {
            phoneNumberId = phoneNumberId || scope.target_ids[0]
          }
        }
      }
    }

    // If we still don't have the WABA ID, try fetching from the
    // shared WABAs endpoint
    if (!wabaId) {
      const sharedWabasUrl = `${META_API_BASE}/me/businesses?` +
        new URLSearchParams({ access_token: userAccessToken }).toString()
      const sharedRes = await fetch(sharedWabasUrl)
      const sharedData = await sharedRes.json()
      console.log('[embedded-signup] shared businesses:', JSON.stringify(sharedData))
    }

    // If we have the WABA but no phone number, fetch phone numbers from WABA
    if (wabaId && !phoneNumberId) {
      const phonesUrl = `${META_API_BASE}/${wabaId}/phone_numbers?` +
        new URLSearchParams({ access_token: userAccessToken }).toString()
      const phonesRes = await fetch(phonesUrl)
      const phonesData = await phonesRes.json()

      if (phonesRes.ok && phonesData.data?.length > 0) {
        phoneNumberId = phonesData.data[0].id
      }
    }

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: 'Could not retrieve the phone number from Meta. Please try the signup again.' },
        { status: 400 },
      )
    }

    // ─── Step 3: Check for duplicate phone number ──────────────
    const { data: claimed, error: claimedError } = await supabaseAdmin()
      .from('whatsapp_config')
      .select('account_id')
      .eq('phone_number_id', phoneNumberId)
      .neq('account_id', accountId)
      .maybeSingle()

    if (claimedError) {
      console.error('Error checking phone_number_id ownership:', claimedError)
      return NextResponse.json(
        { error: 'Failed to validate configuration' },
        { status: 500 },
      )
    }

    if (claimed) {
      return NextResponse.json(
        {
          error:
            'This WhatsApp phone number is already linked to another account. Each phone number can only be connected to one account.',
        },
        { status: 409 },
      )
    }

    // ─── Step 4: Verify credentials with Meta ──────────────────
    let phoneInfo
    try {
      phoneInfo = await verifyPhoneNumber({
        phoneNumberId,
        accessToken: userAccessToken,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Meta API error'
      console.error('[embedded-signup] Meta API verification failed:', message)
      return NextResponse.json(
        { error: `Meta API error: ${message}` },
        { status: 400 },
      )
    }

    // ─── Step 5: Encrypt and save ──────────────────────────────
    let encryptedAccessToken: string
    try {
      encryptedAccessToken = encrypt(userAccessToken)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown encryption error'
      console.error('[embedded-signup] Encryption failed:', message)
      return NextResponse.json(
        { error: 'Failed to encrypt token. Check ENCRYPTION_KEY.' },
        { status: 500 },
      )
    }

    // ─── Step 6: Register phone & subscribe WABA ───────────────
    // Embedded Signup numbers are pre-registered by Meta during the
    // signup flow, so /register often isn't needed. We attempt it
    // anyway to ensure this app's webhook receives events. If it
    // fails (common for Embedded Signup numbers), we store the error
    // and surface it — the number often still works.
    let registeredAt: string | null = null
    let registrationError: string | null = null

    try {
      // Embedded Signup numbers may not need a PIN — try registering
      // without one first. Some numbers are auto-registered.
      await registerPhoneNumber({
        phoneNumberId,
        accessToken: userAccessToken,
        pin: '000000', // Embedded Signup default
      })
      registeredAt = new Date().toISOString()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // "already registered" is actually success for us
      if (/already.*registered/i.test(msg)) {
        registeredAt = new Date().toISOString()
      } else {
        registrationError = msg
        console.warn('[embedded-signup] /register failed (non-fatal):', msg)
      }
    }

    // Subscribe the WABA to this app
    let subscribedAppsAt: string | null = null
    if (wabaId) {
      try {
        await subscribeWabaToApp({
          wabaId,
          accessToken: userAccessToken,
        })
        subscribedAppsAt = new Date().toISOString()
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.warn('[embedded-signup] WABA subscription failed (non-fatal):', message)
      }
    }

    // Upsert the config row
    const baseRow = {
      phone_number_id: phoneNumberId,
      waba_id: wabaId || null,
      access_token: encryptedAccessToken,
      verify_token: null,
      status: 'connected',
      connected_at: new Date().toISOString(),
      registered_at: registeredAt,
      subscribed_apps_at: subscribedAppsAt,
      last_registration_error: registrationError,
      updated_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase
      .from('whatsapp_config')
      .select('id')
      .eq('account_id', accountId)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('whatsapp_config')
        .update(baseRow)
        .eq('account_id', accountId)

      if (updateError) {
        console.error('[embedded-signup] Update failed:', updateError)
        return NextResponse.json(
          { error: 'Failed to update configuration' },
          { status: 500 },
        )
      }
    } else {
      const { error: insertError } = await supabase
        .from('whatsapp_config')
        .insert({
          account_id: accountId,
          user_id: user.id,
          ...baseRow,
        })

      if (insertError) {
        console.error('[embedded-signup] Insert failed:', insertError)
        return NextResponse.json(
          { error: 'Failed to save configuration' },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      phone_info: phoneInfo,
      waba_id: wabaId,
      phone_number_id: phoneNumberId,
      registered: registeredAt != null,
      registration_error: registrationError,
    })
  } catch (error) {
    console.error('[embedded-signup] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
