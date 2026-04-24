import { ACCESS_DENIED_PATH } from './paths'

export const API_URLS = {
  authBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  check: process.env.NEXT_PUBLIC_BASE_URL + `/auth/check`,
  authInit: process.env.NEXT_PUBLIC_FRONT_URL + `/login`,
  refreshToken: process.env.NEXT_PUBLIC_BASE_URL + `/auth/refresh`,
  notFound: process.env.NEXT_PUBLIC_FRONT_URL + `/notfound`,
  accessDenied: process.env.NEXT_PUBLIC_FRONT_URL + ACCESS_DENIED_PATH,
}
