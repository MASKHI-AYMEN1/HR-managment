import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AxiosAuth from '../../common/configuration/axiosAuth'
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
import ApiClient from '../../common/configuration/http'
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
        AxiosAuth.post(`/auth/login`, data, {
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
      },
    })
  }

  const useGetCurrentUser = () => {
    return useQuery<User, Error>({
      queryKey: [AUTHENTICATION_INFORMATION],
      staleTime: 0,
      queryFn: async() =>
        ApiClient.get<
          APIResponse<ResSeven<User>>
        >(`/users/me`).then((res) => res.data.data),
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
