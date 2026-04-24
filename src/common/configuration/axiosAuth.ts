import axios from 'axios'

const AxiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

export default AxiosAuth
