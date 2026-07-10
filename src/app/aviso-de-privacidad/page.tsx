import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function AvisoDePrivacidad() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar hideLogin={true} />
      
      {/* Header Decorativo */}
      <div className="bg-background border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background"></div>
        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-2xl mb-6 ring-1 ring-yellow-500/20">
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Aviso de Privacidad</h1>
          <p className="text-muted-foreground text-lg">Última actualización: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4">
        <Card className="shadow-lg border-muted/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              
              <p className="text-lg text-foreground font-medium border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-500/5">
                Este Aviso de Privacidad está elaborado en estricto cumplimiento con la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP) de la República del Ecuador</strong> y los requisitos para Proveedores Tecnológicos (Tech Providers) de Meta Platforms, Inc.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">1.</span> Información que recopilamos
                </h2>
                <p>
                  Para operar como proveedor de soluciones de WhatsApp (Tech Provider), HallTech recopila la siguiente información:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Datos de la Agencia/Cliente:</strong> Nombres, correos electrónicos, números de teléfono y datos de facturación.</li>
                  <li><strong>Datos de Integración (Meta):</strong> Identificadores de cuentas de WhatsApp Business (WABA), tokens de acceso y configuración de webhooks.</li>
                  <li><strong>Datos de Usuarios Finales:</strong> Mensajes, números de teléfono y metadatos de las conversaciones procesadas a través de la API oficial de WhatsApp en nombre de nuestros clientes.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">2.</span> Base Legal y Finalidad (LOPDP)
                </h2>
                <p>
                  De conformidad con la LOPDP de Ecuador, el tratamiento de sus datos se fundamenta en el consentimiento expreso y en la ejecución de un contrato de prestación de servicios. La información se utiliza exclusivamente para:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Proveer el servicio de CRM y enrutamiento de mensajes a través de la API de WhatsApp.</li>
                  <li>Garantizar la seguridad de la plataforma y prevenir fraudes.</li>
                  <li>Cumplir con las obligaciones de auditoría y reporte exigidas por Meta.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">3.</span> Compartición de datos con Terceros (Meta)
                </h2>
                <p>
                  Como Meta Tech Provider, es necesario que ciertos metadatos e información operativa sean procesados por la infraestructura de Meta (WhatsApp LLC) para el correcto envío y recepción de mensajes. No vendemos ni compartimos su información con terceros para fines publicitarios. Todo procesamiento cumple con los <em>Términos de Procesamiento de Datos de Meta</em>.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">4.</span> Derechos del Titular (Derechos ARCO)
                </h2>
                <p>
                  Bajo la legislación ecuatoriana, usted tiene derecho al <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong> sobre sus datos personales. Para ejercer estos derechos, o revocar su consentimiento, puede comunicarse directamente con nuestro Delegado de Protección de Datos enviando un correo a <a href="mailto:contacto@halltech.com" className="text-yellow-500 hover:underline">contacto@halltech.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">5.</span> Seguridad de la Información
                </h2>
                <p>
                  Aplicamos medidas de seguridad técnicas, organizativas y administrativas, incluyendo el cifrado de datos en reposo y en tránsito, para proteger la confidencialidad de las conversaciones, cumpliendo tanto con la normativa ecuatoriana como con los estándares de seguridad global exigidos por Meta.
                </p>
              </section>

            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
