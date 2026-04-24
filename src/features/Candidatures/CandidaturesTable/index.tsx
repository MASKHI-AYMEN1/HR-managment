import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { FiFileText, FiSearch, FiEye } from 'react-icons/fi'
import { TbFileSpreadsheet } from 'react-icons/tb'
import { MdOutlineHowToVote } from 'react-icons/md'
import { useDisclosure, Pagination, Select, SelectItem } from '@heroui/react'
import GenericTable from '@/components/Table'
import Button from '@/components/Button'
import Typography from '@/components/Typographie'
import StatusDecisionModal, { DecisionPayload } from '@/features/Candidatures/StatusDecisionModal'
import CandidatureTransitionModal, { TransitionPayload } from '@/features/Candidatures/CandidatureTransitionModal'
import CandidatureDetailModal from '@/features/Candidatures/CandidatureDetailModal'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'

export type Candidature = {
  id: string
  offerId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateNaissance?: string
  createdAt?: string
  status?: string
  interviewDate?: string
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  // Anciens statuts
  en_attente: { label: 'En attente', color: 'bg-warning-100 text-warning-700' },
  accepter:   { label: 'Accepter',   color: 'bg-success-100 text-success-700' },
  refuser:    { label: 'Refuser',    color: 'bg-danger-100  text-danger-700'  },
  entretien:  { label: 'Entretien',  color: 'bg-primary-100 text-primary-700' },
  // Nouveaux statuts state machine
  evaluation_rh: { label: 'Évaluation RH', color: 'bg-blue-100 text-blue-700' },
  evaluation_technique: { label: 'Évaluation Technique', color: 'bg-purple-100 text-purple-700' },
  evaluation_manager: { label: 'Évaluation Manager', color: 'bg-indigo-100 text-indigo-700' },
  accepte: { label: 'Accepté', color: 'bg-success-100 text-success-700' },
  refuse: { label: 'Refusé', color: 'bg-danger-100 text-danger-700' },
  refuse_evaluation_rh: { label: 'Refusé (RH)', color: 'bg-danger-100 text-danger-700' },
  refuse_evaluation_technique: { label: 'Refusé (Technique)', color: 'bg-danger-100 text-danger-700' },
  refuse_evaluation_manager: { label: 'Refusé (Manager)', color: 'bg-danger-100 text-danger-700' },
}

const PAGE_SIZE = 10

interface CandidaturesTableProps {
  offerId: string
  isExporting: boolean
  onExport: () => void
  isExportingCv: boolean
  onExportCv: () => void
}

