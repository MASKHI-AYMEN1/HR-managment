import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiClient from '@/common/configuration/http'
import { APIResponse, ResFour, ResSeven, ResThree } from '@/common/types/CustomResponse'
import { COMMON_JSON_HEADERS } from '@/common/constants/httpHeaders'
import { User } from '@/common/types/User'

export type UserPayload = {
  firstName?: string
  lastName?: string
  email: string
  login: string
  password?: string
  roles?: string[]
  photo?: string
  profileId?: string
}

const USERS_KEY = ['users']

const useUsersApi = () => {
  const queryClient = useQueryClient()

  const useGetMe = () => {
    return useQuery<any, Error>({
      queryKey: [...USERS_KEY, 'me'],
      queryFn: async () => {
        const res = await ApiClient.get(`/users/me`)
        return res?.data?.data ?? res.data
      },
    })
  }

  const useListUsers = (skip = 0, limit = 100) => {
    return useQuery<ResFour<any>, Error>({
      queryKey: [...USERS_KEY, 'list', skip, limit],
        queryFn: async() =>
        ApiClient.get<
          APIResponse<ResSeven<User>>
        >(`/users`).then((res) => res.data.data),
    })
  }

  const useGetUser = (id?: string) => {
    return useQuery<any, Error>({
      queryKey: [...USERS_KEY, 'get', id],
      enabled: !!id,
      queryFn: async () => {
        const res = await ApiClient.get<APIResponse<ResThree<any>>>(`/users/${id}`)
        if (res?.data?.result?.data) return res.data.result.data
        if (res?.data?.data) return res.data.data
        return res.data
      },
    })
  }

  const useCreateUser = () => {
    return useMutation<any, Error, UserPayload>({
      mutationFn: (data) => ApiClient.post('/users', data, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries(USERS_KEY),
    })
  }

  const useUpdateUser = (id?: string) => {
    return useMutation<any, Error, UserPayload>({
      mutationFn: (data) => ApiClient.put(`/users/${id}`, data, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries(USERS_KEY),
    })
  }

  const useDeleteUser = () => {
    return useMutation<any, Error, string>({
      mutationFn: (id) => ApiClient.delete(`/users/${id}`),
      onSuccess: () => queryClient.invalidateQueries(USERS_KEY),
    })
  }

  const useUpdateMe = () => {
    return useMutation<any, Error, UserPayload>({
      mutationFn: (data) => ApiClient.put(`/users/me`, data, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...USERS_KEY, 'me'] })
      },
    })
  }

  return {
    useListUsers,
    useGetMe,
    useGetUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useUpdateMe,
  }
}

export default useUsersApi
