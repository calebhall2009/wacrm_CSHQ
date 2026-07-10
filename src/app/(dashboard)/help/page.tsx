"use client";

import { OnboardingWidget } from "@/components/dashboard/onboarding-widget";

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Centro de Ayuda</h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra guías y pasos para configurar tu cuenta al 100%.
        </p>
      </div>

      <OnboardingWidget />

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">¿Necesitas soporte adicional?</h2>
        <p className="text-blue-800 text-sm mb-4">
          Nuestro equipo está disponible 24/7 para ayudarte a configurar tus flujos y conectar tus canales.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Contactar a Soporte
        </button>
      </div>
    </div>
  );
}
