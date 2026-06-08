/**
 * Página de agradecimiento tras contacto.
 */

import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'

export default function ThanksPage() {
  const { t } = useTranslation('common')
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4 border rounded-lg p-6">
        <h1 className="text-2xl font-semibold">{t('thanks.title')}</h1>
        <p className="text-muted-foreground">{t('thanks.description')}</p>
        <a href="#home">
          <Button>{t('actions.backHome')}</Button>
        </a>
      </div>
    </div>
  )
}
