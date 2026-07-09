'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '¡Hola! Soy el chatbot de demostración. Prueba enviarme un mensaje simulando ser un cliente.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Lo siento, hubo un error de conexión.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col shadow-xl border-slate-200">
      <CardHeader className="bg-slate-900 text-slate-50 rounded-t-xl pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-6 h-6 text-green-400" />
          <div className="flex flex-col">
            <span>Demo Chatbot CRM</span>
            <span className="text-xs text-slate-400 font-normal">En línea</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 overflow-hidden relative bg-slate-50">
        <ScrollArea className="h-full pr-4" ref={scrollRef}>
          <div className="flex flex-col gap-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-max max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "ml-auto bg-green-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-slate-200 text-slate-800 w-max max-w-[80%] rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex items-center gap-1">
                <span className="animate-bounce inline-block w-1 h-1 bg-slate-400 rounded-full"></span>
                <span className="animate-bounce delay-100 inline-block w-1 h-1 bg-slate-400 rounded-full"></span>
                <span className="animate-bounce delay-200 inline-block w-1 h-1 bg-slate-400 rounded-full"></span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t bg-white rounded-b-xl">
        <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Escribe un mensaje..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-full border-slate-300 focus-visible:ring-green-500"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
