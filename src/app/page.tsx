"use client"

import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { CheckCircle2, MessageSquare, Zap, Shield, BarChart3, Users, ArrowRight, Bot, Workflow, Smartphone, Sparkles, Server } from 'lucide-react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-200">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto max-w-5xl text-center relative z-10 flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-sm font-medium mb-10 border border-zinc-200/50">
              <Sparkles className="h-4 w-4 text-zinc-400" />
              La infraestructura B2B para agencias modernas
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-semibold tracking-tighter mb-8 leading-[1.05] text-zinc-900">
              WhatsApp CRM. <br className="hidden md:block"/>
              <span className="text-zinc-400">Inteligencia pura.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-zinc-500 mb-12 max-w-3xl mx-auto leading-relaxed tracking-tight font-light">
              Ofrece a tus clientes una plataforma de automatización completa. 
              Control total, flujos sin código y buzón compartido con IA.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 py-6 h-auto w-full sm:w-auto rounded-full font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-200/50">
                Contactar a ventas
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto w-full sm:w-auto rounded-full font-medium bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors group">
                Ver demostración
                <ArrowRight className="ml-2 h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Recomendación de Valor: El Flujo de Trabajo (Minimalista) */}
        <section className="py-32 px-4 bg-zinc-50/50 border-y border-zinc-100">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Arquitectura invisible. <br/>Resultados tangibles.</h2>
              <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-light tracking-tight">
                Integra WhatsApp directamente al núcleo de la operación de tus clientes sin fricciones técnicas.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { icon: Bot, title: "Ventas 24/7", desc: "Asistentes virtuales que perfilan prospectos y responden dudas frecuentes sin intervención humana." },
                { icon: Workflow, title: "Soporte Multicanal", desc: "Unifica todo el equipo en un solo número. Distribuye conversaciones y reduce los tiempos de respuesta." },
                { icon: Server, title: "Marketing Directo", desc: "Envía difusiones masivas aprobadas por Meta directamente a la bandeja de miles de clientes." }
              ].map((card, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-3xl p-10 border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-8">
                    <card.icon className="h-5 w-5 text-zinc-700" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-4">{card.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Características Grid */}
        <section className="py-32 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Herramientas profesionales</h2>
              <p className="text-zinc-500 text-xl font-light tracking-tight">Construido para el volumen.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              {[
                { icon: MessageSquare, title: "Buzón Compartido", desc: "Múltiples agentes respondiendo de forma concurrente." },
                { icon: Zap, title: "Flujos Automatizados", desc: "Constructor visual para diseñar bots complejos en minutos." },
                { icon: Shield, title: "Marca Blanca Total", desc: "Tu logo, tu dominio. Completamente transparente al cliente final." },
                { icon: Users, title: "Multi-tenant", desc: "Gestiona múltiples clientes desde un panel central unificado." },
                { icon: BarChart3, title: "Métricas en Tiempo Real", desc: "Visualiza tasas de apertura, lectura y conversión." },
                { icon: CheckCircle2, title: "API Oficial de Meta", desc: "Conexión estable y aprobada, sin riesgo de bloqueos." }
              ].map((feat, i) => (
                <motion.div key={i} variants={fadeUp} className="group">
                  <div className="mb-5 inline-flex">
                    <feat.icon className="h-6 w-6 text-zinc-900 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-3 text-zinc-900">{feat.title}</h3>
                  <p className="text-zinc-500 font-light leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precio" className="py-32 px-4 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Precios simples</h2>
              <p className="text-zinc-500 text-xl font-light tracking-tight">Invierte en la infraestructura correcta.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center"
            >
              {/* Plan 1 */}
              <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-white p-10 border border-zinc-200 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Pro</h3>
                <p className="text-zinc-500 font-light mb-8">Para negocios en crecimiento</p>
                <div className="text-6xl font-semibold tracking-tighter mb-8">$99 <span className="text-xl font-medium text-zinc-400">/mes</span></div>
                <ul className="space-y-5 mb-12 flex-1">
                  {['Contactos ilimitados', 'Constructores de flujos visuales', '1 Número de WhatsApp API', 'Soporte prioritario'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <CheckCircle2 className="h-5 w-5 text-zinc-900 flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-light text-zinc-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-lg py-6 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors font-medium">Empezar ahora</Button>
              </motion.div>
              
              {/* Plan 2 */}
              <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-zinc-900 text-white p-12 shadow-2xl relative flex flex-col md:scale-105 z-10 transition-transform duration-300 hover:scale-[1.07]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-zinc-900 px-6 py-2 rounded-full text-xs font-semibold tracking-widest uppercase">
                  Para Agencias
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">White Label</h3>
                <p className="text-zinc-400 font-light mb-8">Control absoluto de tu marca</p>
                <div className="text-6xl font-semibold tracking-tighter mb-8">$299 <span className="text-xl font-medium text-zinc-500">/mes</span></div>
                <ul className="space-y-5 mb-12 flex-1">
                  {['Todo lo de Pro', 'Marca blanca (dominio propio)', 'Multi-tenant para clientes', 'Acceso a la API REST'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-light text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full text-lg py-6 bg-white text-zinc-900 hover:bg-zinc-100 rounded-full font-medium transition-colors">
                  Contactar a ventas
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
