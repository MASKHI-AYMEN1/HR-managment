'use client'

import { useEffect, useState } from 'react'

export function useHttpOnlyCookieExists(cookiename: string): boolean {
  const [cookieExists, setCookieExists] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') {
      setCookieExists(false)

      return
    }

    const d = new Date()
    d.setTime(d.getTime() + 1000)
    const expires = 'expires=' + d.toUTCString()

    document.cookie = `${cookiename}=new_value;path=/;${expires}`
    setCookieExists(document.cookie.indexOf(`${cookiename}=`) === -1)
  }, [cookiename])

  return cookieExists
}
