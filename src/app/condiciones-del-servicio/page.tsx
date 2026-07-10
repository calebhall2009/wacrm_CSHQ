import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function CondicionesDelServicio() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar hideLogin={true} />
      
      {/* Header Decorativo */}
      <div className="bg-background border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background"></div>
        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-2xl mb-6 ring-1 ring-yellow-500/20">
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Condiciones del Servicio</h1>
          <p className="text-muted-foreground text-lg">Última actualización: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4">
        <Card className="shadow-lg border-muted/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              
              <p className="text-lg text-foreground font-medium border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-500/5">
                Estos Términos y Condiciones rigen el uso de la plataforma HallTech y están sujetos a las leyes de la República del Ecuador, así como a las normativas globales de Meta para proveedores de soluciones empresariales.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">1.</span> Aceptación de los términos
                </h2>
                <p>
                  Al acceder y utilizar los servicios de CRM y automatización de HallTech, usted (el "Cliente") acepta cumplir y estar sujeto a estos Términos y Condiciones, así como a nuestra Política de Privacidad, elaborada en cumplimiento de la normativa ecuatoriana vigente.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">2.</span> Cumplimiento de Políticas de Meta
                </h2>
                <p>
                  Dado que nuestra plataforma funciona como un puente tecnológico hacia la API oficial de WhatsApp, los usuarios se obligan a cumplir estrictamente con las <strong>Políticas de WhatsApp Business</strong> y la <strong>Política de Comercio de Meta</strong>. HallTech se reserva el derecho de suspender cualquier cuenta que sea identificada por Meta como infractora (ej. envío de spam, contenido ilícito, o negocios no permitidos).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">3.</span> Relación como Tech Provider
                </h2>
                <p>
                  HallTech actúa exclusivamente como un Proveedor Tecnológico (Tech Provider) que facilita la conexión con la API de WhatsApp Cloud. No somos responsables por interrupciones en el servicio derivadas de caídas globales de Meta, cambios imprevistos en sus políticas de facturación, o suspensiones de su número de WhatsApp por mala reputación.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">4.</span> Facturación y Pagos
                </h2>
                <p>
                  Los servicios de HallTech se facturan bajo el modelo de suscripción acordado. Adicionalmente, el Cliente es responsable de cubrir los costos directos de las conversaciones (originadas por la empresa o por el usuario) facturadas directamente por Meta, según la tarjeta de crédito que hayan configurado en su Administrador Comercial de Facebook (Business Manager).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">5.</span> Ley Aplicable y Jurisdicción
                </h2>
                <p>
                  Cualquier disputa o reclamación relacionada con el uso de nuestros servicios estará regida y será interpretada de acuerdo con las leyes de la República del Ecuador. Las partes se someten irrevocablemente a la jurisdicción exclusiva de los tribunales de la ciudad de Guayaquil, Ecuador.
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
