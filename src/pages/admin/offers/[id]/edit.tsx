import React from 'react'
import EditOfferPage from '@/features/Offers/Edit'
import AdminLayout from '@/layouts/AdminLayout'

const Edit = () => <EditOfferPage />

Edit.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Edit
