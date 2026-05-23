import axios, { AxiosInstance } from 'axios'
import { API_URLS } from '../constants/authConfig'
import AxiosAuth from './axiosAuth'

// ─── Resettable singleton ─────────────────────────────────────────────────────
// Each call to createInstance() wires up fresh interceptors bound to that instance.
// resetHttpInstance() is called on logout and on complete auth failure so the
// next login starts with a clean slate (no stale retry state).

function createInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/v1',
    withCredentials: true,   // send + receive cookies for every API call
    timeout: 60_000,
    headers: { 'X-CSRFToken': 'some token' },
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Only handle 401s on the first attempt; never on auth-management endpoints
      if (
        !error.response ||
        error.response.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        return Promise.reject(error)
      }

      const url: string = originalRequest.url ?? ''
      if (
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/check') ||
        url.includes('/users/me')    // unauthenticated is valid – let caller handle it
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      // ── Step 1: check current token state ───────────────────────────────
      let accessTokenState = false
      let refreshTokenState = false
      try {
        const res = await AxiosAuth.post(API_URLS.check)
        accessTokenState = res.data?.accessTokenState ?? false
        refreshTokenState = res.data?.refreshTokenState ?? false
      } catch {
        // check endpoint itself failed – assume refresh token may still be valid
        // and fall through to the refresh attempt below
      }

      // ── Step 2: access token still valid → retry immediately ────────────
      if (accessTokenState) {
        return _instance(originalRequest)
      }

      // ── Step 3: try to refresh (also runs when check itself failed) ──────
      // Always attempt refresh whenever the access token is not confirmed valid.
      // This covers: refreshTokenState=true, check threw, or any other case.
      try {
        await AxiosAuth.post(API_URLS.refreshToken)
        return _instance(originalRequest)
      } catch {
        // refresh failed → fall through to hard logout
      }

      // ── Step 4: both check and refresh failed → reset + redirect to home ─
      console.warn('[ApiClient] Auth recovery failed – resetting session.')
      resetHttpInstance()
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      return Promise.reject(error)
    }
  )

  return instance
}

let _instance: AxiosInstance = createInstance()

/** Replace the current singleton with a brand-new instance (empty state). */
export function resetHttpInstance(): void {
  _instance = createInstance()
}

// ─── ApiClient proxy ──────────────────────────────────────────────────────────
// Always delegates to the current _instance so callers that imported ApiClient
// before a reset will automatically use the new instance.

const ApiClient = {
  get:    <T = unknown>(...args: Parameters<AxiosInstance['get']>)    => _instance.get<T>(...args),
  post:   <T = unknown>(...args: Parameters<AxiosInstance['post']>)   => _instance.post<T>(...args),
  put:    <T = unknown>(...args: Parameters<AxiosInstance['put']>)    => _instance.put<T>(...args),
  delete: <T = unknown>(...args: Parameters<AxiosInstance['delete']>) => _instance.delete<T>(...args),
  patch:  <T = unknown>(...args: Parameters<AxiosInstance['patch']>)  => _instance.patch<T>(...args),
}

export default ApiClient
