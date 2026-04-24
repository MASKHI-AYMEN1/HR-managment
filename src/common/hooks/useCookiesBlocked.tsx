import { useEffect, useState } from 'react'

export default function useCookiesBlocked() {
  const [cookiesBlocked, setCookiesBlocked] = useState(false)

  useEffect(() => {
    document.cookie = 'testcookie=1; SameSite=Lax'
    const isCookieSet = document.cookie.includes('testcookie=1')

    if (!isCookieSet) {
      setCookiesBlocked(true)
    }

    document.cookie = 'testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }, [])

  return cookiesBlocked
}
