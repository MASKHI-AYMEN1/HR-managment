import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useUsersApi, { UserPayload } from '@/services/users/useUsersApi'
import TextInput from '@/components/TextInput'
import CustomSelect from '@/components/CustomSelect'
import { useIntl } from 'react-intl'
import useToast from '@/common/hooks/useToast'
import useProfilesApi, { Profile } from '@/services/profiles/useProfilesApi'

export interface UserDrawerFormProps {
  mode: 'create' | 'edit'
  userId?: string
  onSuccess?: () => void
  formId: string
}

const UserDrawerForm: React.FC<UserDrawerFormProps> = ({ mode, userId, onSuccess, formId }) => {
  const intl = useIntl()
  const { showToast } = useToast()
  const { useGetUser, useCreateUser, useUpdateUser } = useUsersApi()
  const { useListProfiles } = useProfilesApi()
  const { data: profilesData } = useListProfiles()
  const profiles: Profile[] = profilesData?.profiles || []
  const { data: user, isLoading: loadingUser } =
    mode === 'edit' && userId ? useGetUser(userId) : { data: null, isLoading: false }
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser(userId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserPayload>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      password: '',
      roles: [],
    },
  })

  useEffect(() => {
    if (mode === 'edit' && user) {
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
  }, [mode, user, reset])

  const onSubmit: SubmitHandler<UserPayload> = (values) => {
    const mutation = mode === 'create' ? createMutation : updateMutation
    mutation.mutate(values, {
      onSuccess: () => {
        showToast({
          type: 'success',
          message: intl.formatMessage({ id: `user.${mode === 'create' ? 'created' : 'updated'}`, defaultMessage: mode === 'create' ? 'User created' : 'User updated' }),
        })
        if (onSuccess) onSuccess()
      },
      onError: () => {
        showToast({
          type: 'error',
          message: intl.formatMessage({ id: `user.${mode === 'create' ? 'createError' : 'updateError'}`, defaultMessage: mode === 'create' ? 'Failed to create user' : 'Failed to update user' }),
        })
      },
    })
  }

  if (mode === 'edit' && loadingUser) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="max-w-md">
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
        label={intl.formatMessage({ id: 'user.password', defaultMessage: mode === 'create' ? 'Password' : 'Password (leave blank to keep current)' })}
        name="password"
        placeholder=""
        control={control}
        errorMessage={errors.password?.message || ''}
        isInvalid={!!errors.password}
      />
      {/* roles field could be added here */}
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
  )
}

export default UserDrawerForm
