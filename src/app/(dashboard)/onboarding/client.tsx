"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { submitOnboarding, skipOnboarding } from "./actions";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function OnboardingWizard({ initialName }: { initialName: string }) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: initialName,
    phone: "",
    role: "",
    companyName: "",
    industry: "",
    description: "",
    website: "",
    useCase: "",
    channelsWhatsApp: false,
    channelsInstagram: false,
    teamSize: "",
    createAI: true,
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.role) {
        alert("Por favor, completa todos los campos obligatorios de este paso.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.companyName.trim() || !formData.industry || !formData.description.trim()) {
        alert("Por favor, completa el nombre de la empresa, industria y descripción.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.useCase || !formData.teamSize) {
        alert("Por favor, selecciona un caso de uso y el tamaño del equipo.");
        return;
      }
    }
    setStep(s => Math.min(4, s + 1));
  };
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitOnboarding(formData);
      if (res.error) {
        alert("Error saving: " + res.error);
        setLoading(false);
        return;
      }
      
      // Update local profile state
      await refreshProfile();
      
      // Navigate to agents
      router.push("/agents?tab=setup");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const res = await skipOnboarding();
      if (res.error) {
        alert("Error: " + res.error);
        setLoading(false);
        return;
      }
      await refreshProfile();
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Configura tu cuenta en HallConnect
          </CardTitle>
          <div className="flex items-center justify-between mt-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted -z-10" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 bg-card px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {i}
                </div>
                <span className={`text-sm hidden sm:block ${step >= i ? 'font-medium' : 'text-muted-foreground'}`}>
                  {i === 1 ? 'Ustedes' : i === 2 ? 'Negocio' : i === 3 ? 'Uso' : 'Listo'}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Sobre ustedes</h3>
                <p className="text-sm text-muted-foreground">Empecemos con lo básico. Sus datos quedan privados.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre completo *</Label>
                  <Input value={formData.fullName} onChange={e => updateForm("fullName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono *</Label>
                  <Input placeholder="+593 9 1234 5678" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Su rol en la empresa *</Label>
                  <Select value={formData.role} onValueChange={v => updateForm("role", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionen una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dueño / Fundador">Dueño / Fundador</SelectItem>
                      <SelectItem value="Gerente / Director">Gerente / Director</SelectItem>
                      <SelectItem value="Vendedor / Comercial">Vendedor / Comercial</SelectItem>
                      <SelectItem value="Agencia / Consultor">Agencia / Consultor</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Su negocio</h3>
                <p className="text-sm text-muted-foreground">Estos datos arman el contexto del agente: cuanto más claros, mejor responde.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre de la empresa *</Label>
                  <Input placeholder="Ej: Tech Solutions Corp" value={formData.companyName} onChange={e => updateForm("companyName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Industria / Rubro *</Label>
                  <Select value={formData.industry} onValueChange={v => updateForm("industry", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionen su rubro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Servicios profesionales">Servicios profesionales</SelectItem>
                      <SelectItem value="Salud y bienestar">Salud y bienestar</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Inmobiliaria">Inmobiliaria</SelectItem>
                      <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                      <SelectItem value="Tecnología / Software">Tecnología / Software</SelectItem>
                      <SelectItem value="Agencia / Marketing">Agencia / Marketing</SelectItem>
                      <SelectItem value="Retail físico">Retail físico</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción del negocio *</Label>
                  <Textarea 
                    placeholder="Ofrecemos servicios de consultoría tecnológica para empresas." 
                    value={formData.description} 
                    onChange={e => updateForm("description", e.target.value)}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.description.length}/500</p>
                </div>
                <div className="space-y-2">
                  <Label>Sitio web (opcional)</Label>
                  <Input placeholder="https://sunegocio.com" value={formData.website} onChange={e => updateForm("website", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Cómo van a usarlo</h3>
                <p className="text-sm text-muted-foreground">Esta info nos sirve para sugerir la configuración más útil.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Uso principal del agente *</Label>
                  <Select value={formData.useCase} onValueChange={v => updateForm("useCase", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionen un caso de uso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cerrar ventas">Cerrar ventas</SelectItem>
                      <SelectItem value="Soporte y atención">Soporte y atención</SelectItem>
                      <SelectItem value="Calificar leads">Calificar leads</SelectItem>
                      <SelectItem value="Coordinar turnos / agenda">Coordinar turnos / agenda</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Canales que van a conectar *</Label>
                  <div className="flex items-center gap-2 border rounded-md p-3">
                    <Checkbox id="chk-wa" checked={formData.channelsWhatsApp} onCheckedChange={(c) => updateForm("channelsWhatsApp", !!c)} />
                    <Label htmlFor="chk-wa" className="font-normal cursor-pointer">WhatsApp</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tamaño del equipo *</Label>
                  <Select value={formData.teamSize} onValueChange={v => updateForm("teamSize", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionen un rango" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solo yo">Solo yo</SelectItem>
                      <SelectItem value="2 a 5 personas">2 a 5 personas</SelectItem>
                      <SelectItem value="6 a 20 personas">6 a 20 personas</SelectItem>
                      <SelectItem value="Más de 20 personas">Más de 20 personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Listo para arrancar</h3>
                <p className="text-sm text-muted-foreground">Revisen los datos antes de finalizar.</p>
              </div>
              
              <div className="rounded-lg border divide-y">
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sobre ustedes</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Nombre</span>
                    <span className="font-medium">{formData.fullName || "—"}</span>
                    <span className="text-muted-foreground">Teléfono</span>
                    <span className="font-medium">{formData.phone || "—"}</span>
                    <span className="text-muted-foreground">Rol</span>
                    <span className="font-medium">{formData.role || "—"}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Su negocio</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Empresa</span>
                    <span className="font-medium uppercase">{formData.companyName || "—"}</span>
                    <span className="text-muted-foreground">Industria</span>
                    <span className="font-medium">{formData.industry || "—"}</span>
                    <span className="text-muted-foreground">Sitio</span>
                    <span className="font-medium">{formData.website || "—"}</span>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-muted-foreground block mb-1">Descripción</span>
                    <span className="font-medium uppercase block">{formData.description || "—"}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cómo van a usarlo</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Uso principal</span>
                    <span className="font-medium">{formData.useCase || "—"}</span>
                    <span className="text-muted-foreground">Canales</span>
                    <span className="font-medium">{formData.channelsWhatsApp ? "WhatsApp" : "—"}</span>
                    <span className="text-muted-foreground">Equipo</span>
                    <span className="font-medium">{formData.teamSize || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Checkbox 
                  id="chk-ai" 
                  checked={formData.createAI} 
                  onCheckedChange={(c) => updateForm("createAI", !!c)}
                  className="mt-1"
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="chk-ai" className="text-base font-semibold cursor-pointer">
                    Crear su primer asistente con estos datos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Les dejamos el agente armado y listo para conectar a WhatsApp cuando quieran.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="ghost" onClick={handlePrev} disabled={loading}>
                Anterior
              </Button>
            )}
            <Button variant="link" className="text-muted-foreground" onClick={handleSkip} disabled={loading}>
              Omitir por ahora
            </Button>
          </div>
          {step < 4 ? (
            <Button onClick={handleNext}>
              Siguiente →
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Finalizando..." : "Terminar y Empezar"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
