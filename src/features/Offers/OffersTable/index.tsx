import React, { useState } from 'react'
import GenericTable from '@/components/Table'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import { useIntl } from 'react-intl'
import { PlusIcon } from '@/assets/icons/PlusIcon'
import { FiEdit } from 'react-icons/fi'
import { FiUsers } from 'react-icons/fi'
import { useRouter } from 'next/router'
import DeleteModal from '@/components/DeleteModal'
import useOffersApi from '@/services/offers/useOffersApi'
import Typography from '@/components/Typographie'
import AppDrawer from '@/components/Drawer'
import OfferDrawerForm from '@/features/Offers/OfferDrawerForm'

export type Offer = {
  id: string
  title: string
  dateCreation?: string
  dateDeadline?: string
  description?: string
  salary?: number
  niveau?: string
  experienceDomain?: string
  typeContrat?: Array<'CDI' | 'CDD' | 'CIVP'>
  isClosed?: boolean
}

export default function AdminOffersPage() {
  const intl = useIntl()
  const router = useRouter()
  const {useListOffers, useDeleteOffer} = useOffersApi()
  const { data, isLoading, error, refetch } = useListOffers();
  const deleteMutation = useDeleteOffer()

  const [drawerState, setDrawerState] = useState<null | { mode: 'create' | 'edit'; offerId?: string }>(null)

  const closeDrawer = () => setDrawerState(null)

  const offers: Offer[] = data || [];

  const paginated = {
    items: offers,
    totalPages: 1,
    pageNumber: 1,
    pageSize: offers.length || 10,
    totalCount: offers.length || 0,
  }

  const columns = [
    { uid: 'title', name: intl.formatMessage({ id: 'offer.title', defaultMessage: 'Title' }) },
    { uid: 'dateCreation', name: intl.formatMessage({ id: 'offer.dateCreation', defaultMessage: 'Created' }) },
    { uid: 'dateDeadline', name: intl.formatMessage({ id: 'offer.dateDeadline', defaultMessage: 'Deadline' }) },
    { uid: 'salary', name: intl.formatMessage({ id: 'offer.salary', defaultMessage: 'Salary' }) },
    { uid: 'niveau', name: intl.formatMessage({ id: 'offer.niveau', defaultMessage: 'Niveau' }) },
    { uid: 'typeContrat', name: intl.formatMessage({ id: 'offer.typeContrat', defaultMessage: 'Type contrat' }) },
    { uid: 'isClosed', name: intl.formatMessage({ id: 'offer.isClosed', defaultMessage: 'Statut' }) },
    { uid: 'actions', name: intl.formatMessage({ id: 'button.actions', defaultMessage: 'Actions' }) },
  ]

  const renderCell = (item: Offer, columnKey: React.Key) => {
    switch (columnKey) {
      case 'title':
        return <Typography>{item.title}</Typography>
      case 'dateCreation':
        return <Typography>{item.dateCreation || '-'}</Typography>
      case 'dateDeadline':
        return <Typography>{item.dateDeadline || '-'}</Typography>
      case 'salary':
        return <Typography>{item.salary != null ? item.salary : '-'}</Typography>
      case 'niveau':
        return <Typography>{item.niveau || '-'}</Typography>
      case 'typeContrat':
        return <Typography>{item.typeContrat?.length ? item.typeContrat.join(', ') : '-'}</Typography>
      case 'isClosed':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            (item as any).isClosed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
          }`}>
            {(item as any).isClosed ? 'Clôturée' : 'Ouverte'}
          </span>
        )
      case 'actions':
        return (
          <div className="flex gap-2">
            <IconButton
              aria-label={`candidatures-${item.id}`}
              onClick={() => router.push(`/admin/offers/${item.id}/candidatures`)}
              color="primary"
            >
              <FiUsers />
            </IconButton>
            <IconButton
              aria-label={`edit-${item.id}`}
              onClick={() => handleEdit(item)}
              color="warning"
            >
              <FiEdit />
            </IconButton>
            <DeleteModal
              id={item.id}
              mutate={deleteMutation.mutate}
              toggle={() => {
                refetch()
              }}
            />
          </div>
        )
      default:
        return null
    }
  }

  function handleEdit(item: Offer) {
    setDrawerState({ mode: 'edit', offerId: item.id })
  }

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <PageTitle title={intl.formatMessage({ id: 'offer.listTitle', defaultMessage: 'List of Offers' })} />
          <Button color="warning" onClick={() => setDrawerState({ mode: 'create' })} endContent={<PlusIcon />}>
            {intl.formatMessage({ id: 'offer.createTitle', defaultMessage: 'Create offer' })}
          </Button>
        </div>
        <GenericTable
          data={paginated}
          columns={columns}
          renderCell={renderCell}
          isLoading={isLoading}
        />
      </div>

      <AppDrawer
        isOpen={drawerState !== null}
        onOpenChange={(open) => {
          if (!open) closeDrawer()
        }}
        title={
          drawerState?.mode === 'create'
            ? intl.formatMessage({ id: 'offer.createTitle', defaultMessage: 'Create offer' })
            : drawerState?.mode === 'edit'
            ? intl.formatMessage({ id: 'offer.editTitle', defaultMessage: 'Edit offer' })
            : ''
        }
        footer={
          drawerState && (
          <div className="flex gap-2">
            <Button
              type="button"
              color="secondary"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="warning"
              form={drawerState.mode === 'create' ? 'offer-create-form' : 'offer-edit-form'}
            >
              Save
            </Button>
          </div>
          )
        }
        size='3xl'
      >
        {drawerState && (
          <OfferDrawerForm
            mode={drawerState.mode}
            offerId={drawerState.offerId}
            formId={
              drawerState.mode === 'create' ? 'offer-create-form' : 'offer-edit-form'
            }
            onSuccess={() => {
              refetch()
              closeDrawer()
            }}
          />
        )}
      </AppDrawer>
    </>
  )
}
