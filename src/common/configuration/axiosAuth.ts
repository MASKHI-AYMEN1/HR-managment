import axios from 'axios'

/**
 * AxiosAuth – used for check, refresh, and logout.
 * Sends and receives cookies (withCredentials: true).
 * No response interceptors so it never loops.
 */
const AxiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

export default AxiosAuth

/**
 * AxiosLogin – used ONLY for the /auth/login call.
 * withCredentials: true so the browser stores the Set-Cookie from the response.
 * Has NO interceptors, so stale tokens never trigger an auto-refresh loop.
 */
export const AxiosLogin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})
