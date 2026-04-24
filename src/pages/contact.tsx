import React, { useState } from 'react'
import PublicLayout from '@/layouts/PublicLayout'
import { useIntl } from 'react-intl'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi'

type FormState = { name: string; email: string; subject: string; message: string }

const INFO_ITEMS = [
  {
    icon: FiMapPin,
    titleId: 'contact.address',
    valueId: 'contact.addressValue',
  },
  {
    icon: FiPhone,
    titleId: 'contact.phone',
    valueId: 'contact.phoneValue',
    href: 'tel:+21671234567',
  },
  {
    icon: FiMail,
    titleId: 'contact.email',
    valueId: 'contact.emailValue',
    href: 'mailto:contact@rhmanagement.tn',
  },
  {
    icon: FiClock,
    titleId: 'contact.hours',
    valueId: 'contact.hoursValue',
  },
]

export default function ContactPage() {
  const intl = useIntl()

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate send
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setSending(false)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const field = (id: keyof FormState, labelId: string, placeholder: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {intl.formatMessage({ id: labelId, defaultMessage: placeholder })}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
        placeholder={placeholder}
        required={id !== 'subject'}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />
    </div>
  )

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {intl.formatMessage({ id: 'contact.badge', defaultMessage: 'Nous contacter' })}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {intl.formatMessage({ id: 'contact.hero.title', defaultMessage: 'Parlons de votre projet' })}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            {intl.formatMessage({
              id: 'contact.hero.subtitle',
              defaultMessage:
                'Notre équipe est disponible pour répondre à toutes vos questions sur le recrutement, nos services et nos offres.',
            })}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {intl.formatMessage({ id: 'contact.infoTitle', defaultMessage: 'Informations de contact' })}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {intl.formatMessage({
                  id: 'contact.infoSubtitle',
                  defaultMessage: 'Vous pouvez nous joindre par les moyens suivants ou remplir le formulaire.',
                })}
              </p>
            </div>

            <div className="space-y-5">
              {INFO_ITEMS.map(({ icon: Icon, titleId, valueId, href }) => (
                <div key={titleId} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <Icon className="text-yellow-600 dark:text-yellow-400" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {intl.formatMessage({ id: titleId, defaultMessage: titleId })}
                    </p>
                    {href ? (
                      <a href={href} className="text-sm text-gray-800 dark:text-gray-200 hover:text-yellow-500 transition mt-0.5 block">
                        {intl.formatMessage({ id: valueId, defaultMessage: valueId })}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                        {intl.formatMessage({ id: valueId, defaultMessage: valueId })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {intl.formatMessage({ id: 'contact.social', defaultMessage: 'Réseaux sociaux' })}
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { Icon: FiTwitter,  href: 'https://twitter.com',  label: 'Twitter'  },
                  { Icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700 transition"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <FiMapPin size={28} className="mx-auto mb-2 text-yellow-400" />
                <p className="text-xs">RH Management — Tunis, Tunisie</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {intl.formatMessage({ id: 'contact.formTitle', defaultMessage: 'Envoyez-nous un message' })}
              </h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSend size={28} className="text-green-500" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {intl.formatMessage({ id: 'contact.sentTitle', defaultMessage: 'Message envoyé !' })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {intl.formatMessage({ id: 'contact.sentSubtitle', defaultMessage: 'Nous vous répondrons dans les plus brefs délais.' })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    {intl.formatMessage({ id: 'contact.sendAnother', defaultMessage: 'Envoyer un autre message' })}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('name',  'contact.form.name',    'Votre nom complet')}
                    {field('email', 'contact.form.email',   'votre@email.com', 'email')}
                  </div>
                  {field('subject', 'contact.form.subject', 'Objet de votre message')}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {intl.formatMessage({ id: 'contact.form.message', defaultMessage: 'Message' })}
                    </label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder={intl.formatMessage({ id: 'contact.form.messagePlaceholder', defaultMessage: 'Décrivez votre demande...' })}
                      required
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm"
                  >
                    <FiSend size={16} />
                    {sending
                      ? intl.formatMessage({ id: 'loading', defaultMessage: 'Envoi...' })
                      : intl.formatMessage({ id: 'contact.form.send', defaultMessage: 'Envoyer le message' })}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ teaser */}
      <section className="bg-yellow-50 dark:bg-gray-800/50 py-14 px-4 border-t border-yellow-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {intl.formatMessage({ id: 'contact.faq.title', defaultMessage: 'Questions fréquentes' })}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {intl.formatMessage({ id: 'contact.faq.subtitle', defaultMessage: 'Consultez notre FAQ avant de nous contacter.' })}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { q: 'contact.faq.q1', a: 'contact.faq.a1', qDef: 'Comment postuler à une offre ?', aDef: 'Consultez nos offres d\'emploi, choisissez un poste et cliquez sur « Postuler ». Remplissez le formulaire et soumettez votre candidature.' },
              { q: 'contact.faq.q2', a: 'contact.faq.a2', qDef: 'Comment suivre ma candidature ?', aDef: 'Connectez-vous à votre espace personnel pour consulter l\'état de vos candidatures en temps réel.' },
              { q: 'contact.faq.q3', a: 'contact.faq.a3', qDef: 'Comment publier une offre ?', aDef: 'Contactez notre équipe commerciale pour obtenir un accès recruteur et publier vos offres d\'emploi.' },
            ].map(({ q, a, qDef, aDef }) => (
              <div key={q} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {intl.formatMessage({ id: q, defaultMessage: qDef })}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  {intl.formatMessage({ id: a, defaultMessage: aDef })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
