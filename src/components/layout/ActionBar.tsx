/**
 * ActionBar: barra flotante con acciones rápidas (imprimir, correo, arriba).
 */

import { ArrowUp, Mail, Printer } from 'lucide-react'
import { Button } from '../ui/button'

/** Props para ActionBar */
interface ActionBarProps {
  email: string
  onPrint: () => void
}

export default function ActionBar({ email, onPrint }: ActionBarProps) {
  return (
    <div className="no-print fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      <Button variant="outline" className="bg-transparent shadow" onClick={onPrint} title="Exportar PDF">
        <Printer className="size-4 mr-2" /> PDF
      </Button>
      <a href={`mailto:${email}`} title="Contactar">
        <Button className="shadow">
          <Mail className="size-4 mr-2" /> Email
        </Button>
      </a>
      <a href="#home" title="Volver arriba">
        <Button variant="outline" className="bg-transparent shadow">
          <ArrowUp className="size-4 mr-2" /> Up
        </Button>
      </a>
    </div>
  )
}
