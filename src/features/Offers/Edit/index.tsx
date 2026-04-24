import React from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import AppDrawer from '@/components/Drawer'
import OfferDrawerForm from '@/features/Offers/OfferDrawerForm'
import Button from '@/components/Button'


export default function EditOfferPage() {
  const router = useRouter()
  const { id } = router.query
  const intl = useIntl()

  const close = () => {
    router.push('/admin/offers')
  }

  return (
    <AppDrawer
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title={intl.formatMessage({ id: 'offer.editTitle', defaultMessage: 'Edit offer' })}
      footer={
        <Button type="submit" color="warning" form="offer-form">
          {intl.formatMessage({ id: 'button.save', defaultMessage: 'Save' })}
        </Button>
      }
      size="md"
    >
      <OfferDrawerForm
          mode="edit"
          offerId={typeof id === 'string' ? id : undefined}
          formId="offer-form"
          onSuccess={() => {
            router.push('/admin/offers')
          }}
        />
    </AppDrawer>
  )
}
