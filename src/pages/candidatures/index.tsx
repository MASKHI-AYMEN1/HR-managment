import React from 'react'
import { useRouter } from 'next/router'
import PublicLayout from '@/layouts/PublicLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import useCandidatureApi, { MyCandidatureItem } from '@/services/candidature/useCandidatureApi'
import { useIntl } from 'react-intl'
import Loader from '@/components/Loader'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  en_attente:  { label: 'En attente',       color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  evaluation_rh:   { label: 'Entretien RH',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  evaluation_technique:   { label: 'Entretien technique',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  evaluation_manager:   { label: 'Entretien manager',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },

  accepte:    { label: 'Acceptée',         color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
 
  refuse:     { label: 'Refusée',          color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  refuse_evaluation_rh:     { label: 'Refusée (RH)',          color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  refuse_evaluation_technique:     { label: 'Refusée (Technique)',          color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  refuse_evaluation_manager:     { label: 'Refusée (Manager)',          color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  }

function StatusBadge({ status }: { status?: string }) {
  const cfg = STATUS_CONFIG[status || ''] ?? { label: status || '—', color: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

export default function MesCandidaturesPage() {
  const intl = useIntl()
  const router = useRouter()
  const { useMyCandidatures } = useCandidatureApi()
  const { data: candidatures = [], isLoading } = useMyCandidatures()

  if (isLoading) return <PublicLayout><Loader /></PublicLayout>

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <PageTitle title={intl.formatMessage({ id: 'candidatures.myTitle', defaultMessage: 'Mes candidatures' })} />
          <Button color="warning" variant="flat" onClick={() => router.push('/profile')}>
            {intl.formatMessage({ id: 'button.back', defaultMessage: 'Retour au profil' })}
          </Button>
        </div>

        {candidatures.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">
              {intl.formatMessage({ id: 'candidatures.empty', defaultMessage: 'Vous n\'avez pas encore de candidatures.' })}
            </p>
            <Button color="warning" className="mt-6" onClick={() => router.push('/offers')}>
              {intl.formatMessage({ id: 'candidatures.seeOffers', defaultMessage: 'Voir les offres' })}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {candidatures.map((c: MyCandidatureItem) => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-base">
                    {c.offerTitle}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {intl.formatMessage({ id: 'candidatures.submittedOn', defaultMessage: 'Soumis le' })}{' '}
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </p>
                  {c.interviewDate && (
                    <p className="text-xs text-blue-500 mt-1">
                      {intl.formatMessage({ id: 'candidatures.interviewOn', defaultMessage: 'Entretien le' })}{' '}
                      {new Date(c.interviewDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={c.status} />
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => router.push({ pathname: `/candidatures/${c.id}`, query: { title: c.offerTitle } })}
                  >
                    {intl.formatMessage({ id: 'candidatures.details', defaultMessage: 'Détails' })}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
