import React from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import useUsersApi, { UserPayload } from '@/services/users/useUsersApi'
import TextInput from '@/components/TextInput'
import CustomSelect from '@/components/CustomSelect'
import Button from '@/components/Button'
import PageTitle from '@/components/PageTitle'
import useToast from '@/common/hooks/useToast'
import { useIntl } from 'react-intl'
import IconButton from '@/components/IconButton'
import { FaArrowRotateLeft } from "react-icons/fa6";
import AppDrawer from '@/components/Drawer'
import useProfilesApi, { Profile } from '@/services/profiles/useProfilesApi'

interface FormValues extends UserPayload {}

export default function CreateUserPage() {
  const router = useRouter()
  const intl = useIntl()
  const { showToast } = useToast()
  const { useCreateUser } = useUsersApi()
  const createMutation = useCreateUser()
  const { useListProfiles } = useProfilesApi()
  const { data: profilesData } = useListProfiles()
  const profiles: Profile[] = profilesData?.profiles || []

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      password: '',
      roles: [],
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        showToast({ type: 'success', message: intl.formatMessage({ id: 'user.created', defaultMessage: 'User created' }) })
        router.push('/admin/users')
      },
      onError: () => {
        showToast({ type: 'error', message: intl.formatMessage({ id: 'user.createError', defaultMessage: 'Failed to create user' }) })
      },
    })
  }

  // close drawer by returning to list route
  const close = () => {
    router.push('/admin/users')
  }

  return (
    <AppDrawer
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title={intl.formatMessage({ id: 'user.createTitle', defaultMessage: 'Create user' })}
      footer={
        <Button type="submit" color='warning' disabled={isSubmitting} form="user-form">
          {intl.formatMessage({ id: 'button.save', defaultMessage: 'Save' })}
        </Button>
      }
    >
      <div className="p-6 border rounded bg-white shadow">
        <div className="flex items-center justify-between mb-6">
          <PageTitle className='text-yellow-500' title={intl.formatMessage({ id: 'user.createTitle', defaultMessage: 'Create user' })} />
          <IconButton color="warning" onClick={close}>
            <FaArrowRotateLeft />
          </IconButton>
        </div>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="max-w-md">
          <TextInput
            label={intl.formatMessage({ id: 'user.firstName', defaultMessage: 'First name' })}
            name="firstName"
            placeholder=""
            control={control}
            errorMessage={errors.firstName?.message || ''}
            isInvalid={!!errors.firstName}
          />
          <TextInput
            label={intl.formatMessage({ id: 'user.lastName', defaultMessage: 'Last name' })}
            name="lastName"
            placeholder=""
            control={control}
            errorMessage={errors.lastName?.message || ''}
            isInvalid={!!errors.lastName}
          />
          <TextInput
            label={intl.formatMessage({ id: 'user.email', defaultMessage: 'Email' })}
            name="email"
            placeholder=""
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
            label={intl.formatMessage({ id: 'user.password', defaultMessage: 'Password' })}
            name="password"
            placeholder=""
            control={control}
            errorMessage={errors.password?.message || ''}
            isInvalid={!!errors.password}
          />
          {/* additional fields like roles could be added here */}
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