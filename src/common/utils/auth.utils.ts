import { useCookies } from 'react-cookie'

function useCookiesUtil() {
  const [tokenCookies, setTokenCookie] = useCookies([
    'ACCESS_TOKEN',
    'REFRESH_TOKEN',
  ])

  const getAccessToken = () => {
    return tokenCookies.ACCESS_TOKEN
  }

  const getRefreshToken = () => {
    return tokenCookies.REFRESH_TOKEN
  }

  const setAccessToken = (token: string) => {
    setTokenCookie('ACCESS_TOKEN', token, { path: '/' })
  }

  const setRefreshToken = (token: string) => {
    setTokenCookie('REFRESH_TOKEN', token, { path: '/' })
  }

  return {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
  }
}

export default useCookiesUtil
