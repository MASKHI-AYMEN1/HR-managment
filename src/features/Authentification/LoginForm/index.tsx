import Image from 'next/image'
import { GoogleIcon } from '@/assets/icons/GoogleIcon'
import { defaultToastOption } from '@/common/constants/defaultToastOption'
import {
  FORGET_PASSWORD_PATH,
  GOOGLE_CONNECT_PATH,
  REGISTRATION_PATH,
} from '@/common/constants/paths'
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '@/common/constants/toastMessages'
import useToast from '@/common/hooks/useToast'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'
import { Link, Spinner } from '@heroui/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { LoginFormValidationSchema, LoginValidationSchema } from '../constants'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'
import { useIntl } from 'react-intl'
import { LOGO_ICON } from '@/assets/images'

export default function Index() {
  const intl = useIntl()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)

  const { useLogin } = useAuthenticationAPI()
  const { mutate } = useLogin()
  const router = useRouter()
  const { showToast } = useToast()

  // Show error coming from Google OAuth callback redirect
  useEffect(() => {
    if (router.isReady && router.query.error) {
      showToast({ type: 'error', message: intl.formatMessage({ id: 'login.googleError', defaultMessage: 'Connexion Google échouée. Veuillez réessayer.' }) })
    }
  }, [router.isReady])
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(LoginFormValidationSchema),
  })
  const onSubmit: SubmitHandler<LoginValidationSchema> = async (
    data: LoginValidationSchema
  ) => {
    setIsLoading(true)
    mutate(data, {
      onSuccess: (path:string) => {
        showToastMessage('success', SUCCESS_MESSAGE)
        setIsLoading(false)
        setIsLoadingDashboard(true)
        // Redirect to redirect page instead of direct path
        router.push('/redirect')
      },
      onError: () => {
        showToastMessage('error', ERROR_MESSAGE)
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
        description: type === 'success' ? SUCCESS_MESSAGE : ERROR_MESSAGE,
      },
    })
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }
  const handleConnectWithGoogle = () => {
    // Full browser redirect to backend — backend redirects to Google consent screen
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`
  }

  if (isLoadingDashboard) return <Loader />

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center items-center transition-colors duration-300">
    <div className="max-w-screen-xl w-full m-0 sm:m-6 bg-white dark:bg-gray-900 shadow-2xl sm:rounded-2xl flex justify-center flex-1 overflow-hidden">
      
      {/* Section Formulaire */}
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center">
        
        {/* Logo */}
        {/* <div className="mb-6 flex justify-center">
          <Image
            src={LOGO_ICON}
            alt="logo"
            width={150}
            height={40}
            className="dark:hidden"
          />
          <Image
            src={LOGO_ICON_DARK}
            alt="logo"
            width={150}
            height={40}
            className="hidden dark:block"
          />
        </div> */}

        {/* Titre */}
        <h1 className="text-2xl font-bold text-yellow-500 dark:text-yellow-400 text-center mb-8 uppercase">
          {intl.formatMessage({ id: 'login.title' })}
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-sm"
        >
          <TextInput
            type="email"
            label={intl.formatMessage({ id: 'login.email' })}
            name="email"
            errorMessage={errors.email?.message || ''}
            isInvalid={!!errors.email}
            control={control}
            placeholder=""
          />
          <TextInput
            type="password"
            label={intl.formatMessage({ id: 'login.password' })}
            name="password"
            errorMessage={errors.password?.message || ''}
            isInvalid={!!errors.password}
            control={control}
            placeholder=""
          />

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-yellow-500 focus:ring-yellow-500"
              />
              <span className="ml-2">
                {intl.formatMessage({ id: 'login.rememberMe' })}
              </span>
            </label>

            <Link
              href={FORGET_PASSWORD_PATH}
              className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              {intl.formatMessage({ id: 'login.forgotPassword' })}
            </Link>
          </div>

          {/* Bouton Login */}
          <button
            className="mt-6 tracking-wide font-semibold bg-yellow-500 text-white w-full py-3 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
            type="submit"
          >
            {isLoading ? <Spinner color="default" /> : intl.formatMessage({ id: 'login.submit' })}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
            {intl.formatMessage({ id: 'login.orWithEmail' })}
          </span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleConnectWithGoogle}
          className="w-full max-w-sm mx-auto shadow-md rounded-lg py-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <div className="bg-white p-2 rounded-full" >
            <GoogleIcon />
          </div>
          <span className="ml-4">
            {intl.formatMessage({ id: 'login.google' })}
          </span>
        </button>

        {/* Register */}
        <div className="mt-6 text-sm flex justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'login.noAccount' })}
          </p>
          <Link
            href={REGISTRATION_PATH}
            className="ml-1 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
          >
            {intl.formatMessage({ id: 'login.register' })}
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
