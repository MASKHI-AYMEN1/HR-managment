import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiClient from '@/common/configuration/http'
import { APIResponse, ResFour, ResSeven, ResThree } from '@/common/types/CustomResponse'
import { COMMON_JSON_HEADERS } from '@/common/constants/httpHeaders'
import { Offer, OfferStatus } from '@/common/types/Offer'

export type OfferPayload = {
  title: string
  dateDeadline?: string
  description?: string
  salary?: number
  niveau?: string
  experienceDomain?: string
  typeContrat?: Array<'CDI' | 'CDD' | 'CIVP'>
  image?: string
}

const OFFERS_KEY = ['offers']

const useOffersApi = () => {
  const queryClient = useQueryClient()

  const useListOffers = (skip = 0, limit = 100) => {
    return useQuery<ResFour<any>, Error>({
      queryKey: [...OFFERS_KEY, 'list', skip, limit],
      queryFn: async () =>
        ApiClient.get<any>(`/offers`).then((res) => res.data.data),
    })
  }

  const useListOpenOffers = (skip = 0, limit = 100) => {
    return useQuery<any, Error>({
      queryKey: [...OFFERS_KEY, 'open', skip, limit],
      queryFn: async () => {
        const res = await ApiClient.get(`/offers/open?skip=${skip}&limit=${limit}`)
        if (res?.data?.data) return res.data.data
        return res.data
      },
    })
  }

  const useListOffersByStatus = (
    status?: string,
    page = 1,
    pageSize = 20,
  ) => {
    return useQuery<{ data: any[]; total: number; page: number; pageSize: number; totalPages: number }, Error>({
      queryKey: [...OFFERS_KEY, 'by-status', status, page, pageSize],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        params.append('page', String(page))
        params.append('page_size', String(pageSize))
        const res = await ApiClient.get(`/offers/by-status?${params.toString()}`)
        const d = res.data
        return {
          data:       d.data        ?? [],
          total:      d.total       ?? 0,
          page:       d.page        ?? 1,
          pageSize:   d.page_size   ?? pageSize,
          totalPages: d.total_pages ?? 1,
        }
      },
    })
  }

  const useGetOffer = (id?: string) => {
    return useQuery<any, Error>({
      queryKey: [...OFFERS_KEY, 'get', id],
      enabled: !!id,
      queryFn: async () => {
        const res = await ApiClient.get<any>(`/offers/${id}`)
        if (res?.data?.result?.data) return res.data.result.data
        if (res?.data?.data) return res.data.data
        return res.data
      },
    })
  }

  const useCreateOffer = () => {
    return useMutation<any, Error, OfferPayload>({
      mutationFn: (data) => ApiClient.post('/offers', data, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
    })
  }

  const useUpdateOffer = (id?: string) => {
    return useMutation<any, Error, OfferPayload>({
      mutationFn: (data) => ApiClient.put(`/offers/${id}`, data, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
    })
  }

  const useDeleteOffer = () => {
    return useMutation<any, Error, string>({
      mutationFn: (id) => ApiClient.delete(`/offers/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
    })
  }

  const useCloseOffer = () => {
    return useMutation<any, Error, string>({
      mutationFn: (id) => ApiClient.patch(`/offers/${id}/close`, {}, { headers: { 'Content-Type': 'application/json' } }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
    })
  }

  const useUpdateOfferStatus = () => {
    return useMutation<any, Error, { id: string; status: OfferStatus }>({
      mutationFn: ({ id, status }) => 
        ApiClient.patch(`/offers/${id}/status`, { status }, { headers: COMMON_JSON_HEADERS }).then((r) => r.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
    })
  }

  return {
    useListOffers,
    useListOpenOffers,
    useListOffersByStatus,
    useGetOffer,
    useCreateOffer,
    useUpdateOffer,
    useDeleteOffer,
    useCloseOffer,
    useUpdateOfferStatus,
  }
}

export default useOffersApi
