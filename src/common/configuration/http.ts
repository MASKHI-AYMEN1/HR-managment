import axios from 'axios'
import { API_URLS } from '../constants/authConfig'
import AxiosAuth from './axiosAuth'

const headers = {
  'X-CSRFToken': 'some token',
}
const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/v1',
  withCredentials: true,
  timeout: 60000,
  headers: headers,
})

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (
        typeof originalRequest.url === 'string' &&
        (originalRequest.url.includes('/auth/login') ||
          originalRequest.url.includes('/auth/refresh') ||
          originalRequest.url.includes('/auth/check'))
      ) {
        return Promise.reject(error)
      }

      try {
        originalRequest._retry = true
        const { refreshTokenState, accessTokenState } =
          await checkToken(API_URLS.check)

        if (!accessTokenState && refreshTokenState) {
          await refreshTokenAndRetryRequest()
          return AxiosInstance(originalRequest)
        }
      } catch (error) {
        console.error('Error handling response:', error)
      }
    }

    return Promise.reject(error)
  }
)

async function checkToken(url: string) {
  try {
    const response = await AxiosAuth.post(url)
    const { accessToken, refreshTokenState, accessTokenState } = response.data

    return { accessToken, refreshTokenState, accessTokenState }
  } catch (error) {
    console.error('Error checking token:', error)
    throw error
  }
}

async function refreshTokenAndRetryRequest() {
  try {
    await AxiosAuth.post(API_URLS.refreshToken)
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}

const ApiClient = {
  get: AxiosInstance.get,
  post: AxiosInstance.post,
  put: AxiosInstance.put,
  delete: AxiosInstance.delete,
  patch: AxiosInstance.patch,
}

export default ApiClient
