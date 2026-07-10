"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { OnboardingWidget } from "./onboarding-widget";

export function HelpFloatingWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95 cursor-pointer">
          <Info className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            2
          </span>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto pt-10">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Centro de Ayuda</SheetTitle>
        </SheetHeader>
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">
            Encuentra guías y pasos para configurar tu cuenta al 100%.
          </p>
          {/* We reuse the same onboarding widget but it might need to adapt to narrow spaces, though it's responsive */}
          <OnboardingWidget />

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">¿Necesitas soporte adicional?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Nuestro equipo está disponible 24/7 para ayudarte a configurar tus flujos y conectar tus canales.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors w-full">
              Contactar a Soporte
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
