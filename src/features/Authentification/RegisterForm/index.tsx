import { defaultToastOption } from '@/common/constants/defaultToastOption'
import { LOGIN_PATH } from '@/common/constants/paths'
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '@/common/constants/toastMessages'
import useToast from '@/common/hooks/useToast'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import { Link, Spinner } from '@heroui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { RegisterFormValidationSchema, RegisterValidationSchema } from './constants'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'
import { useIntl } from 'react-intl'

export default function RegisterForm() {
  const intl = useIntl()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)

  const { useRegister } = useAuthenticationAPI()
  const { mutate } = useRegister()
  const router = useRouter()
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValidationSchema>({
    resolver: zodResolver(RegisterFormValidationSchema),
  })

  const onSubmit: SubmitHandler<RegisterValidationSchema> = async (
    data: RegisterValidationSchema
  ) => {
    setIsLoading(true)
    const { confirmPassword, ...registerData } = data
    mutate(registerData, {
      onSuccess: () => {
        showToastMessage('success', 'Inscription réussie! Redirection...')
        setIsLoading(false)
        setIsLoadingDashboard(true)
        router.push('/redirect')
      },
      onError: (error: any) => {
        const message = error?.response?.data?.detail || ERROR_MESSAGE
        showToastMessage('error', message)
        setIsLoading(false)
      },
    })
  }

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    showToast({
      type,
      message,
      data: {
        ...defaultToastOption,
        description: message,
      },
    })
  }

  if (isLoadingDashboard) return <Loader />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center items-center transition-colors duration-300">
      <div className="max-w-screen-xl w-full m-0 sm:m-6 bg-white dark:bg-gray-900 shadow-2xl sm:rounded-2xl flex justify-center flex-1 overflow-hidden">
        
        {/* Section Formulaire */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center">
          
          {/* Titre */}
          <h1 className="text-2xl font-bold text-yellow-500 dark:text-yellow-400 text-center mb-8 uppercase">
            Créer un compte
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-sm"
          >
            <TextInput
              type="text"
              label="Prénom"
              name="firstName"
              errorMessage={errors.firstName?.message || ''}
              isInvalid={!!errors.firstName}
              control={control}
              placeholder=""
            />
            
            <TextInput
              type="text"
              label="Nom"
              name="lastName"
              errorMessage={errors.lastName?.message || ''}
              isInvalid={!!errors.lastName}
              control={control}
              placeholder=""
            />
            
            <TextInput
              type="email"
              label="Email"
              name="email"
              errorMessage={errors.email?.message || ''}
              isInvalid={!!errors.email}
              control={control}
              placeholder=""
            />
            
            <TextInput
              type="text"
              label="Nom d'utilisateur"
              name="login"
              errorMessage={errors.login?.message || ''}
              isInvalid={!!errors.login}
              control={control}
              placeholder=""
            />
            
            <TextInput
              type="password"
              label="Mot de passe"
              name="password"
              errorMessage={errors.password?.message || ''}
              isInvalid={!!errors.password}
              control={control}
              placeholder=""
            />
            
            <TextInput
              type="password"
              label="Confirmer le mot de passe"
              name="confirmPassword"
              errorMessage={errors.confirmPassword?.message || ''}
              isInvalid={!!errors.confirmPassword}
              control={control}
              placeholder=""
            />

            {/* Bouton Register */}
            <button
              className="mt-6 tracking-wide font-semibold bg-yellow-500 text-white w-full py-3 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
              type="submit"
            >
              {isLoading ? <Spinner color="default" /> : "S'inscrire"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-sm flex justify-center">
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte?
            </p>
            <Link
              href={LOGIN_PATH}
              className="ml-1 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Section Bannière */}
        <div className="flex-1 hidden lg:flex relative">
          <div
            className="w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/banner-login.png')" }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
        </div>
      </div>
    </div>
  )
}
