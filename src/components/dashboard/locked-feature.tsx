import { Lock } from "lucide-react";
import { PricingModal } from "./pricing-modal";

interface LockedFeatureProps {
  isLocked: boolean;
  children: React.ReactNode;
  featureName: string;
}

export function LockedFeature({ isLocked, children, featureName }: LockedFeatureProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="blur-sm opacity-50 pointer-events-none p-4">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] p-4 text-center">
        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Función Premium</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Tu plan actual no permite el acceso a <strong>{featureName}</strong>. Actualiza tu cuenta para disfrutar de todas las herramientas.
        </p>
        <PricingModal>
          <button className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors">
            Ver planes
          </button>
        </PricingModal>
      </div>
    </div>
  );
}
