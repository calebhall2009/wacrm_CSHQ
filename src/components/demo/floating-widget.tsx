'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function FloatingWidget({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  // Iniciamos sin ningún mensaje para que el usuario sea quien inicie la conversación
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Cargar historial inicial si existe (solo para producción)
  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)
      
      if (isUUID) {
        setIsLoading(true)
        fetch(`/api/widget-chat?clientId=${clientId}`)
          .then(res => res.json())
          .then(data => {
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content
              })))
            }
          })
          .catch(console.error)
          .finally(() => setIsLoading(false))
      }
    }
  }, [isOpen, hasStarted, clientId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/widget-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, clientId, history: messages })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }])
      
      if (data.meta?.systemLog) {
        setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'system', content: data.meta.systemLog }])
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Lo siento, hubo un error de conexión.' }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-green-600 hover:bg-green-700"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[340px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl border-slate-200 z-50 animate-in slide-in-from-bottom-5">
      <CardHeader className="bg-slate-900 text-slate-50 rounded-t-xl pb-3 pt-3 flex flex-row items-center justify-between shadow-sm">
        <CardTitle className="flex items-center gap-2 text-md">
          <Bot className="w-5 h-5 text-green-400" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{clientId}</span>
            <span className="text-xs text-slate-400 font-normal">IA conectada a la Base del Cliente</span>
          </div>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 -mr-2">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-3 overflow-hidden relative bg-slate-50">
        <ScrollArea className="h-full pr-3" ref={scrollRef}>
          <div className="flex flex-col gap-3 pb-2 min-h-full justify-end">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-slate-400 text-sm mt-4">
                El chat está vacío. Escribe un mensaje para iniciar la conversación.
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1 rounded-2xl px-3 py-2 text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "ml-auto bg-green-600 text-white rounded-br-none w-max max-w-[85%]"
                    : msg.role === 'system'
                      ? "bg-amber-50 text-amber-900 border border-amber-200 text-xs w-full font-mono rounded-md py-1.5"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none w-max max-w-[85%]"
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-slate-200 text-slate-800 w-max max-w-[80%] rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex items-center gap-1 mt-2">
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
            autoComplete="off"
            className="flex-1 rounded-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-green-500 text-sm h-9"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-9 w-9 rounded-full bg-green-600 hover:bg-green-700 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
