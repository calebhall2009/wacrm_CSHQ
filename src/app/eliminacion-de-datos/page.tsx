import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

export default function EliminacionDeDatos() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar hideLogin={true} />
      
      {/* Header Decorativo */}
      <div className="bg-background border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background"></div>
        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-2xl mb-6 ring-1 ring-yellow-500/20">
            <Trash2 className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Eliminación de Datos</h1>
          <p className="text-muted-foreground text-lg">Instrucciones formales para la eliminación de tu cuenta e información personal.</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4">
        <Card className="shadow-lg border-muted/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              
              <p className="text-lg text-foreground font-medium border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-500/5">
                Para garantizar el derecho de Cancelación u Oposición establecido en la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador</strong>, y cumplir con la política de retención de <strong>Meta Platforms</strong>, ofrecemos un proceso claro para eliminar sus datos.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Cómo solicitar la eliminación de datos</h2>
                <p className="mb-4">Para solicitar la eliminación permanente de sus datos y los de sus clientes de nuestros servidores, por favor siga estos pasos exactos para verificar su identidad:</p>
                <div className="bg-muted rounded-xl p-6 border">
                  <ol className="list-decimal list-inside space-y-3 text-foreground font-medium">
                    <li>Envíe un correo electrónico a <a href="mailto:contacto@halltech.com" className="text-yellow-500 hover:underline">contacto@halltech.com</a> desde el mismo correo registrado en su cuenta de administrador.</li>
                    <li>En el asunto del correo escriba exactamente: <span className="text-muted-foreground font-normal">"Solicitud de Eliminación de Datos - LOPDP"</span>.</li>
                    <li>En el cuerpo del correo, incluya su nombre completo y el nombre de su agencia o espacio de trabajo (Workspace).</li>
                  </ol>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Proceso de eliminación</h2>
                <p className="mb-4">
                  Una vez recibida la solicitud, nuestro equipo de protección de datos verificará su identidad. Tras la validación, procederemos a eliminar de forma segura e irreversible:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>La información de su perfil (nombres, correos, datos de facturación local).</li>
                  <li>Sus configuraciones de WhatsApp Business API, tokens y webhooks de Meta.</li>
                  <li>Todos los datos de sus usuarios finales, historiales de chat, archivos multimedia y metadatos alojados en nuestra infraestructura de base de datos.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Obligaciones ante Meta y la Ley Ecuatoriana</h2>
                <p>
                  El proceso de eliminación se completará en un plazo máximo de <strong>15 días laborables</strong> a partir de la confirmación de su solicitud, superando los estándares legales vigentes. Sin embargo, tome en cuenta que por regulaciones fiscales en Ecuador, podríamos retener facturas y registros de pago de manera aislada por el tiempo que exija el SRI.
                  <br /><br />
                  Le enviaremos un certificado digital de destrucción de datos una vez concluido el proceso, para que pueda presentarlo ante auditorías de Meta si fuese requerido.
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
