"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

export function OnboardingWidget() {
  const steps = [
    {
      id: 1,
      title: "Configurá tu agente",
      desc: "Definí el nombre, personalidad e instrucciones de tu asistente IA.",
      href: "/agents",
      isCompleted: true,
      buttonText: "Ir a Mis Agentes"
    },
    {
      id: 2,
      title: "Conectá WhatsApp",
      desc: "Vinculá tu número de WhatsApp Business en menos de 10 minutos.",
      href: "/settings",
      isCompleted: false,
      buttonText: "Ver guía"
    },
    {
      id: 3,
      title: "Subir contactos",
      desc: "Sube tu base de datos y comienza a vender en automático.",
      href: "/contacts",
      isCompleted: false,
      buttonText: "Subir lista"
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Primeros Pasos</h2>
          <p className="text-muted-foreground text-sm mt-1">Automatizá la atención de tus clientes con inteligencia artificial.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end">
          <span className="text-xs font-bold text-slate-500 tracking-wider mb-1">TU PROGRESO {progress}%</span>
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
          <div key={step.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                {step.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 ml-10 sm:ml-0">
              <Link href={step.href} className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {step.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
