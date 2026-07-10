import Link from 'next/link'
import { Hexagon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar({ hideLogin = false }: { hideLogin?: boolean }) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-2 h-16 overflow-visible">
          <img src="/logo.png" alt="HallTech Logo" className="h-24 w-auto object-contain scale-[2] origin-left ml-4" />
        </div>
        
        {!hideLogin && (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button>
                Acceso al panel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
