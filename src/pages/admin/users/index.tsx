import TableUsersData from '@/features/Users/UsersTable'
import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'

const Users = () => {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold">Users</h1> */}
      <TableUsersData/>
    </div>
  )
}
Users.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Users
