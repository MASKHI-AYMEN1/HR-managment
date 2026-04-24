import axios from 'axios'

const AxiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api/v2/',
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
  },
})

export default AxiosAuth
