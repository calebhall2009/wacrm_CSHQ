import { FloatingWidget } from '@/components/demo/floating-widget'

export default async function WidgetEmbedPage(props: { params: Promise<{ clientId: string }> }) {
  const params = await props.params;
  const clientId = decodeURIComponent(params.clientId || 'default');

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold mb-4">Página Web Ficticia del Cliente</h1>
        <p className="text-slate-600 mb-4">
          Imagina que esta es la página oficial de <strong>{clientId}</strong>. 
          En la esquina inferior derecha verás el widget de chat incrustado que has generado para ellos.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
          <h3 className="font-semibold text-slate-800 mb-2">Características Demostradas:</h3>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li><strong>Aislamiento Multi-Tenant:</strong> El widget está atado al ID <code>{clientId}</code>. Solo responderá basado en sus propios FAQs/PDFs.</li>
            <li><strong>Búsqueda RAG Simulada:</strong> Pregúntale por "precio" o "costo" para ver cómo extrae información del documento del cliente.</li>
            <li><strong>Actualización Automática del CRM (Pipeline):</strong> Dile "me interesa comprar" y observa cómo el sistema simula un <em>Function Call</em> para actualizar la etapa de venta en Supabase.</li>
          </ul>
        </div>
      </div>

      {/* Aquí inyectamos el Widget */}
      <FloatingWidget clientId={clientId} />
    </div>
  )
}
