"use client";

import { useEffect, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { OnboardingWidget } from "./onboarding-widget";
import { useAuth } from "@/hooks/use-auth";

export function HelpFloatingWidget() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  
  // To avoid hydration mismatch if using localStorage, we do it in useEffect
  useEffect(() => {
    const closedBefore = localStorage.getItem("onboarding_widget_closed");
    if (closedBefore) {
      setHasAutoOpened(true);
    }
  }, []);

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
    // Auto-open if they haven't finished onboarding and it hasn't auto-opened this session
    if (newProgress < 100 && !hasAutoOpened) {
      setOpen(true);
      setHasAutoOpened(true);
      localStorage.setItem("onboarding_widget_closed", "true");
    }
  };

  const isComplete = progress === 100;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 cursor-pointer group"
        aria-label="Abrir asistente de inicio"
      >
        {isComplete ? (
          <Info className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
        )}
        {progress !== null && progress < 100 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            !
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto pt-10 border-l border-zinc-200">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold tracking-tight text-zinc-900">
            {isComplete ? "Centro de Ayuda" : "Comienza aquí"}
          </SheetTitle>
          <SheetDescription className="text-zinc-500">
            {isComplete 
              ? "Encuentra recursos y contacta a soporte."
              : "Completa estos pasos clave para poner tu CRM en marcha y atender en automático."}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <OnboardingWidget onProgressChange={handleProgressChange} />

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">¿Necesitas soporte adicional?</h2>
            <p className="text-zinc-500 text-sm mb-4">
              Nuestro equipo está disponible 24/7 para ayudarte a configurar tus flujos y conectar tus canales.
            </p>
            <button className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-zinc-50 transition-colors">
              Contactar a Soporte
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
