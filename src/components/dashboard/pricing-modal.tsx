"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const WHATSAPP_NUMBER = "593980000000"; // Reemplaza con tu número de WhatsApp

const plans = [
  {
    name: "Emprendedor",
    price: "$79.99",
    description: "Para negocios con flujo diario pero aún pequeños.",
    features: [
      "2 Agentes de IA",
      "150 conversaciones por mes",
      "Límite Meta: 7,500 conversaciones",
      "Envíos masivos estándar",
      "Respuestas rápidas guardadas"
    ],
    buttonText: "Empezar ahora",
    popular: false
  },
  {
    name: "Emprendedor Plus",
    price: "$149.99",
    description: "Para negocios que venden y hacen seguimiento diario.",
    features: [
      "Múltiples agentes de IA avanzados",
      "1,500 conversaciones por mes",
      "Límite Meta: 7,500 conversaciones",
      "Calendario propio y entrenamiento de IA (sube PDFs o fotos)",
      "Soporte prioritario vía WhatsApp"
    ],
    buttonText: "Empezar ahora",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$299.99",
    description: "Para empresas con altos volúmenes de ventas o equipos.",
    features: [
      "Agentes de IA ilimitados",
      "5,000 conversaciones por mes",
      "Límite Meta: 7,500 - 30,000+",
      "Acompañamiento 1 a 1",
      "Integraciones personalizadas premium"
    ],
    buttonText: "Contactar a ventas",
    popular: false
  }
];

export function PricingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleSelectPlan = (planName: string) => {
    const text = encodeURIComponent(`Hola, quiero actualizar mi plan a ${planName} en el CRM. Mi cuenta es:`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[1100px] sm:max-w-[1100px] max-h-[90vh] overflow-y-auto p-0 bg-slate-50 border-border text-foreground shadow-xl rounded-2xl">
        <div className="px-6 py-8 text-center bg-white border-b">
          <DialogTitle className="text-3xl font-bold">Mejora tu plan hoy</DialogTitle>
          <DialogDescription className="text-lg mt-2 text-muted-foreground">
            Desbloquea el potencial completo de tu CRM con Inteligencia Artificial.
          </DialogDescription>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-6 bg-white rounded-2xl border-2 transition-all hover:shadow-xl ${
                plan.popular ? 'border-primary shadow-lg lg:scale-105 z-10' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                    ⭐ Más Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-slate-500 font-medium">/mes</span>
              </div>
              
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-6 text-base font-semibold ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md' 
                    : 'bg-background border-2 border-primary text-primary hover:bg-primary/5'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
