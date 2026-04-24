import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import GenericTable from '@/components/Table'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import { PlusIcon } from '@/assets/icons/PlusIcon'
import { FiEdit } from 'react-icons/fi'
import DeleteModal from '@/components/DeleteModal'
import useUsersApi from '@/services/users/useUsersApi'
import Typography from '@/components/Typographie'
import AppDrawer from '@/components/Drawer'
import UserDrawerForm from '@/features/Users/UserDrawerForm'

type User = {
  id: string
  firstName?: string
  lastName?: string
  email: string
  login: string
  roles?: string[]
  profileId?: string
  profileName?: string
}

export default function AdminUsersPage() {
  const {useListUsers, useDeleteUser}= useUsersApi()
  const { data, isLoading, error, refetch } = useListUsers();
  const deleteMutation = useDeleteUser()

  const [drawerState, setDrawerState] = useState<null | { mode: 'create' | 'edit'; userId?: string }>(null)

  const closeDrawer = () => setDrawerState(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: User[] = (data as any) || [];

  const paginated = {
    items: users,
    totalPages: 1,
    pageNumber: 1,
    pageSize: users.length || 10,
    totalCount: users.length || 0,
  }

  const columns = [
    { uid: 'firstName', name: 'First name' },
    { uid: 'lastName', name: 'Last name' },
    { uid: 'email', name: 'Email' },
    { uid: 'login', name: 'Login' },
    { uid: 'profile', name: 'Profil' },
    { uid: 'roles', name: 'Roles' },
    { uid: 'actions', name: 'Actions' },
  ]

  const renderCell = (item: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'firstName':
        return <Typography>{item.firstName || '-'}</Typography>
      case 'lastName':
        return <Typography>{item.lastName || '-'}</Typography>
      case 'email':
        return <Typography>{item.email}</Typography>
      case 'login':
        return <Typography>{item.login}</Typography>
      case 'roles':
        return <Typography>{Array.isArray(item.roles) ? item.roles.join(', ') : item.roles}</Typography>
      case 'profile':
        return <Typography>{item.profileName || '-'}</Typography>
      case 'actions':
        return (
          <div className="flex gap-2">
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
              isPending={deleteMutation.isPending}
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

  function handleEdit(item: User) {
    setDrawerState({ mode: 'edit', userId: item.id })
  }


  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <PageTitle title="Liste des Utilisateurs" />
          <Button color="warning" onClick={() => setDrawerState({ mode: 'create' })} endContent={<PlusIcon />}>
            Create user
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
            ? 'Create user'
            : drawerState?.mode === 'edit'
            ? 'Edit user'
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
              form={drawerState.mode === 'create' ? 'user-create-form' : 'user-edit-form'}
            >
              Save
            </Button>
          </div>
          )
        }
      >
        {drawerState && (
          <UserDrawerForm
            mode={drawerState.mode}
            userId={drawerState.userId}
            formId={
              drawerState.mode === 'create' ? 'user-create-form' : 'user-edit-form'
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
