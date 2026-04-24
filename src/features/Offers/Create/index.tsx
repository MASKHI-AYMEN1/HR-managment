import React from 'react'
import { useRouter } from 'next/router'
// form logic is inside OfferDrawerForm
import Button from '@/components/Button'
import PageTitle from '@/components/PageTitle'
import useToast from '@/common/hooks/useToast'
import { useIntl } from 'react-intl'
import IconButton from '@/components/IconButton'
import { FaArrowRotateLeft } from "react-icons/fa6";
import AppDrawer from '@/components/Drawer'
import OfferDrawerForm from '../OfferDrawerForm'


export default function CreateOfferPage() {
  const router = useRouter()
  const intl = useIntl()
  const { showToast } = useToast()
  // the form and mutation are handled by OfferDrawerForm

  // close drawer by returning to list route
  const close = () => {
    router.push('/admin/offers')
  }

  return (
    <AppDrawer
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title={intl.formatMessage({ id: 'offer.createTitle', defaultMessage: 'Create offer' })}
      footer={
        <Button type="submit" color='warning' form="offer-form">
          {intl.formatMessage({ id: 'button.save', defaultMessage: 'Save' })}
        </Button>
      }
      size='2xl'
    >
      <div className="p-6 border rounded bg-white shadow">
        <div className="flex items-center justify-between mb-6">
          <PageTitle className='text-yellow-500' title={intl.formatMessage({ id: 'offer.createTitle', defaultMessage: 'Create offer' })} />
          <IconButton color="warning" onClick={close}>
            <FaArrowRotateLeft />
          </IconButton>
        </div>
        <OfferDrawerForm
          mode="create"
          formId="offer-form"
          onSuccess={() => {
            router.push('/admin/offers')
          }}
        />
      </div>
    </AppDrawer>
  )
}
