import { FiClock, FiDollarSign, FiBookmark, FiArrowRight, FiCalendar, FiLayers } from 'react-icons/fi'
import Typography from '@/components/Typographie'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import useOffersApi from '@/services/offers/useOffersApi'
import { Spinner } from '@heroui/react'

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  CDD: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  CIVP: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
}

function getInitials(title: string): string {
  return title.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

export function JobListings() {
  const { useListOpenOffers } = useOffersApi()
  const { data, isLoading, isError } = useListOpenOffers(0, 6)
  const intl = useIntl()

  const jobs: any[] = Array.isArray(data) ? data : (data as any)?.data ?? []

  function timeAgo(dateStr?: string): string {
    if (!dateStr) return ''
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
    if (days === 0) return intl.formatMessage({ id: 'jobs.today' })
    if (days === 1) return intl.formatMessage({ id: 'jobs.dayAgo' })
    if (days < 7)  return intl.formatMessage({ id: 'jobs.daysAgo' }, { count: days })
    if (days < 14) return intl.formatMessage({ id: 'jobs.weekAgo' })
    return intl.formatMessage({ id: 'jobs.weeksAgo' }, { count: Math.floor(days / 7) })
  }

  return (
    <section id="jobs" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <Typography variant="h2" weight="bold" className="text-gray-900 dark:text-white mb-2">
              {intl.formatMessage({ id: 'jobs.title' })}
            </Typography>
            <Typography variant="p" className="text-gray-500 dark:text-gray-400">
              {isLoading ? '...' : intl.formatMessage({ id: 'jobs.count' }, { count: jobs.length })}
            </Typography>
          </div>
          <Link
            href="/offers"
            className="hidden md:flex items-center gap-2 text-yellow-500 font-semibold hover:text-yellow-600 transition-colors"
          >
            {intl.formatMessage({ id: 'jobs.viewAll' })} <FiArrowRight size={16} />
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" color="warning" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-16 text-gray-400">
            {intl.formatMessage({ id: 'jobs.error' })}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {jobs.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                {intl.formatMessage({ id: 'jobs.empty' })}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-yellow-500 group flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
                          {getInitials(job.title)}
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            weight="semibold"
                            className="text-gray-900 dark:text-white mb-1 group-hover:text-yellow-500 transition-colors leading-snug"
                          >
                            {job.title}
                          </Typography>
                          {job.experienceDomain && (
                            <Typography variant="p" className="text-gray-500 dark:text-gray-400 text-xs">
                              {job.experienceDomain}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <button className="text-gray-300 hover:text-yellow-500 transition-colors shrink-0">
                        <FiBookmark size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
                      {(Array.isArray(job.typeContrat) ? job.typeContrat : (job.typeContrat ? [job.typeContrat] : [])).map((contract: string) => (
                        <span key={`${job.id}-${contract}`} className={`px-2.5 py-1 rounded-full font-semibold ${CONTRACT_COLOR[contract] ?? 'bg-gray-100 text-gray-600'}`}>
                          {contract}
                        </span>
                      ))}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <FiDollarSign size={13} className="text-yellow-500" />
                          {job.salary.toLocaleString('fr-FR')} DT
                        </span>
                      )}
                      {job.niveau && (
                        <span className="flex items-center gap-1">
                          <FiLayers size={13} className="text-yellow-500" />
                          {job.niveau}
                        </span>
                      )}
                      {job.dateDeadline && (
                        <span className="flex items-center gap-1">
                          <FiCalendar size={13} className="text-yellow-500" />
                          {new Date(job.dateDeadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* {job.description && (
                      <div
                        className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    )} */}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiClock size={12} />
                        {timeAgo(job.dateCreation)}
                      </span>
                      <Link
                        href={`/offers/${job.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-lg text-sm"
                      >
                        {intl.formatMessage({ id: 'jobs.apply' })}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 text-yellow-500 font-semibold hover:text-yellow-600 transition-colors"
          >
            {intl.formatMessage({ id: 'jobs.viewAll' })} <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}