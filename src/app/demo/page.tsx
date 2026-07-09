import { DemoChat } from '@/components/demo/demo-chat'

export const metadata = {
  title: 'Demo Chatbot | CRM',
  description: 'Interactúa con nuestro chatbot de demostración',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pruébalo tú mismo</h1>
        <p className="text-slate-600">
          Esta es una simulación de cómo tus clientes interactuarían con el asistente inteligente.
          Escríbele para ver ejemplos de respuestas.
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <DemoChat />
      </div>
      
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>Nota: Las respuestas de esta demo están simuladas.</p>
      </div>
    </div>
  )
}
