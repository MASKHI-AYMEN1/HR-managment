import ApiClient from '@/common/configuration/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const CANDIDATURE_KEY = ['candidature']

export type CandidaturePayload = {
  offerId: string
  firstName: string
  lastName: string
  phone?: string
  email?: string
  dateNaissance?: string
  userId?: string
  cv?: File | null
  coverLetter?: File | null
}

export type AttachmentPayload = {
  candidatureId: string
  fileName: string
  fileUrl: string
  fileType: string
}

export type CandidatureFilters = {
  offerId?: string
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export type CandidaturesPage = {
  data: any[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type DiagnosticOfferItem = {
  id: string
  title: string
}

export type DiagnosticCandidatureItem = {
  id: string
  fullName: string
  email?: string
  status?: string
  createdAt?: string
}

export type DiagnosticCompareCriteria =
  | 'offer'
  | 'profile'
  | 'skills'
  | 'formation'
  | 'experience'
  | 'languages'
  | 'certifications'

export type DiagnosticComparePayload = {
  offerId: string
  candidatureIds: string[]
  criteria: DiagnosticCompareCriteria[]
}

export type DiagnosticCompareRow = {
  candidatureId: string
  fullName: string
  email?: string
  scoreOffer: number
  scoreProfile: number
  scoreSkills: number
  scoreFormation: number
  scoreExperience: number
  scoreLanguages: number
  scoreCertifications: number
  totalScore: number
  criteriaDetails: Array<{
    key: string
    score: number
    content: string
  }>
}

export type DiagnosticCompareResponse = {
  offerId: string
  offerTitle: string
  criteria: string[]
  results: DiagnosticCompareRow[]
}

// LLM Comparison Types
export type LLMRankingItem = {
  name: string
  score: number
  position: number
}

export type LLMDetailedAnalysis = {
  [candidateName: string]: {
    strengths: string[]
    weaknesses: string[]
    fit_score: number
    summary: string
  }
}

export type LLMCompareResponse = {
  ranking: LLMRankingItem[]
  detailed_analysis: LLMDetailedAnalysis
  comparison: string
  recommendation: string
  model: string
  provider: string
  offer: {
    id: string
    title: string
    description: string
  }
  candidates: Array<{
    id: string
    name: string
    email: string
  }>
}

export type InterviewCalendarEvent = {
  id: string
  candidatureId: string
  offerId: string
  offerTitle: string
  candidateName: string
  candidateEmail?: string
  start: string
  end: string
  status: string
}

export type MyCandidatureItem = {
  id: string
  offerId: string
  offerTitle: string
  status?: string
  interviewDate?: string
  createdAt?: string
  evaluationRhDate?: string
  evaluationTechniqueDate?: string
  evaluationManagerDate?: string
}

export type CandidatureDetail = {
  id: string
  offerId: string
  offerTitle?: string
  firstName: string
  lastName: string
  phone?: string
  email?: string
  dateNaissance?: string
  createdAt?: string
  status?: string
  isDeleted?: boolean
  dateDeleted?: string
  deletedBy?: string
  evaluationRhDate?: string
  evaluationTechniqueDate?: string
  evaluationManagerDate?: string
}

const useCandidatureApi = () => {
  const queryClient = useQueryClient()

  const useCreateCandidature = () => {
    return useMutation<any, Error, CandidaturePayload>({
      mutationFn: (data) => {
        const formData = new FormData()
        formData.append('offer_id', data.offerId)
        formData.append('first_name', data.firstName)
        formData.append('last_name', data.lastName)
        if (data.phone) formData.append('phone', data.phone)
        if (data.email) formData.append('email', data.email)
        if (data.dateNaissance) formData.append('date_naissance', data.dateNaissance)
        if (data.userId) formData.append('user_id', data.userId)
        if (data.cv) formData.append('cv', data.cv)
        if (data.coverLetter) formData.append('cover_letter', data.coverLetter)
        return ApiClient.post('/candidatures', formData).then((r) => r.data)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CANDIDATURE_KEY })
      },
    })
  }

  const useCreateAttachment = () => {
    return useMutation<any, Error, AttachmentPayload>({
      mutationFn: (data) =>
        ApiClient.post(`/candidatures/${data.candidatureId}/attachments`, data, { headers: { 'Content-Type': 'application/json' } }).then((r) => r.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CANDIDATURE_KEY })
      },
    })
  }

  const useListCandidaturesByOffer = (filters: CandidatureFilters) => {
    return useQuery<CandidaturesPage, Error>({
      queryKey: [...CANDIDATURE_KEY, 'byOffer', filters],
      enabled: !!filters.offerId,
      queryFn: async () => {
        const params = new URLSearchParams()
        if (filters.offerId)  params.append('offer_id',  filters.offerId)
        if (filters.search)   params.append('search',    filters.search)
        if (filters.status)   params.append('status',    filters.status)
        if (filters.dateFrom) params.append('date_from', filters.dateFrom)
        if (filters.dateTo)   params.append('date_to',   filters.dateTo)
        params.append('page',      String(filters.page     ?? 1))
        params.append('page_size', String(filters.pageSize ?? 10))
        const res = await ApiClient.get(`/candidatures/?${params.toString()}`)
        const d = res.data
        return {
          data:       d.data       ?? [],
          total:      d.total      ?? 0,
          page:       d.page       ?? 1,
          pageSize:   d.page_size  ?? 10,
          totalPages: d.total_pages ?? 1,
        }
      },
    })
  }

  const useExportCandidatures = () => {
    return useMutation<void, Error, { offerId?: string; fileName?: string }>({
      mutationFn: async ({ offerId, fileName = 'candidatures.xlsx' }) => {
        const url = offerId
          ? `/candidatures/export?offer_id=${offerId}`
          : `/candidatures/export`
        const res = await ApiClient.get(url, { responseType: 'blob' })
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(blobUrl)
      },
    })
  }

  const useExportCvDetails = () => {
    return useMutation<void, Error, { offerId?: string; fileName?: string }>({
      mutationFn: async ({ offerId, fileName = 'cv_details.xlsx' }) => {
        const url = offerId
          ? `/candidatures/export-cv-details?offer_id=${offerId}`
          : `/candidatures/export-cv-details`
        const res = await ApiClient.get(url, { responseType: 'blob' })
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(blobUrl)
      },
    })
  }

  const useListAttachments = (candidatureId?: string) => {
    return useQuery<any[], Error>({
      queryKey: [...CANDIDATURE_KEY, 'attachments', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        const res = await ApiClient.get(`/candidatures/${candidatureId}/attachments`)
        if (res?.data?.data) return res.data.data
        return res.data
      },
    })
  }

  // Downloads a file as a Blob via the /api/v1 download endpoint (keeps auth headers)
  const useDownloadFile = () => {
    return useMutation<void, Error, { attachmentId: string; fileName: string }>({
      mutationFn: async ({ attachmentId, fileName }) => {
        const res = await ApiClient.get(
          `/candidatures/attachments/${attachmentId}/download`,
          { responseType: 'blob' }
        )
        const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(blobUrl)
      },
    })
  }

  const useUpdateCandidatureStatus = () => {
    return useMutation<any, Error, { id: string; status: string; interviewDate?: string | null; sendEmail: boolean }>({
      mutationFn: (data) =>
        ApiClient.patch(`/candidatures/${data.id}/status`, {
          status: data.status,
          interviewDate: data.interviewDate ?? null,
          sendEmail: data.sendEmail,
        }).then((r) => r.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CANDIDATURE_KEY })
      },
    })
  }

  // State Machine Functions
  const useTransitionCandidatureStatus = () => {
    return useMutation<any, Error, { id: string; action: 'accepter' | 'refuser'; interviewDate?: string | null; sendEmail: boolean }>({
      mutationFn: (data) =>
        ApiClient.post(`/candidatures/${data.id}/transition`, {
          action: data.action,
          interviewDate: data.interviewDate ?? null,
          sendEmail: data.sendEmail,
        }).then((r) => r.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CANDIDATURE_KEY })
      },
    })
  }

  const useGetAvailableActions = (candidatureId?: string) => {
    return useQuery<{ candidatureId: string; currentStatus: string; availableActions: string[]; isFinalState: boolean }, Error>({
      queryKey: [...CANDIDATURE_KEY, 'available-actions', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        const res = await ApiClient.get(`/candidatures/${candidatureId}/available-actions`)
        return res.data
      },
    })
  }

  const useGetWorkflowInfo = () => {
    return useQuery<{ workflow: any }, Error>({
      queryKey: [...CANDIDATURE_KEY, 'workflow-info'],
      queryFn: async () => {
        const res = await ApiClient.get('/candidatures/workflow/info')
        return res.data
      },
    })
  }

  const useDiagnosticOffers = () => {
    return useQuery<DiagnosticOfferItem[], Error>({
      queryKey: [...CANDIDATURE_KEY, 'diagnostic', 'offers'],
      queryFn: async () => {
        const res = await ApiClient.get('/candidatures/diagnostic/offers')
        return res?.data?.data ?? []
      },
    })
  }

  const useDiagnosticCandidatures = (offerId?: string) => {
    return useQuery<DiagnosticCandidatureItem[], Error>({
      queryKey: [...CANDIDATURE_KEY, 'diagnostic', 'candidatures', offerId],
      enabled: !!offerId,
      queryFn: async () => {
        const res = await ApiClient.get(`/candidatures/diagnostic/offers/${offerId}/candidatures`)
        return res?.data?.data ?? []
      },
    })
  }

  const useDiagnosticCompare = () => {
    return useMutation<DiagnosticCompareResponse, Error, DiagnosticComparePayload>({
      mutationFn: async (payload) => {
        const res = await ApiClient.post('/candidatures/diagnostic/compare', payload)
        return res.data
      },
    })
  }

  const useDiagnosticCompareLLM = () => {
    return useMutation<LLMCompareResponse, Error, DiagnosticComparePayload>({
      mutationFn: async (payload) => {
        const res = await ApiClient.post('/candidatures/diagnostic/compare-llm', payload)
        return res.data
      },
    })
  }

  const useInterviewCalendarEvents = () => {
    return useQuery<InterviewCalendarEvent[], Error>({
      queryKey: [...CANDIDATURE_KEY, 'calendar', 'interviews'],
      queryFn: async () => {
        const res = await ApiClient.get('/candidatures/calendar/interviews')
        return res?.data?.data ?? []
      },
    })
  }

  const useMyCandidatures = () => {
    return useQuery<MyCandidatureItem[], Error>({
      queryKey: [...CANDIDATURE_KEY, 'me'],
      queryFn: async () => {
        const res = await ApiClient.get('/candidatures/me')
        return res?.data?.data ?? []
      },
    })
  }

  const useGetCandidature = (id?: string) => {
    return useQuery<CandidatureDetail, Error>({
      queryKey: [...CANDIDATURE_KEY, 'detail', id],
      enabled: !!id,
      queryFn: async () => {
        const res = await ApiClient.get(`/candidatures/${id}`)
        return res?.data?.data ?? res?.data ?? null
      },
    })
  }

  return {
    useCreateCandidature,
    useCreateAttachment,
    useListCandidaturesByOffer,
    useListAttachments,
    useDownloadFile,
    useExportCandidatures,
    useExportCvDetails,
    useUpdateCandidatureStatus,
    useTransitionCandidatureStatus,
    useGetAvailableActions,
    useGetWorkflowInfo,
    useDiagnosticOffers,
    useDiagnosticCandidatures,
    useDiagnosticCompare,
    useDiagnosticCompareLLM,
    useInterviewCalendarEvents,
    useMyCandidatures,
    useGetCandidature,
  }
}

export default useCandidatureApi

