import axios, { AxiosInstance } from 'axios'
import { API_URLS } from '../constants/authConfig'
import AxiosAuth from './axiosAuth'

// ─── Refresh-queue state (shared across all instances) ───────────────────────
// When one request triggers a refresh, all other concurrent 401s wait in this
// queue and are replayed (or rejected) once the refresh settles.

let isRefreshing = false
let refreshQueue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = []

function drainQueue(error?: unknown) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  refreshQueue = []
}

function waitForRefresh(): Promise<void> {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject })
  })
}

// ─── Resettable singleton ─────────────────────────────────────────────────────

function createInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/v1',
    withCredentials: true,
    timeout: 60_000,
    headers: { 'X-CSRFToken': 'some token' },
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (
        !error.response ||
        error.response.status !== 401 ||
        !originalRequest
      ) {
        return Promise.reject(error)
      }

      const url: string = originalRequest.url ?? ''

      // Auth endpoints never retry
      if (
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/check')
      ) {
        return Promise.reject(error)
      }

      // ── Already refreshing: queue this request and wait ──────────────────
      if (isRefreshing) {
        return waitForRefresh()
          .then(() => _instance(originalRequest))
          .catch(() => Promise.reject(error))
      }

      // ── This request owns the refresh ────────────────────────────────────
      originalRequest._retry = true
      isRefreshing = true

      // Step 1: check token state
      let accessTokenState = false
      try {
        const res = await AxiosAuth.post(API_URLS.check)
        accessTokenState = res.data?.accessTokenState ?? false
      } catch {
        // check failed – proceed to refresh attempt
      }

      // Step 2: access token still valid → resolve queue + retry
      if (accessTokenState) {
        isRefreshing = false
        drainQueue()
        return _instance(originalRequest)
      }

      // Step 3: try to refresh – on success resolve queue, on failure reject all
      try {
        await AxiosAuth.post(API_URLS.refreshToken)
        isRefreshing = false
        drainQueue()
        return _instance(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        drainQueue(refreshError)
        // Refresh failed → reset instance and redirect to login
        // (skip redirect if already on the login page to avoid loops)
        console.warn('[ApiClient] Auth recovery failed – resetting session.')
        resetHttpInstance()
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }
  )

  return instance
}

let _instance: AxiosInstance = createInstance()

/** Replace the current singleton with a brand-new instance (empty state). */
export function resetHttpInstance(): void {
  isRefreshing = false
  refreshQueue = []
  _instance = createInstance()
}

// ─── ApiClient proxy ──────────────────────────────────────────────────────────

const ApiClient = {
  get:    <T = unknown>(...args: Parameters<AxiosInstance['get']>)    => _instance.get<T>(...args),
  post:   <T = unknown>(...args: Parameters<AxiosInstance['post']>)   => _instance.post<T>(...args),
  put:    <T = unknown>(...args: Parameters<AxiosInstance['put']>)    => _instance.put<T>(...args),
  delete: <T = unknown>(...args: Parameters<AxiosInstance['delete']>) => _instance.delete<T>(...args),
  patch:  <T = unknown>(...args: Parameters<AxiosInstance['patch']>)  => _instance.patch<T>(...args),
}

export default ApiClient
