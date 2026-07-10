"use client";

import { useAuth } from "@/hooks/use-auth";
import { PricingModal } from "./pricing-modal";

export function PlanWidget() {
  const { account } = useAuth();
  
  // Fake calculation for days left (demo purposes)
  const daysLeft = 3;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
        <span className="font-medium text-foreground">
          Plan Actual: <strong>Período de prueba</strong>.
        </span>
        <span className="text-muted-foreground">
          Le quedan {daysLeft} días gratis.
        </span>
      </div>
      <div className="mt-3 sm:mt-0">
        <PricingModal>
          <span className="text-primary hover:text-primary/80 font-semibold underline decoration-2 underline-offset-2 cursor-pointer">
            Ver planes
          </span>
        </PricingModal>
      </div>
    </div>
  );
}
