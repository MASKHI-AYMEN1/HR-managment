import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import useUsersApi, { UserPayload } from '@/services/users/useUsersApi'
import TextInput from '@/components/TextInput'
import CustomSelect from '@/components/CustomSelect'
import Button from '@/components/Button'
import PageTitle from '@/components/PageTitle'
import useToast from '@/common/hooks/useToast'
import { useIntl } from 'react-intl'
import AppDrawer from '@/components/Drawer'
import useProfilesApi, { Profile } from '@/services/profiles/useProfilesApi'

interface FormValues extends UserPayload {}

export default function EditUserPage() {
  const router = useRouter()
  const { id } = router.query
  const intl = useIntl()
  const { showToast } = useToast()
  const { useGetUser, useUpdateUser } = useUsersApi()
  const { useListProfiles } = useProfilesApi()
  const { data: profilesData } = useListProfiles()
  const profiles: Profile[] = profilesData?.profiles || []
  const { data: user, isLoading: loadingUser } = useGetUser(typeof id === 'string' ? id : undefined)
  const updateMutation = useUpdateUser(typeof id === 'string' ? id : undefined)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        login: user.login || '',
        password: '',
        roles: user.roles || [],
        profileId: user.profileId || '',
      })
    }
  }, [user, reset])

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        showToast({ type: 'success', message: intl.formatMessage({ id: 'user.updated', defaultMessage: 'User updated' }) })
        router.push('/admin/users')
      },
      onError: () => {
        showToast({ type: 'error', message: intl.formatMessage({ id: 'user.updateError', defaultMessage: 'Failed to update user' }) })
      },
    })
  }

  const close = () => {
    router.push('/admin/users')
  }

  if (loadingUser) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <AppDrawer
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title={intl.formatMessage({ id: 'user.editTitle', defaultMessage: 'Edit user' })}
      footer={
        <Button type="submit" color="warning" disabled={isSubmitting} form="user-form">
          {intl.formatMessage({ id: 'button.save', defaultMessage: 'Save' })}
        </Button>
      }
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <PageTitle title={intl.formatMessage({ id: 'user.editTitle', defaultMessage: 'Edit user' })} />
          <Button color="secondary" onClick={close}>
            {intl.formatMessage({ id: 'button.back', defaultMessage: 'Back' })}
          </Button>
        </div>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="max-w-md">
          <TextInput
            label={intl.formatMessage({ id: 'user.firstName', defaultMessage: 'First name' })}
            name="firstName"
            placeholder={intl.formatMessage({ id: 'user.firstName', defaultMessage: 'First name' })}
            control={control}
            errorMessage={errors.firstName?.message || ''}
            isInvalid={!!errors.firstName}
          />
          <TextInput
            label={intl.formatMessage({ id: 'user.lastName', defaultMessage: 'Last name' })}
            name="lastName"
            placeholder={intl.formatMessage({ id: 'user.lastName', defaultMessage: 'Last name' })}
            control={control}
            errorMessage={errors.lastName?.message || ''}
            isInvalid={!!errors.lastName}
          />
          <TextInput
            label={intl.formatMessage({ id: 'user.email', defaultMessage: 'Email' })}
            name="email"
            placeholder={intl.formatMessage({ id: 'user.email', defaultMessage: 'Email' })}
            type="email"
            control={control}
            errorMessage={errors.email?.message || ''}
            isInvalid={!!errors.email}
          />
          <TextInput
            label={intl.formatMessage({ id: 'user.login', defaultMessage: 'Login' })}
            name="login"
            placeholder=""
            control={control}
            errorMessage={errors.login?.message || ''}
            isInvalid={!!errors.login}
          />
          <TextInput
            type="password"
            label={intl.formatMessage({ id: 'user.password', defaultMessage: 'Password (leave blank to keep current)' })}
            name="password"
            placeholder=""
            control={control}
            errorMessage={errors.password?.message || ''}
            isInvalid={!!errors.password}
          />
          {/* roles can be added here if needed */}
          <CustomSelect
            name="profileId"
            control={control}
            label={intl.formatMessage({ id: 'user.profile', defaultMessage: 'Profil' })}
            placeholder={intl.formatMessage({ id: 'user.selectProfile', defaultMessage: 'Sélectionner un profil' })}
            items={[{ id: '', name: intl.formatMessage({ id: 'user.noProfile', defaultMessage: 'Aucun profil' }) }, ...profiles]}
            getKey={(p) => p.id}
            getLabel={(p) => p.name}
            variant="bordered"
            size="sm"
          />
        </form>
      </div>
    </AppDrawer>
  )
}