export default function CandidaturesTable({
  offerId,
  isExporting,
  onExport,
  isExportingCv,
  onExportCv,
}: CandidaturesTableProps) {
  const intl = useIntl()

  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [page,     setPage]     = useState(1)

  const { isOpen: isDecisionOpen, onOpen: onDecisionOpen, onOpenChange: onDecisionChange } = useDisclosure()
  const { isOpen: isTransitionOpen, onOpen: onTransitionOpen, onOpenChange: onTransitionChange } = useDisclosure()
  const { isOpen: isDetailOpen,   onOpen: onDetailOpen,   onOpenChange: onDetailChange   } = useDisclosure()
  const [selected, setSelected] = useState<Candidature | null>(null)
  const [availableActions, setAvailableActions] = useState<string[]>([])

  const { useListCandidaturesByOffer, useUpdateCandidatureStatus, useTransitionCandidatureStatus, useGetAvailableActions } = useCandidatureApi()
  const { data: paged, isLoading } = useListCandidaturesByOffer({
    offerId,
    search:   search   || undefined,
    status:   status   || undefined,
    dateFrom: dateFrom || undefined,
    dateTo:   dateTo   || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const candidatures = paged?.data       ?? []
  const total        = paged?.total      ?? 0
  const totalPages   = paged?.totalPages ?? 1

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCandidatureStatus()
  const { mutate: transitionStatus, isPending: isTransitioning } = useTransitionCandidatureStatus()
  const { data: actionsData } = useGetAvailableActions(selected?.id)

  // Update available actions when selection changes
  useEffect(() => {
    if (actionsData?.availableActions) {
      setAvailableActions(actionsData.availableActions)
    }
  }, [actionsData])

  const resetFilters = () => { setSearch(''); setStatus(''); setDateFrom(''); setDateTo(''); setPage(1) }
  
  const openDecision = (c: Candidature) => { 
    setSelected(c)
    // Si le statut est un des nouveaux statuts de la state machine, utiliser le modal de transition
    const newStatuses = ['en_attente', 'evaluation_rh', 'evaluation_technique', 'evaluation_manager']
    if (newStatuses.includes(c.status || 'en_attente')) {
      onTransitionOpen()
    } else {
      onDecisionOpen()
    }
  }
  
  const openDetail   = (c: Candidature) => { setSelected(c); onDetailOpen()   }

  const handleConfirm = (payload: DecisionPayload, onClose: () => void) => {
    if (!selected) return
    updateStatus(
      { id: selected.id, status: payload.status, interviewDate: payload.interviewDate, sendEmail: payload.sendEmail },
      { onSuccess: () => onClose() },
    )
  }

  const handleTransition = (payload: TransitionPayload, onClose: () => void) => {
    if (!selected) return
    transitionStatus(
      { id: selected.id, action: payload.action, interviewDate: payload.interviewDate, sendEmail: payload.sendEmail },
      { onSuccess: () => onClose() },
    )
  }

  const columns = [
    { uid: 'firstName', name: intl.formatMessage({ id: 'candidature.firstName', defaultMessage: 'Prenom' }) },
    { uid: 'lastName',  name: intl.formatMessage({ id: 'candidature.lastName',  defaultMessage: 'Nom'    }) },
    { uid: 'phone',     name: intl.formatMessage({ id: 'candidature.phone',     defaultMessage: 'Telephone' }) },
    { uid: 'createdAt', name: 'Date de candidature' },
    { uid: 'status',    name: intl.formatMessage({ id: 'candidature.status',    defaultMessage: 'Statut' }) },
    { uid: 'actions',   name: 'Actions' },
  ]

  const renderCell = (item: Candidature, key: React.Key) => {
    switch (key) {
      case 'firstName': return <Typography>{item.firstName}</Typography>
      case 'lastName':  return <Typography>{item.lastName}</Typography>
      case 'phone':     return <Typography>{item.phone || '-'}</Typography>
      case 'createdAt': return (
        <Typography>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
        </Typography>
      )
      case 'status': {
        const s = item.status || 'en_attente'
        const meta = STATUS_LABEL[s] ?? STATUS_LABEL['en_attente']
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
            {intl.formatMessage({ id: `candidature.status.${s}`, defaultMessage: meta.label })}
          </span>
        )
      }
      case 'actions': return (
        <div className="flex items-center gap-2">
          <Button size="sm" color="warning" onClick={() => openDetail(item)} startContent={<FiEye size={14} />}>
            {intl.formatMessage({ id: 'button.detail', defaultMessage: 'Detail' })}
          </Button>
          <Button size="sm" color="warning"  onClick={() => openDecision(item)} startContent={<MdOutlineHowToVote size={15} />}>
            {intl.formatMessage({ id: 'button.decision', defaultMessage: 'Decision' })}
          </Button>
        </div>
      )
      default: return null
    }
  }

  const paginated = {
    items:      candidatures,
    totalPages: totalPages,
    pageNumber: page,
    pageSize:   PAGE_SIZE,
    totalCount: total,
  }

  const hasFilter = !!(search || status || dateFrom || dateTo)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Typography className="font-semibold text-gray-700 dark:text-gray-200">
            {intl.formatMessage({ id: 'candidature.listTitle', defaultMessage: 'Candidatures' })}
          </Typography>
          <span className="px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-xs font-bold">
            {total}
          </span>
        </div>
        <div className="flex gap-3">
          <Button color="success" isLoading={isExporting} onClick={onExport} startContent={!isExporting && <FiFileText size={15} />}>
            {intl.formatMessage({ id: 'button.exportExcel', defaultMessage: 'Exporter Excel' })}
          </Button>
          <Button color="success" isLoading={isExportingCv} onClick={onExportCv} startContent={!isExportingCv && <TbFileSpreadsheet size={16} />}>
            {intl.formatMessage({ id: 'button.exportCvDetails', defaultMessage: 'Details CV' })}
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'filter.search', defaultMessage: 'Recherche (nom / prenom)' })}
          </label>
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder={intl.formatMessage({ id: 'filter.searchPlaceholder', defaultMessage: 'Nom ou prenom...' })}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'candidature.status', defaultMessage: 'Statut' })}
          </label>
          <Select
            size="sm"
            placeholder={intl.formatMessage({ id: 'filter.allStatuses', defaultMessage: 'Tous' })}
            selectedKeys={status ? new Set([status]) : new Set([])}
            onSelectionChange={(keys) => { const val = Array.from(keys)[0] as string; setStatus(val ?? ''); setPage(1) }}
          >
            <SelectItem key="en_attente">
              {intl.formatMessage({ id: 'candidature.status.en_attente', defaultMessage: 'En attente' })}
            </SelectItem>
            <SelectItem key="evaluation_rh">
              Évaluation RH
            </SelectItem>
            <SelectItem key="evaluation_technique">
              Évaluation Technique
            </SelectItem>
            <SelectItem key="evaluation_manager">
              Évaluation Manager
            </SelectItem>
            <SelectItem key="accepte">
              Accepté
            </SelectItem>
            <SelectItem key="refuse">
              Refusé
            </SelectItem>
            <SelectItem key="refuse_evaluation_rh">
              Refusé (RH)
            </SelectItem>
            <SelectItem key="refuse_evaluation_technique">
              Refusé (Technique)
            </SelectItem>
            <SelectItem key="refuse_evaluation_manager">
              Refusé (Manager)
            </SelectItem>
            <SelectItem key="accepter">
              {intl.formatMessage({ id: 'candidature.status.accepter', defaultMessage: 'Accepter (ancien)' })}
            </SelectItem>
            <SelectItem key="refuser">
              {intl.formatMessage({ id: 'candidature.status.refuser', defaultMessage: 'Refuser (ancien)' })}
            </SelectItem>
            <SelectItem key="entretien">
              {intl.formatMessage({ id: 'candidature.status.entretien', defaultMessage: 'Entretien (ancien)' })}
            </SelectItem>
          </Select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'filter.dateFrom', defaultMessage: 'Date de debut' })}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'filter.dateTo', defaultMessage: 'Date de fin' })}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {hasFilter && (
          <Button size="sm" color="warning" onClick={resetFilters}>
            {intl.formatMessage({ id: 'filter.reset', defaultMessage: 'Reinitialiser' })}
          </Button>
        )}
      </div>

      {/* Table */}
      <GenericTable<Candidature>
        data={paginated}
        columns={columns}
        renderCell={renderCell}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination total={totalPages} page={page} onChange={(p) => setPage(p)} color="primary" showControls />
        </div>
      )}

      {selected && (
        <>
          <StatusDecisionModal
            isOpen={isDecisionOpen}
            onOpenChange={onDecisionChange}
            candidatureName={`${selected.firstName} ${selected.lastName}`}
            currentStatus={selected.status || 'en_attente'}
            onConfirm={handleConfirm}
            isLoading={isUpdating}
          />
          
          <CandidatureTransitionModal
            isOpen={isTransitionOpen}
            onOpenChange={onTransitionChange}
            candidatureName={`${selected.firstName} ${selected.lastName}`}
            currentStatus={selected.status || 'en_attente'}
            availableActions={availableActions}
            onConfirm={handleTransition}
            isLoading={isTransitioning}
          />
        </>
      )}

      <CandidatureDetailModal
        isOpen={isDetailOpen}
        onOpenChange={onDetailChange}
        candidature={selected}
      />
    </>
  )
}