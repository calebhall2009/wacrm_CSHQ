'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  AlertTriangle,
  RotateCcw,
  LogIn,
  Unplug,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SettingsPanelHead } from './settings-panel-head';
import type { WhatsAppConfig as WhatsAppConfigType } from '@/types';

type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';

// Declare the FB global from the Facebook SDK
declare global {
  interface Window {
    FB?: {
      init: (params: Record<string, unknown>) => void;
      login: (
        callback: (response: FBLoginResponse) => void,
        options: Record<string, unknown>,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface FBLoginResponse {
  authResponse?: {
    code?: string;
    accessToken?: string;
    userID?: string;
  } | null;
  status?: string;
}

export function WhatsAppConfig() {
  const t = useTranslations('Settings.whatsapp');
  const supabase = createClient();
  const { user, accountId, loading: authLoading, profileLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfigType | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [fbSdkLoaded, setFbSdkLoaded] = useState(false);

  const loadedAccountIdRef = useRef<string | null>(null);

  const isRegistered = Boolean(config?.registered_at);
  const lastRegistrationError = config?.last_registration_error ?? null;

  const [verifyingRegistration, setVerifyingRegistration] = useState(false);
  type RegistrationProbe = {
    live: boolean;
    checks: Record<string, boolean | null>;
    errors?: string[];
  };
  const [registrationProbe, setRegistrationProbe] =
    useState<RegistrationProbe | null>(null);

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/whatsapp/webhook`
      : '';

  // ─── Load Facebook SDK ─────────────────────────────────────
  useEffect(() => {
    // Don't load if already loaded
    if (window.FB) {
      setFbSdkLoaded(true);
      return;
    }

    // Don't load if we don't have the app ID
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    if (!appId) {
      console.warn('NEXT_PUBLIC_META_APP_ID not set, Embedded Signup disabled');
      return;
    }

    window.fbAsyncInit = function () {
      window.FB!.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      });
      setFbSdkLoaded(true);
    };

    // Load the SDK script
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existing = document.getElementById('facebook-jssdk');
      if (existing) existing.remove();
    };
  }, []);

  // ─── Fetch existing config ─────────────────────────────────
  const fetchConfig = useCallback(async (acctId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('account_id', acctId)
        .maybeSingle();

      if (error) {
        console.error('Failed to load config row:', error);
      }

      if (data) {
        setConfig(data);
      } else {
        setConfig(null);
      }

      setRegistrationProbe(null);

      // Health check
      if (data) {
        try {
          const res = await fetch('/api/whatsapp/config', { method: 'GET' });
          const payload = await res.json();

          if (payload.connected) {
            setConnectionStatus('connected');
            setStatusMessage('');
          } else {
            setConnectionStatus('disconnected');
            setStatusMessage(payload.message || '');
          }
        } catch (err) {
          console.error('Health check failed:', err);
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
        setStatusMessage('');
      }
    } catch (err) {
      console.error('fetchConfig error:', err);
      toast.error('Failed to load WhatsApp configuration');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user || !accountId) {
      loadedAccountIdRef.current = null;
      setLoading(false);
      return;
    }
    if (loadedAccountIdRef.current === accountId) return;
    loadedAccountIdRef.current = accountId;
    fetchConfig(accountId);
  }, [authLoading, profileLoading, user?.id, accountId, fetchConfig]);

  // ─── Embedded Signup handler ───────────────────────────────
  function handleEmbeddedSignup() {
    if (!window.FB) {
      toast.error('Facebook SDK not loaded. Please refresh the page.');
      return;
    }

    const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID;
    if (!configId) {
      toast.error('Embedded Signup is not configured. Missing Config ID.');
      return;
    }

    setConnecting(true);

    // Facebook requires HTTPS for FB.login
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
      toast.error(
        'Facebook Login requires HTTPS. Run the dev server with: npm run dev -- --experimental-https',
        { duration: 10000 },
      );
      setConnecting(false);
      return;
    }

    window.FB.login(
      async (response: FBLoginResponse) => {
        if (!response.authResponse?.code) {
          setConnecting(false);
          if (response.status === 'unknown') {
            // User closed the popup without completing
            return;
          }
          toast.error('Facebook login was cancelled or failed.');
          return;
        }

        const code = response.authResponse.code;

        try {
          // Send the code to our backend
          const res = await fetch('/api/whatsapp/embedded-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const data = await res.json();

          if (!res.ok) {
            toast.error(data.error || 'Failed to connect WhatsApp');
            setConnecting(false);
            return;
          }

          if (data.success) {
            const name = data.phone_info?.verified_name || data.phone_info?.display_phone_number;
            toast.success(
              name
                ? `✅ WhatsApp connected — ${name}`
                : '✅ WhatsApp connected successfully!',
            );

            if (data.registration_error) {
              toast.warning(
                `Note: Phone registration had an issue: ${data.registration_error}. Messages may still work.`,
                { duration: 8000 },
              );
            }

            // Refresh config state
            if (accountId) await fetchConfig(accountId);
          }
        } catch (err) {
          console.error('Embedded signup error:', err);
          toast.error('An unexpected error occurred during setup.');
        } finally {
          setConnecting(false);
        }
      },
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '3',
        },
      },
    );
  }

  // ─── Verify registration ───────────────────────────────────
  async function handleVerifyRegistration() {
    setVerifyingRegistration(true);
    setRegistrationProbe(null);
    try {
      const res = await fetch('/api/whatsapp/config/verify-registration', {
        method: 'GET',
      });
      const data = (await res.json()) as RegistrationProbe;
      setRegistrationProbe(data);
      if (data.live) {
        toast.success('Number is fully wired — Meta is delivering events.');
      } else {
        toast.error(
          'Number is not fully registered. See the checks below.',
          { duration: 8000 },
        );
      }
      if (accountId) await fetchConfig(accountId);
    } catch (err) {
      console.error('verify-registration failed:', err);
      toast.error('Could not reach the verification endpoint.');
    } finally {
      setVerifyingRegistration(false);
    }
  }

  // ─── Test connection ───────────────────────────────────────
  const [testing, setTesting] = useState(false);

  async function handleTestConnection() {
    try {
      setTesting(true);
      const res = await fetch('/api/whatsapp/config', { method: 'GET' });
      const payload = await res.json();

      if (payload.connected) {
        setConnectionStatus('connected');
        setStatusMessage('');
        toast.success(
          payload.phone_info?.verified_name
            ? `Connected to ${payload.phone_info.verified_name}`
            : 'API connection successful',
        );
      } else {
        setConnectionStatus('disconnected');
        setStatusMessage(payload.message || '');
        toast.error(payload.message || 'API connection failed');
      }
    } catch (err) {
      console.error('Test connection error:', err);
      setConnectionStatus('disconnected');
      toast.error('Connection test failed.');
    } finally {
      setTesting(false);
    }
  }

  // ─── Reset (disconnect) ────────────────────────────────────
  async function handleReset() {
    if (!confirm('This will disconnect WhatsApp from your account. Continue?')) {
      return;
    }

    try {
      setResetting(true);
      const res = await fetch('/api/whatsapp/config', { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to disconnect');
        return;
      }

      toast.success('WhatsApp disconnected. You can reconnect anytime.');
      setConfig(null);
      setConnectionStatus('disconnected');
      setStatusMessage('');
      setRegistrationProbe(null);
    } catch (err) {
      console.error('Reset error:', err);
      toast.error('Failed to disconnect');
    } finally {
      setResetting(false);
    }
  }

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <section className="animate-in fade-in-50 duration-200">
        <SettingsPanelHead
          title={t("title")}
          description={t("description")}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // ─── NOT CONNECTED — Show Embedded Signup ──────────────────
  if (!config) {
    return (
      <section className="animate-in fade-in-50 duration-200">
        <SettingsPanelHead
          title={t("title")}
          description={t("description")}
        />
        <div className="max-w-xl space-y-6">
          {/* Status */}
          <Alert className="bg-card border-border">
            <div className="flex items-center gap-2">
              <XCircle className="size-4 text-red-500" />
              <AlertTitle className="text-foreground mb-0">
                {t('notConnected')}
              </AlertTitle>
            </div>
            <AlertDescription className="text-muted-foreground">
              {t('notConnectedDesc')}
            </AlertDescription>
          </Alert>

          {/* Connect Card */}
          <Card className="border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <svg viewBox="0 0 48 48" className="size-9" fill="none">
                  <path
                    d="M24 4C12.954 4 4 12.954 4 24c0 3.535.922 6.855 2.539 9.74L4.004 43.32a1 1 0 0 0 1.226 1.227l9.58-2.535A19.908 19.908 0 0 0 24 44c11.046 0 20-8.954 20-20S35.046 4 24 4Z"
                    fill="#25D366"
                  />
                  <path
                    d="M34.59 28.94c-.58-.29-3.43-1.69-3.96-1.88-.53-.2-.92-.29-1.31.29-.39.58-1.5 1.88-1.84 2.27-.34.39-.68.44-1.26.15-.58-.29-2.44-.9-4.65-2.87-1.72-1.53-2.88-3.42-3.22-4-.34-.58-.04-.9.25-1.19.26-.26.58-.68.87-1.02.29-.34.39-.58.58-.97.2-.39.1-.73-.05-1.02-.15-.29-1.31-3.16-1.79-4.33-.47-1.14-.95-1-.31-.99h-.02c-.34-.02-.73-.04-1.12-.04-.39 0-1.02.15-1.55.73-.53.58-2.03 1.98-2.03 4.84s2.08 5.61 2.37 6 4.09 6.25 9.92 8.76c1.39.6 2.47.96 3.31 1.23 1.39.44 2.66.38 3.66.23 1.12-.17 3.43-1.4 3.91-2.76.49-1.36.49-2.52.34-2.76-.15-.24-.53-.39-1.12-.68Z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <CardTitle className="text-foreground text-xl">
                Connect WhatsApp
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Sign in with your Facebook account to connect your WhatsApp Business number. The process takes less than a minute.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-2">
              <Button
                onClick={handleEmbeddedSignup}
                disabled={connecting || !fbSdkLoaded}
                size="lg"
                className="w-full max-w-xs bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-base h-12 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
              >
                {connecting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="size-5" />
                    Sign in with Facebook
                  </>
                )}
              </Button>
              {!fbSdkLoaded && (
                <p className="text-xs text-muted-foreground animate-pulse">
                  Loading Facebook SDK...
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center max-w-sm">
                You&apos;ll be asked to select your WhatsApp Business Account and phone number. We only request the permissions needed to send and receive messages on your behalf.
              </p>
            </CardContent>
          </Card>

          {/* Webhook Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground text-sm">{t('webhookTitle')}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                {t('webhookDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-xs text-muted-foreground font-mono break-all">
                  {webhookUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookUrl);
                    toast.success('Webhook URL copied');
                  }}
                  className="shrink-0 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // ─── CONNECTED — Show status & management ──────────────────
  return (
    <section className="animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title={t("title")}
        description={t("description")}
      />
      <div className="max-w-xl space-y-6">
        {/* Connection Status */}
        <Alert className="bg-card border-border">
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <CheckCircle2 className="size-4 text-primary" />
            ) : (
              <XCircle className="size-4 text-red-500" />
            )}
            <AlertTitle className="text-foreground mb-0">
              {connectionStatus === 'connected' ? t('credentialsValid') : t('notConnected')}
            </AlertTitle>
          </div>
          <AlertDescription className="text-muted-foreground">
            {connectionStatus === 'connected'
              ? t('connectedDesc')
              : statusMessage || t('notConnectedDesc')}
          </AlertDescription>
        </Alert>

        {/* Registration Status */}
        <Alert
          className={
            isRegistered
              ? 'bg-emerald-950/30 border-emerald-700/50'
              : 'bg-amber-950/30 border-amber-700/50'
          }
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {isRegistered ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="size-4 text-amber-400" />
              )}
              <AlertTitle
                className={
                  'mb-0 ' + (isRegistered ? 'text-emerald-200' : 'text-amber-200')
                }
              >
                {isRegistered ? t('registered') : t('notRegistered')}
              </AlertTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerifyRegistration}
              disabled={verifyingRegistration}
              className="border-border bg-transparent text-foreground hover:bg-muted h-7"
            >
              {verifyingRegistration ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Zap className="size-3.5" />
              )}
              {t('verifyWithMeta')}
            </Button>
          </div>
          <AlertDescription className="text-muted-foreground mt-2 text-xs leading-relaxed">
            {isRegistered ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: t('subscribedSince', {
                    date: config.registered_at
                      ? new Date(config.registered_at).toLocaleString()
                      : t('unknownDate'),
                  }),
                }}
              />
            ) : lastRegistrationError ? (
              <>
                {t('lastAttemptFailed')}
                <span className="text-red-300">
                  &quot;{lastRegistrationError}&quot;
                </span>
                . {t('retryHint')}
              </>
            ) : (
              <>{t('noRegistrationHint')}</>
            )}
          </AlertDescription>

          {registrationProbe && (
            <div className="mt-3 rounded border border-border bg-card/60 px-3 py-2 space-y-1.5 text-[11px]">
              <p className="font-medium text-foreground">
                {t('diagnosticLastRun')}
                <span className={registrationProbe.live ? 'text-emerald-400' : 'text-amber-400'}>
                  {registrationProbe.live ? t('live') : t('notLive')}
                </span>
              </p>
              <ul className="space-y-0.5 text-muted-foreground">
                {Object.entries(registrationProbe.checks).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-1.5">
                    {v === true ? (
                      <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                    ) : v === false ? (
                      <XCircle className="size-3 text-red-400 shrink-0" />
                    ) : (
                      <span className="size-3 rounded-full border border-border shrink-0" />
                    )}
                    <code className="text-muted-foreground">{k}</code>
                  </li>
                ))}
              </ul>
              {(registrationProbe.errors ?? []).length > 0 && (
                <ul className="pt-1 space-y-0.5 text-red-300">
                  {registrationProbe.errors?.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Alert>

        {/* Connected Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-sm">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground">Phone Number ID</span>
              <code className="text-foreground font-mono text-xs">{config.phone_number_id}</code>

              {config.waba_id && (
                <>
                  <span className="text-muted-foreground">WABA ID</span>
                  <code className="text-foreground font-mono text-xs">{config.waba_id}</code>
                </>
              )}

              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${config.status === 'connected' ? 'text-emerald-400' : 'text-red-400'}`}>
                {config.status === 'connected' ? '● Connected' : '○ Disconnected'}
              </span>

              {config.connected_at && (
                <>
                  <span className="text-muted-foreground">Connected since</span>
                  <span className="text-foreground text-xs">
                    {new Date(config.connected_at).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {testing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('testing')}
              </>
            ) : (
              <>
                <Zap className="size-4" />
                {t('testConnection')}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            disabled={resetting}
            className="border-red-900 text-red-400 hover:text-red-300 hover:bg-red-950/40"
          >
            {resetting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Unplug className="size-4" />
                Disconnect WhatsApp
              </>
            )}
          </Button>
        </div>

        {/* Reconnect option */}
        <Card className="border-dashed border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Need to switch to a different WhatsApp number? Disconnect first, then reconnect with the new account.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEmbeddedSignup}
              disabled={connecting || !fbSdkLoaded}
              className="text-primary hover:text-primary/80"
            >
              {connecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCcw className="size-4" />
              )}
              Reconnect with different account
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
