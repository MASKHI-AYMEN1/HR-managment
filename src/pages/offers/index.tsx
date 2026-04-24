import React, { useState, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useOffersApi from '@/services/offers/useOffersApi'
import PublicLayout from '@/layouts/PublicLayout'
import Link from 'next/link'
import Typography from '@/components/Typographie'
import { Spinner, Pagination } from '@heroui/react'
import { FiClock, FiDollarSign, FiBookmark, FiCalendar, FiLayers, FiSearch, FiFilter, FiX } from 'react-icons/fi'

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  CDD: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  CIVP: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
}

const CONTRACT_TYPES = ['CDI', 'CDD', 'CIVP']

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Il y a 1 jour'
  if (days < 7) return `Il y a ${days} jours`
  if (days < 14) return 'Il y a 1 semaine'
  return `Il y a ${Math.floor(days / 7)} semaines`
}

function getInitials(title: string): string {
  return title.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

const inputCls =
  'w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-yellow-500 transition'

export default function PublicOffersList() {
  const intl = useIntl()
  const { useListOpenOffers } = useOffersApi()
  const { data, isLoading, isError } = useListOpenOffers(0, 100)

  const [search, setSearch] = useState('')
  const [contractType, setContractType] = useState('')
  const [niveau, setNiveau] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [deadlineTo, setDeadlineTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 9

  const allOffers: any[] = Array.isArray(data) ? data : (data as any)?.data ?? []

  const niveauOptions = useMemo(
    () => Array.from(new Set(allOffers.map((o: any) => o.niveau).filter(Boolean))),
    [allOffers],
  )

  const isFilterActive = !!contractType || !!niveau || !!salaryMin || !!salaryMax || !!deadlineTo

  const resetFilters = () => {
    setPage(1)
    setContractType('')
    setNiveau('')
    setSalaryMin('')
    setSalaryMax('')
    setDeadlineTo('')
  }

  const offers = useMemo(() => {
    return allOffers.filter((o: any) => {
      const contractValues = Array.isArray(o.typeContrat)
        ? o.typeContrat
        : o.typeContrat
          ? [o.typeContrat]
          : []

      if (
        search.trim() &&
        !o.title?.toLowerCase().includes(search.toLowerCase()) &&
        !o.experienceDomain?.toLowerCase().includes(search.toLowerCase()) &&
        !o.description?.toLowerCase().includes(search.toLowerCase())
      ) return false
      if (contractType && !contractValues.includes(contractType)) return false
      if (niveau && o.niveau !== niveau) return false
      if (salaryMin && (o.salary ?? 0) < Number(salaryMin)) return false
      if (salaryMax && (o.salary ?? Infinity) > Number(salaryMax)) return false
      if (deadlineTo && o.dateDeadline && new Date(o.dateDeadline) > new Date(deadlineTo)) return false
      return true
    })
  }, [allOffers, search, contractType, niveau, salaryMin, salaryMax, deadlineTo])

  const totalPages = Math.ceil(offers.length / PAGE_SIZE)
  const pagedOffers = offers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <PublicLayout>
    <div className="bg-gray-50 dark:bg-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-10 text-center">
          <Typography variant="h2" weight="bold" className="text-gray-900 dark:text-white mb-3">
            {intl.formatMessage({ id: 'offer.listTitle', defaultMessage: 'List of Offers' })}
          </Typography>
          <Typography variant="p" className="text-gray-500 dark:text-gray-400">
            {isLoading ? '...' : `${offers.length} offres disponibles`}
          </Typography>
        </div>

        {/* Search + filter toggle */}
        <div className="max-w-2xl mx-auto mb-4 flex gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <FiSearch className="text-yellow-500 shrink-0" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Rechercher par titre, domaine..."
              className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <FiX size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters || isFilterActive
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-yellow-500'
            }`}
          >
            <FiFilter size={16} />
            Filtres
            {isFilterActive && (
              <span className="ml-1 bg-white text-yellow-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="max-w-2xl mx-auto mb-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Type de contrat
                </label>
                <select value={contractType} onChange={(e) => { setContractType(e.target.value); setPage(1) }} className={inputCls}>
                  <option value="">Tous</option>
                  {CONTRACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Niveau
                </label>
                <select value={niveau} onChange={(e) => { setNiveau(e.target.value); setPage(1) }} className={inputCls}>
                  <option value="">Tous</option>
                  {niveauOptions.map((n: any) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Salaire min (DT)
                </label>
                <input
                  type="number" min={0} value={salaryMin}
                  onChange={(e) => { setSalaryMin(e.target.value); setPage(1) }}
                  placeholder="ex: 1000" className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Salaire max (DT)
                </label>
                <input
                  type="number" min={0} value={salaryMax}
                  onChange={(e) => { setSalaryMax(e.target.value); setPage(1) }}
                  placeholder="ex: 5000" className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Date limite avant le
                </label>
                <input
                  type="date" value={deadlineTo}
                  onChange={(e) => { setDeadlineTo(e.target.value); setPage(1) }}
                  className={inputCls}
                />
              </div>
            </div>

            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="mt-4 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <FiX size={14} /> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" color="warning" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-16 text-gray-400">
            Impossible de charger les offres. Veuillez réessayer.
          </div>
        )}

        {!isLoading && !isError && (
          offers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Aucune offre ne correspond aux critères.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedOffers.map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-yellow-500 group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
                        {getInitials(job.title)}
                      </div>
                      <div>
                        <Typography variant="h6" weight="semibold" className="text-gray-900 dark:text-white mb-1 group-hover:text-yellow-500 transition-colors leading-snug">
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

                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
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
                      {intl.formatMessage({ id: 'button.details', defaultMessage: 'Détails' })}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              total={totalPages}
              page={page}
              onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              color="warning"
              showControls
              radius="lg"
            />
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  )
}