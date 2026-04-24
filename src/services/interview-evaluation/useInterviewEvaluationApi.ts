import ApiClient from '@/common/configuration/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const INTERVIEW_EVALUATION_KEY = ['interview-evaluation']

// ==================== Types ====================

export type DisponibiliteEnum = 'immediate' | 'un_mois' | 'deux_mois' | 'trois_mois_plus'
export type InterviewDecisionEnum = 'en_attente' | 'accepte' | 'refuse'

// RH Evaluation Types
export type InterviewEvaluationRH = {
  id: string
  candidatureId: string
  evaluatorId: string
  scoreCommunication?: number
  scoreExperience?: number
  scoreFormation?: number
  scoreMotivation?: number
  scoreComportement?: number
  disponibilite?: DisponibiliteEnum
  commentaire?: string
  decision: InterviewDecisionEnum
  dateEvaluation: string
  dateModification?: string
  isDeleted?: boolean
  isClosed: boolean
  scoreGlobal?: number
}

export type InterviewEvaluationRHCreate = {
  candidatureId: string
  scoreCommunication?: number
  scoreExperience?: number
  scoreFormation?: number
  scoreMotivation?: number
  scoreComportement?: number
  disponibilite?: DisponibiliteEnum
  commentaire?: string
  decision?: InterviewDecisionEnum
}

export type InterviewEvaluationRHUpdate = Omit<InterviewEvaluationRHCreate, 'candidatureId'>

// Technique Evaluation Types
export type InterviewEvaluationTechnique = {
  id: string
  candidatureId: string
  evaluatorId: string
  pointsForts?: string
  pointsFaibles?: string
  scoreCompetenceTechnique?: number
  commentaire?: string
  decision: InterviewDecisionEnum
  dateEvaluation: string
  dateModification?: string
  isDeleted?: boolean
  isClosed: boolean
}

export type InterviewEvaluationTechniqueCreate = {
  candidatureId: string
  pointsForts?: string
  pointsFaibles?: string
  scoreCompetenceTechnique?: number
  commentaire?: string
  decision?: InterviewDecisionEnum
}

export type InterviewEvaluationTechniqueUpdate = Omit<InterviewEvaluationTechniqueCreate, 'candidatureId'>

// Manager Evaluation Types
export type InterviewEvaluationManager = {
  id: string
  candidatureId: string
  evaluatorId: string
  commentaire?: string
  decision: InterviewDecisionEnum
  dateEvaluation: string
  dateModification?: string
  isDeleted?: boolean
  isClosed: boolean
}

export type InterviewEvaluationManagerCreate = {
  candidatureId: string
  commentaire?: string
  decision?: InterviewDecisionEnum
}

export type InterviewEvaluationManagerUpdate = Omit<InterviewEvaluationManagerCreate, 'candidatureId'>

// Candidature with Interview Info
export type CandidatureInterviewInfo = {
  candidatureId: string
  candidatureName: string
  candidatureEmail?: string
  candidatureStatus: string
  offerId: string
  offerTitle: string
  evaluationRH?: InterviewEvaluationRH
  evaluationTechnique?: InterviewEvaluationTechnique
  evaluationManager?: InterviewEvaluationManager
}

