import Link from 'next/link'
import { Hexagon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar({ hideLogin = false }: { hideLogin?: boolean }) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-2 h-16 overflow-visible">
          <Link href="/" className="group flex items-center">
            <img src="/logo.png" alt="Ecuasapp Logo" className="h-10 w-auto object-contain origin-left transition-transform duration-300 group-hover:scale-105 drop-shadow-md" />
          </Link>
        </div>
        
        {!hideLogin && (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all duration-200 rounded-full px-6 font-medium tracking-tight"
              >
                Acceso al panel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
