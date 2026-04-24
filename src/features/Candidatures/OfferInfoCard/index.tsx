import { processHtmlContent } from '@/common/utils/html.utils'
import React from 'react'
import { useIntl } from 'react-intl'

interface OfferInfoCardProps {
  offer: any
}

type OfferStatus = 'ouverte' | 'en_evaluation' | 'cloturee'

const STATUS_CONFIG: Record<OfferStatus, { labelId: string; defaultLabel: string; className: string }> = {
  ouverte: {
    labelId: 'offer.status.ouverte',
    defaultLabel: 'Ouverte',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  en_evaluation: {
    labelId: 'offer.status.en_evaluation',
    defaultLabel: 'En évaluation',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  cloturee: {
    labelId: 'offer.status.cloturee',
    defaultLabel: 'Clôturée',
    className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
}

function resolveStatus(offer: any): OfferStatus {
  if (offer.status && offer.status in STATUS_CONFIG) return offer.status as OfferStatus
  if (offer.isClosed) return 'cloturee'
  return 'ouverte'
}

export default function OfferInfoCard({ offer }: OfferInfoCardProps) {
  const intl = useIntl()

  const status = resolveStatus(offer)
  const statusCfg = STATUS_CONFIG[status]

  const items = [
    {
      label: intl.formatMessage({ id: 'offer.typeContrat', defaultMessage: 'Type de contrat' }),
      value: (Array.isArray(offer.typeContrat) ? offer.typeContrat : [offer.typeContrat]).filter(Boolean).join(', '),
    },
    {
      label: intl.formatMessage({ id: 'offer.salaryLabel', defaultMessage: 'Salaire' }),
      value: offer.salary != null ? `${offer.salary} TND` : null,
    },
    {
      label: intl.formatMessage({ id: 'offer.niveauLabel', defaultMessage: 'Niveau' }),
      value: offer.niveau,
    },
    {
      label: intl.formatMessage({ id: 'offer.domainLabel', defaultMessage: 'Domaine' }),
      value: offer.experienceDomain,
    },
    {
      label: intl.formatMessage({ id: 'offer.deadline', defaultMessage: 'Date limite' }),
      value: offer.dateDeadline ? new Date(offer.dateDeadline).toLocaleDateString() : null,
    },
  ].filter((i) => i.value)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{offer.title}</h2>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.className}`}>
          {intl.formatMessage({ id: statusCfg.labelId, defaultMessage: statusCfg.defaultLabel })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {items.map((item) => (
          <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.label}</p>
            <p className="font-semibold text-sm text-gray-800 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {offer.description && (
        <div
          className="wysiwyg-content"
          dangerouslySetInnerHTML={{ __html: processHtmlContent(offer.description) }}
        />
      )}
    </div>
  )
}
