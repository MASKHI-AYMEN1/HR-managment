import TableOffersData from '@/features/Offers/OffersTable'
import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'

const Offers = () => {
  return (
    <div>
      <TableOffersData/>
    </div>
  )
}
Offers.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Offers
