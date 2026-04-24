import React from 'react'
import CreateOfferPage from '@/features/Offers/Create'
import AdminLayout from '@/layouts/AdminLayout'

const Create = () => <CreateOfferPage />

Create.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Create
