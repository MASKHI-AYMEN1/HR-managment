import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/Loader'
import ErrorPage from '@/components/ErrorPage'
import useAuthenticationAPI from '@/services/authentication/useAuthenticationApi'

export default function RedirectPage() {
  const router = useRouter()
  const { useGetCurrentUser } = useAuthenticationAPI()
  const { data: currentUser, error } = useGetCurrentUser()

  useEffect(() => {
    if (currentUser) {
      // Check user role and redirect accordingly
      if (currentUser.roles.includes('User')) {
        router.push('/')
      } else if (currentUser.roles.includes('Admin') || currentUser.roles.includes('admin')) {
        router.push('/admin/dashboard')
      } else {
        // Default redirect for other roles
        router.push('/')
      }
    }
  }, [currentUser, router])

  if (error) {
    return <ErrorPage />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Loader />
    </div>
  )
}
