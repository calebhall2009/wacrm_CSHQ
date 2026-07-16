"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  onProgressChange?: (progress: number) => void;
}

export function OnboardingWidget({ onProgressChange }: Props) {
  const { accountId } = useAuth();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [isAgentConfigured, setIsAgentConfigured] = useState(false);
  const [isChannelConnected, setIsChannelConnected] = useState(false);
  const [hasContacts, setHasContacts] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    
    let isMounted = true;

    async function checkStatus() {
      try {
        // Check AI config
        const res = await fetch('/api/ai/config');
        const aiData = await res.json().catch(() => ({}));
        if (isMounted) setIsAgentConfigured(!!aiData?.configured);

        // Check channel connection
        const { data: config } = await supabase
          .from('whatsapp_config')
          .select('registered_at, telegram_bot_token')
          .eq('account_id', accountId)
          .maybeSingle();
          
        if (isMounted) {
          setIsChannelConnected(!!config?.registered_at || !!config?.telegram_bot_token);
        }

        // Check contacts
        const { count } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true });
          
        if (isMounted) {
          setHasContacts((count || 0) > 0);
        }
      } catch (err) {
        console.error("Failed to check onboarding status", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [accountId, supabase]);

  const steps = [
    {
      id: 1,
      title: "Conectar Canal",
      desc: "Vincula tu WhatsApp o Telegram a la plataforma.",
      href: "/settings",
      isCompleted: isChannelConnected,
      buttonText: "Ir a Configuración"
    },
    {
      id: 2,
      title: "Configurá tu agente",
      desc: "Definí el nombre, personalidad e instrucciones de tu asistente IA.",
      href: "/agents",
      isCompleted: isAgentConfigured,
      buttonText: "Ir a Mis Agentes"
    },
    {
      id: 3,
      title: "Subir contactos (Opcional)",
      desc: "Sube tu base de datos y comienza a vender en automático.",
      href: "/contacts",
      isCompleted: hasContacts,
      buttonText: "Subir lista"
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  useEffect(() => {
    if (!loading && onProgressChange) {
      onProgressChange(progress);
    }
  }, [progress, loading, onProgressChange]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm flex justify-center items-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Si ya completó todo y no estamos forzando la vista (ej. en el sheet igual se ve)
  // Dejaremos que el contenedor decida si ocultarlo o no. 
  // Pero aquí lo mostraremos siempre para que sirva de checklist.

  return (
    <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Primeros Pasos</h2>
          <p className="text-muted-foreground text-sm mt-1">Sigue esta guía para activar tu cuenta.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end">
          <span className="text-xs font-bold text-slate-500 tracking-wider mb-1">PROGRESO {progress}%</span>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${step.isCompleted ? 'border-green-100 bg-green-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                {step.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${step.isCompleted ? 'text-slate-700 line-through' : 'text-slate-900'}`}>{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 ml-10 sm:ml-0">
              <Link href={step.href} className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${step.isCompleted ? 'text-green-600 hover:text-green-700' : 'text-slate-600 hover:text-slate-900'}`}>
                {step.isCompleted ? 'Completado' : step.buttonText}
                {!step.isCompleted && <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
