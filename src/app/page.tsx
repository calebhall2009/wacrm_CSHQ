import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { CheckCircle2, MessageSquare, Zap, Shield, BarChart3, Users } from 'lucide-react'
import { DashboardCarousel } from "@/components/landing/dashboard-carousel"

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-yellow-500/30 force-light bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />
          
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-8 ring-1 ring-yellow-500/20">
              <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
              La infraestructura B2B para agencias modernas
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Escala tu agencia con un <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                CRM Inteligente
              </span> para WhatsApp
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Ofrece a tus clientes una plataforma de automatización completa impulsada por Inteligencia Artificial. Control total, flujos sin código y buzón compartido.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 h-auto w-full sm:w-auto shadow-xl shadow-yellow-500/20 transition-all hover:scale-105">
                Contactar a ventas
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto w-full sm:w-auto bg-background/50 backdrop-blur">
                Ver demostración
              </Button>
            </div>
          </div>
        </section>

        {/* Características Grid */}
        <section className="py-24 px-4 bg-muted/30 border-y">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para operar</h2>
              <p className="text-muted-foreground text-lg">Infraestructura robusta diseñada para manejar el volumen de tus clientes.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MessageSquare, title: "Buzón Compartido", desc: "Múltiples agentes respondiendo desde un mismo número." },
                { icon: Zap, title: "Flujos Automatizados", desc: "Constructor visual (drag & drop) para bots complejos." },
                { icon: Shield, title: "Marca Blanca Total", desc: "Tu logo, tu dominio, tus colores. El cliente no sabrá de nosotros." },
                { icon: Users, title: "Multi-tenant", desc: "Gestiona múltiples clientes y espacios de trabajo desde una sola cuenta." },
                { icon: BarChart3, title: "Métricas en Tiempo Real", desc: "Analíticas detalladas de envíos, lecturas y conversiones." },
                { icon: CheckCircle2, title: "API Oficial de Meta", desc: "Conexión directa, segura y aprobada para no sufrir bloqueos." }
              ].map((feat, i) => (
                <div key={i} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow group">
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feat.icon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                  <p className="text-muted-foreground">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modelo CRM / Preview Section */}
        <section id="modelo" className="py-24 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4">Así se ve por dentro</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Una interfaz moderna, intuitiva y lista para que la presentes como tu propio desarrollo tecnológico.</p>
            </div>
            
            <DashboardCarousel />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precio" className="py-24 px-4 bg-muted/30 border-t">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4">Precios transparentes</h2>
              <p className="text-muted-foreground text-lg">Paga solo por lo que usas. Escala sin límites.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan 1 */}
              <div className="rounded-3xl border bg-card p-10 shadow-sm flex flex-col hover:border-yellow-500/50 transition-colors">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">Para negocios en crecimiento</p>
                <div className="text-5xl font-extrabold mb-8">$99 <span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                <ul className="space-y-4 mb-10 flex-1">
                  {['Contactos ilimitados', 'Constructores de flujos visuales', '1 Número de WhatsApp API', 'Soporte prioritario'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-lg py-6" variant="outline">Empezar</Button>
              </div>
              
              {/* Plan 2 */}
              <div className="rounded-3xl border-2 border-yellow-500 bg-card p-10 shadow-xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Recomendado para Agencias
                </div>
                <h3 className="text-2xl font-bold mb-2">Agency White Label</h3>
                <p className="text-muted-foreground mb-6">Control absoluto para tu marca</p>
                <div className="text-5xl font-extrabold mb-8">$299 <span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                <ul className="space-y-4 mb-10 flex-1">
                  {['Todo lo de Pro', 'Marca blanca (tu propio dominio)', 'Multi-tenant para clientes', 'Acceso a la API REST'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-lg py-6 bg-yellow-500 text-black hover:bg-yellow-600 shadow-lg shadow-yellow-500/20">Contactar a ventas</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
