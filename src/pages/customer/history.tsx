import React from 'react'
import PublicLayout from '@/layouts/PublicLayout'
import PageTitle from '@/components/PageTitle'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import { useIntl } from 'react-intl'

const statusClass: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  accepter: 'bg-green-100 text-green-700',
  refuser: 'bg-red-100 text-red-700',
  entretien: 'bg-blue-100 text-blue-700',
}

export default function CustomerHistoryPage() {
  const intl = useIntl()
  const { useMyCandidatures } = useCandidatureApi()
  const { data: items = [], isLoading } = useMyCandidatures()

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <PageTitle title={intl.formatMessage({ id: 'candidature.listTitle', defaultMessage: 'Candidatures' })} />

        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          {isLoading ? (
            <p className="text-gray-500">{intl.formatMessage({ id: 'loading', defaultMessage: 'Loading...' })}</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">{intl.formatMessage({ id: 'table.emptyContent', defaultMessage: 'No data available' })}</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                    <th className="py-2 pr-3">Offre</th>
                    <th className="py-2 pr-3">Date candidature</th>
                    <th className="py-2 pr-3">Statut</th>
                    <th className="py-2 pr-3">Date entretien</th>
                    <th className="py-2 pr-3">Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 pr-3 font-medium">{item.offerTitle}</td>
                      <td className="py-2 pr-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass[item.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                          {intl.formatMessage({ id: `candidature.status.${item.status}`, defaultMessage: item.status || '-' })}
                        </span>
                      </td>
                      <td className="py-2 pr-3">{item.interviewDate ? new Date(item.interviewDate).toLocaleString() : '—'}</td>
                      <td className="py-2 pr-3">
                        {item.status === 'accepter' && item.interviewDate
                          ? 'Entretien programmé'
                          : item.status === 'entretien' && item.interviewDate
                          ? 'Entretien en cours'
                          : item.status === 'refuser'
                            ? 'Candidature refusée'
                            : 'En attente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
