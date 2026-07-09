import Link from 'next/link'

export const metadata = {
  title: 'Gestor de Widgets | Demo Multi-cliente',
}

export default function WidgetManagerDemo() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestor de Widgets Web</h1>
        <p className="text-slate-600 mb-8">
          A continuación se muestran ejemplos de cómo se genera un entorno distinto para cada cliente. 
          Cada enlace abre la simulación web del cliente, inyectando un Widget flotante conectado 
          exclusivamente a su Base de Conocimientos (RAG).
        </p>
        
        <div className="grid gap-4">
          <Link href="/widget/Agencia-Marketing" className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-500 transition-colors group">
            <h2 className="text-xl font-semibold text-slate-800 group-hover:text-green-700">Cliente: Agencia Marketing</h2>
            <p className="text-sm text-slate-500 mt-1">Visitar entorno de prueba del Widget (ID: Agencia-Marketing)</p>
          </Link>

          <Link href="/widget/Clinica-Dental" className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-500 transition-colors group">
            <h2 className="text-xl font-semibold text-slate-800 group-hover:text-green-700">Cliente: Clínica Dental</h2>
            <p className="text-sm text-slate-500 mt-1">Visitar entorno de prueba del Widget (ID: Clinica-Dental)</p>
          </Link>
          
          <Link href="/widget/Tienda-Deportes" className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-500 transition-colors group">
            <h2 className="text-xl font-semibold text-slate-800 group-hover:text-green-700">Cliente: Tienda Deportes</h2>
            <p className="text-sm text-slate-500 mt-1">Visitar entorno de prueba del Widget (ID: Tienda-Deportes)</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
