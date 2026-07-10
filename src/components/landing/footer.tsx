import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-zinc-400 py-12 border-t border-zinc-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 relative h-16 w-full overflow-hidden">
              <img src="/logo.png" alt="Ecuasapp Logo" className="absolute top-1/2 left-0 -translate-y-1/2 w-48 object-contain filter brightness-0 invert" />
            </div>
            <p className="text-sm mt-2">
              Infraestructura de automatización white label para agencias y consultores.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="#modelo" className="hover:text-white transition-colors">Modelo</Link></li>
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="#infraestructura" className="hover:text-white transition-colors">Infraestructura</Link></li>
              <li><Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Contacto
            </h4>
            <a href="mailto:contacto@halltech.com" className="text-sm hover:text-white transition-colors">
              contacto@halltech.com
            </a>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-zinc-800 text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} HallTech. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link href="/aviso-de-privacidad" className="hover:text-zinc-300 transition-colors">Aviso de privacidad</Link>
            <span>&middot;</span>
            <Link href="/condiciones-del-servicio" className="hover:text-zinc-300 transition-colors">Condiciones del servicio</Link>
            <span>&middot;</span>
            <Link href="/eliminacion-de-datos" className="hover:text-zinc-300 transition-colors">Eliminación de datos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
