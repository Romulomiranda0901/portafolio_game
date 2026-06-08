/**
 * ErrorBoundary: captura errores de render para evitar que la vista previa quede en blanco.
 * Muestra una UI mínima con opción de reintentar.
 */

import React from 'react'
import { Button } from '../ui/button'

/** Estado de ErrorBoundary */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/** ErrorBoundary basado en clase para compatibilidad con React 18 */
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  /** Nombre de la clase */
  static displayName = 'ErrorBoundary'

  /** Actualiza estado al detectar error */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /** Registra errores si se desea (a futuro se puede enviar a endpoint) */
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info)
  }

  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  /** Restablece el estado para reintentar render */
  private handleRetry = () => this.setState({ hasError: false, error: undefined })

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4 border rounded-lg p-6">
            <h2 className="text-xl font-semibold">Ha ocurrido un error</h2>
            <p className="text-sm text-muted-foreground">
              Intentaremos recuperarnos. Si el problema persiste, recarga la página.
            </p>
            <div className="text-left bg-muted/50 rounded-md p-3 overflow-auto max-h-40">
              <pre className="text-xs whitespace-pre-wrap">{this.state.error?.message}</pre>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={this.handleRetry}>Reintentar</Button>
              <Button variant="outline" className="bg-transparent" onClick={() => location.reload()}>
                Recargar
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