export type CandidatureInterviewInfoPage = {
  data: CandidatureInterviewInfo[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Question Generation Types
export type GenerateQuestionsRequest = {
  offer_id: string
  candidature_id?: string
  num_questions?: number
}

export type InterviewQuestion = {
  id: number
  category: string
  question: string
  follow_up: string
  evaluation_tips: string
  expected_concepts?: string[]
  decision_criteria?: string
}

export type GeneratedQuestionsResponse = {
  questions: InterviewQuestion[]
  candidate_specific?: boolean
  candidate_name?: string
  offer_title: string
  model: string
  provider: string
  interview_type?: string
  interview_structure?: string
  key_points?: string[]
  key_technical_areas?: string[]
  decision_framework?: string[]
  red_flags?: string[]
  error?: string
  note?: string
}

// Calendar Interview Types
export type CalendarInterview = {
  id: string
  candidatureId: string
  candidatureName: string
  candidatureEmail?: string
  offerId: string
  offerTitle: string
  interviewType: 'rh' | 'technique' | 'manager'
  dateEntretien?: string
  dureeMinutes?: number
  lieu?: string
  meetLink?: string
  interviewerEmail?: string
  notesEntretien?: string
  convocationSent: boolean
  convocationSentAt?: string
  decision: string
  dateEvaluation: string
}

export type CalendarInterviewListResponse = {
  data: CalendarInterview[]
  total: number
}

export type UpdateInterviewScheduling = {
  dateEntretien?: string
  dureeMinutes?: number
  lieu?: string
  meetLink?: string
  interviewerEmail?: string
  notesEntretien?: string
}

// ==================== Hook ====================

const useInterviewEvaluationApi = () => {
  const queryClient = useQueryClient()

  // ==================== Candidatures Lists ====================

  const useGetCandidatureInfo = (candidatureId: string | undefined) => {
    return useQuery<CandidatureInterviewInfo, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'candidature', candidatureId],
      queryFn: async () => {
        if (!candidatureId) throw new Error('Candidature ID is required')
        const res = await ApiClient.get(`/interview-evaluations/candidature/${candidatureId}`)
        return res.data.data
      },
      enabled: !!candidatureId,
    })
  }

  const useListCandidaturesForRH = (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    isClosed?: boolean,
    offerName?: string,
    candidateName?: string
  ) => {
    return useQuery<CandidatureInterviewInfoPage, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'rh', 'candidatures', page, pageSize, search, isClosed, offerName, candidateName],
      queryFn: async () => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('page_size', String(pageSize))
        if (search) params.append('search', search)
        if (isClosed !== undefined) params.append('is_closed', String(isClosed))
        if (offerName) params.append('offer_name', offerName)
        if (candidateName) params.append('candidate_name', candidateName)
        const res = await ApiClient.get(`/interview-evaluations/rh/candidatures?${params.toString()}`)
        return {
          data: res.data.data ?? [],
          total: res.data.total ?? 0,
          page: res.data.page ?? 1,
          pageSize: res.data.pageSize ?? pageSize,
          totalPages: res.data.totalPages ?? 1,
        }
      },
    })
  }

  const useListCandidaturesForTechnique = (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    isClosed?: boolean,
    offerName?: string,
    candidateName?: string
  ) => {
    return useQuery<CandidatureInterviewInfoPage, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'technique', 'candidatures', page, pageSize, search, isClosed, offerName, candidateName],
      queryFn: async () => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('page_size', String(pageSize))
        if (search) params.append('search', search)
        if (isClosed !== undefined) params.append('is_closed', String(isClosed))
        if (offerName) params.append('offer_name', offerName)
        if (candidateName) params.append('candidate_name', candidateName)
        const res = await ApiClient.get(`/interview-evaluations/technique/candidatures?${params.toString()}`)
        return {
          data: res.data.data ?? [],
          total: res.data.total ?? 0,
          page: res.data.page ?? 1,
          pageSize: res.data.pageSize ?? pageSize,
          totalPages: res.data.totalPages ?? 1,
        }
      },
    })
  }

  const useListCandidaturesForManager = (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    isClosed?: boolean,
    offerName?: string,
    candidateName?: string
  ) => {
    return useQuery<CandidatureInterviewInfoPage, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'manager', 'candidatures', page, pageSize, search, isClosed, offerName, candidateName],
      queryFn: async () => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('page_size', String(pageSize))
        if (search) params.append('search', search)
        if (isClosed !== undefined) params.append('is_closed', String(isClosed))
        if (offerName) params.append('offer_name', offerName)
        if (candidateName) params.append('candidate_name', candidateName)
        const res = await ApiClient.get(`/interview-evaluations/manager/candidatures?${params.toString()}`)
        return {
          data: res.data.data ?? [],
          total: res.data.total ?? 0,
          page: res.data.page ?? 1,
          pageSize: res.data.pageSize ?? pageSize,
          totalPages: res.data.totalPages ?? 1,
        }
      },
    })
  }

  // ==================== RH Evaluation CRUD ====================

  const useCreateEvaluationRH = () => {
    return useMutation<InterviewEvaluationRH, Error, InterviewEvaluationRHCreate>({
      mutationFn: async (data) => {
        const res = await ApiClient.post('/interview-evaluations/rh', data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useUpdateEvaluationRH = () => {
    return useMutation<InterviewEvaluationRH, Error, { id: string; data: InterviewEvaluationRHUpdate }>({
      mutationFn: async ({ id, data }) => {
        const res = await ApiClient.put(`/interview-evaluations/rh/${id}`, data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useGetEvaluationRHByCandidature = (candidatureId?: string) => {
    return useQuery<InterviewEvaluationRH | null, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'rh', 'by-candidature', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        try {
          const res = await ApiClient.get(`/interview-evaluations/rh/by-candidature/${candidatureId}`)
          return res.data.data
        } catch (e: any) {
          if (e.response?.status === 404) return null
          throw e
        }
      },
    })
  }

  // ==================== Technique Evaluation CRUD ====================

  const useCreateEvaluationTechnique = () => {
    return useMutation<InterviewEvaluationTechnique, Error, InterviewEvaluationTechniqueCreate>({
      mutationFn: async (data) => {
        const res = await ApiClient.post('/interview-evaluations/technique', data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useUpdateEvaluationTechnique = () => {
    return useMutation<InterviewEvaluationTechnique, Error, { id: string; data: InterviewEvaluationTechniqueUpdate }>({
      mutationFn: async ({ id, data }) => {
        const res = await ApiClient.put(`/interview-evaluations/technique/${id}`, data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useGetEvaluationTechniqueByCandidature = (candidatureId?: string) => {
    return useQuery<InterviewEvaluationTechnique | null, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'technique', 'by-candidature', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        try {
          const res = await ApiClient.get(`/interview-evaluations/technique/by-candidature/${candidatureId}`)
          return res.data.data
        } catch (e: any) {
          if (e.response?.status === 404) return null
          throw e
        }
      },
    })
  }

  // ==================== Manager Evaluation CRUD ====================

  const useCreateEvaluationManager = () => {
    return useMutation<InterviewEvaluationManager, Error, InterviewEvaluationManagerCreate>({
      mutationFn: async (data) => {
        const res = await ApiClient.post('/interview-evaluations/manager', data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useUpdateEvaluationManager = () => {
    return useMutation<InterviewEvaluationManager, Error, { id: string; data: InterviewEvaluationManagerUpdate }>({
      mutationFn: async ({ id, data }) => {
        const res = await ApiClient.put(`/interview-evaluations/manager/${id}`, data)
        return res.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEW_EVALUATION_KEY })
      },
    })
  }

  const useGetEvaluationManagerByCandidature = (candidatureId?: string) => {
    return useQuery<InterviewEvaluationManager | null, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'manager', 'by-candidature', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        try {
          const res = await ApiClient.get(`/interview-evaluations/manager/by-candidature/${candidatureId}`)
          return res.data.data
        } catch (e: any) {
          if (e.response?.status === 404) return null
          throw e
        }
      },
    })
  }

  // ==================== Question Generation ====================

  const useGenerateRHQuestions = () => {
    return useMutation<GeneratedQuestionsResponse, Error, GenerateQuestionsRequest>({
      mutationFn: async (request: GenerateQuestionsRequest) => {
        const res = await ApiClient.post('/interview-evaluations/generate/rh', request)
        return res.data
      },
    })
  }

  const useGenerateTechniqueQuestions = () => {
    return useMutation<GeneratedQuestionsResponse, Error, GenerateQuestionsRequest>({
      mutationFn: async (request: GenerateQuestionsRequest) => {
        const res = await ApiClient.post('/interview-evaluations/generate/technique', request)
        return res.data
      },
    })
  }

  const useGenerateManagerQuestions = () => {
    return useMutation<GeneratedQuestionsResponse, Error, GenerateQuestionsRequest>({
      mutationFn: async (request: GenerateQuestionsRequest) => {
        const res = await ApiClient.post('/interview-evaluations/generate/manager', request)
        return res.data
      },
    })
  }

  // ==================== Calendar ====================

  const useGetCalendarInterviews = (interviewType?: 'rh' | 'technique' | 'manager') => {
    return useQuery<CalendarInterviewListResponse, Error>({
      queryKey: [...INTERVIEW_EVALUATION_KEY, 'calendar', interviewType],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (interviewType) params.append('interview_type', interviewType)
        const res = await ApiClient.get(`/interview-evaluations/calendar?${params.toString()}`)
        return {
          data: res.data.data ?? [],
          total: res.data.total ?? 0,
        }
      },
    })
  }

  const useUpdateInterviewScheduling = () => {
    return useMutation<void, Error, { evaluationId: string; interviewType: 'rh' | 'technique' | 'manager'; data: UpdateInterviewScheduling }>({
      mutationFn: async ({ evaluationId, interviewType, data }) => {
        await ApiClient.put(`/interview-evaluations/calendar/${evaluationId}/scheduling?interview_type=${interviewType}`, data)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...INTERVIEW_EVALUATION_KEY, 'calendar'] })
      },
    })
  }

  return {
    // Candidatures
    useGetCandidatureInfo,
    // Candidatures lists
    useListCandidaturesForRH,
    useListCandidaturesForTechnique,
    useListCandidaturesForManager,
    // RH
    useCreateEvaluationRH,
    useUpdateEvaluationRH,
    useGetEvaluationRHByCandidature,
    // Technique
    useCreateEvaluationTechnique,
    useUpdateEvaluationTechnique,
    useGetEvaluationTechniqueByCandidature,
    // Manager
    useCreateEvaluationManager,
    useUpdateEvaluationManager,
    useGetEvaluationManagerByCandidature,
    // Question Generation
    useGenerateRHQuestions,
    useGenerateTechniqueQuestions,
    useGenerateManagerQuestions,
    // Calendar
    useGetCalendarInterviews,
    useUpdateInterviewScheduling,
  }
}

export default useInterviewEvaluationApi
