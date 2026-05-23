import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AxiosAuth, { AxiosLogin } from '../../common/configuration/axiosAuth'
import {
  APIResponse,
  ResFour,
  ResSeven,
  ResThree,
  StringMessage,
} from '../../common/types/CustomResponse'
import { AUTHENTICATION_INFORMATION } from '@/common/constants/reactQueryCacheTags'
import { COMMON_JSON_HEADERS } from '@/common/constants/httpHeaders'
import {
  Credentiel,
  CredentielForgetPassword,
  CredentielResetPassword,
} from '@/common/types/Credentiel'
import ApiClient, { resetHttpInstance } from '../../common/configuration/http'
import ApiCustomer from '@/common/configuration/ApiCustomer'
import { useHttpOnlyCookieExists } from '@/common/hooks/useGetExistantCookies'
import { User } from '@/common/types/User'

const useAuthenticationAPI = () => {
  const queryClient = useQueryClient()
  const cookieExists = useHttpOnlyCookieExists('BEARER')

  const useLogin = () => {
    return useMutation<string, Error, Credentiel>({
      mutationKey: [AUTHENTICATION_INFORMATION],
      mutationFn: (data) =>
        // AxiosLogin has NO interceptors and withCredentials: true so the
        // browser stores the Set-Cookie from the response without sending
        // any stale token through auto-refresh interceptors.
        AxiosLogin.post(`/auth/login`, data, {
          headers: COMMON_JSON_HEADERS,
        }).then((res) => res.data.message),
    })
  }

  const useLogOut = () => {
    return useMutation<void, Error, string>({
      mutationKey: [AUTHENTICATION_INFORMATION],
      mutationFn: () =>
        AxiosAuth.post(`/auth/logout`, {
          headers: COMMON_JSON_HEADERS,
        }).then((res) => res.data.message),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: [AUTHENTICATION_INFORMATION] })
        // Create a fresh ApiClient instance so the next login starts clean.
        resetHttpInstance()
      },
    })
  }

  const useGetCurrentUser = () => {
    return useQuery<User | null, Error>({
      queryKey: [AUTHENTICATION_INFORMATION],
      staleTime: 0,
      retry: false,          // don't retry on 401
      queryFn: async () => {
        try {
          return await ApiClient.get<ResSeven<User>>(`/users/me`).then(
            (res) => res.data.data
          )
        } catch (err: any) {
          // 401 = not logged in, return null instead of throwing
          if (err?.response?.status === 401) return null
          throw err
        }
      },
    })
  }
  const useForgetPassword = () => {
    return useMutation<void, Error, CredentielForgetPassword>({
      mutationKey: [AUTHENTICATION_INFORMATION],
      mutationFn: (data) =>
        ApiCustomer.post(`/reset-password`, data, {
          headers: COMMON_JSON_HEADERS,
        }).then((res) => res.data),
    })
  }
  const useCheckResetPasswordToken = (token: string) => {
    return useQuery<void, Error>({
      queryKey: [AUTHENTICATION_INFORMATION, token],
      staleTime: 0,
      enabled: !!token,
      queryFn: () =>
        ApiCustomer.get<APIResponse<StringMessage>>(
          `/reset-password/check-token?token=${token}`
        ).then((res) => res.data),
    })
  }
  const useResetPassword = (token: string) => {
    return useMutation<void, Error, CredentielResetPassword>({
      mutationKey: [AUTHENTICATION_INFORMATION],
      mutationFn: (data) =>
        ApiCustomer.post(`/reset-password/reset?token=${token}`, data, {
          headers: COMMON_JSON_HEADERS,
        }).then((res) => res.data),
    })
  }

  return {
    useLogin,
    useLogOut,
    useGetCurrentUser,
    useForgetPassword,
    useCheckResetPasswordToken,
    useResetPassword,
  }
}

export default useAuthenticationAPI
