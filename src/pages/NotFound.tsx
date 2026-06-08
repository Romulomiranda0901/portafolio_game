/**
 * Página 404: Vista minimal con breadcrumbs y retorno al inicio.
 */

import Breadcrumbs from "../components/common/Breadcrumbs"
import { Button } from "../components/ui/button"
import { ArrowLeft, Compass } from "lucide-react"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"

/** Componente 404 */
export default function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Breadcrumbs />
      <main className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {t('notFound.title')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('notFound.description')}
          </p>
          <Link to="/">
            <Button variant="outline" className="bg-transparent">
              <ArrowLeft className="size-4 mr-2" />
              {t('actions.backHome')}
            </Button>
          </Link>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted/30 grid place-content-center">
          <Compass className="size-16 text-muted-foreground" />
        </div>
      </main>
    </div>
  )
}
