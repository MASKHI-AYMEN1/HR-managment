import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { Pagination } from '@heroui/react'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import GenericTable from '@/components/Table'
import Button from '@/components/Button'
import Typography from '@/components/Typographie'
import useInterviewEvaluationApi, {
  CandidatureInterviewInfo,
} from '@/services/interview-evaluation/useInterviewEvaluationApi'

const PAGE_SIZE = 10

export default function InterviewManagerPage() {
  const intl = useIntl()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isClosed, setIsClosed] = useState(false)
  const [offerName, setOfferName] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const {
    useListCandidaturesForManager,
  } = useInterviewEvaluationApi()

  const { data: paged, isLoading } = useListCandidaturesForManager(
    page,
    PAGE_SIZE,
    search || undefined,
    isClosed,
    offerName || undefined,
    candidateName || undefined
  )
  const candidatures = paged?.data ?? []
  const total = paged?.total ?? 0
  const totalPages = paged?.totalPages ?? 1

  const openEvaluation = (candidatureId: string) => {
    router.push(`/admin/interviews/manager-evaluate?candidatureId=${candidatureId}`)
  }

  const columns = [
    { uid: 'name', name: 'Candidat' },
    { uid: 'email', name: 'Email' },
    { uid: 'offer', name: 'Offre' },
    { uid: 'status', name: 'Statut' },
    { uid: 'actions', name: 'Actions' },
  ]

  const renderCell = (item: CandidatureInterviewInfo, key: React.Key) => {
    switch (key) {
      case 'name':
        return <Typography className="font-medium">{item.candidatureName}</Typography>
      case 'email':
        return <Typography>{item.candidatureEmail || '-'}</Typography>
      case 'offer':
        return <Typography>{item.offerTitle}</Typography>
      case 'status':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            {item.candidatureStatus}
          </span>
        )
      case 'actions':
        return (
          <Button size="sm" color="warning" onClick={() => openEvaluation(item.candidatureId)}>
            {item.evaluationManager && item.evaluationManager.isClosed ? 'Modifier' : 'Évaluer'}
          </Button>
        )
      default:
        return null
    }
  }

  // Map candidatures to add 'id' property for table keys
  const candidaturesWithId = candidatures.map(c => ({
    ...c,
    id: c.candidatureId,
  }))

  const paginated = {
    items: candidaturesWithId,
    totalPages,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    totalCount: total,
  }

  return (
    <AdminLayout>
      <PageTitle title="Entretien Manager" />

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Recherche générale..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button
              size="sm"
              color={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              startContent={<FiFilter />}
            >
              Filtres
            </Button>
            <Typography className="text-gray-500">
              Total: <span className="font-bold text-warning-600">{total}</span> candidatures
            </Typography>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <select
                  value={isClosed ? 'closed' : 'open'}
                  onChange={(e) => { setIsClosed(e.target.value === 'closed'); setPage(1) }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="open">Non clôturées</option>
                  <option value="closed">Clôturées</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Nom de l'offre
                </label>
                <input
                  type="text"
                  value={offerName}
                  onChange={(e) => { setOfferName(e.target.value); setPage(1) }}
                  placeholder="Filtrer par offre..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Nom du candidat
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => { setCandidateName(e.target.value); setPage(1) }}
                  placeholder="Filtrer par candidat..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <GenericTable<CandidatureInterviewInfo>
          data={paginated}
          columns={columns}
          renderCell={renderCell}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination total={totalPages} page={page} onChange={setPage} color="primary" showControls />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
