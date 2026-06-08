/**
 * Contact: formulario mínimo que abre el cliente de correo y redirige a /thanks.
 */

import Section from '../common/Section'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

/** Props del componente Contact */
interface ContactProps {
  toEmail: string
}

export default function Contact({ toEmail }: ContactProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  /** Maneja envío: abre mailto y navega a /thanks */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Contacto desde el portfolio — ${name || 'Sin nombre'}`)
    const body = encodeURIComponent(`${message}\n\n${name} · ${email}`)
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`
    setTimeout(() => navigate('/thanks'), 250)
  }

  return (
    <Section id="contact" title={t('contact.title')} subtitle={t('contact.subtitle')}>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
        <label className="grid gap-1">
          <span className="text-sm">{t('contact.form.name')}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-3 py-2 bg-background"
            placeholder="Jane Doe"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">{t('contact.form.email')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2 bg-background"
            placeholder="you@email.com"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">{t('contact.form.message')}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded-md px-3 py-2 bg-background min-h-32"
            placeholder="Escribe tu mensaje..."
            required
          />
        </label>
        <div className="pt-1">
          <Button type="submit">{t('contact.form.send')}</Button>
        </div>
      </form>
    </Section>
  )
}
