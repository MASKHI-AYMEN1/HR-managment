import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Loader from '@/components/Loader'
import { useIntl } from 'react-intl'

/**
 * This page is the OAuth callback landing page.
 * The backend sets httpOnly cookies then redirects here.
 * We just forward to /redirect which checks auth state.
 */
export default function GoogleCallbackPage() {
  const router = useRouter()
  const intl = useIntl()
  const { success, error } = router.query

  useEffect(() => {
    if (!router.isReady) return

    if (error) {
      router.replace(`/login?error=${error}`)
    } else {
      // Cookies are already set by the backend — go through the normal redirect flow
      router.replace('/redirect')
    }
  }, [router.isReady, success, error])

  return <Loader />
}
