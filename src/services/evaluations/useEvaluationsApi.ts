import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiClient from '@/common/configuration/http'
import { COMMON_JSON_HEADERS } from '@/common/constants/httpHeaders'

const EVALUATIONS_KEY = ['evaluations']

export type EvaluationCriteria = {
  scoreCompetencesTechniques?: number  // 0-5
  scoreSoftSkills?: number             // 0-5
  scoreExperience?: number             // 0-5
  scoreFormation?: number              // 0-5
  scoreMotivation?: number             // 0-5
  scoreAdequationPoste?: number        // 0-5
}

export type EvaluationPayload = EvaluationCriteria & {
  candidatureId: string
  commentaires?: string
  pointsForts?: string
  pointsFaibles?: string
  recommandation?: 'accepter' | 'refuser' | 'entretien' | 'en_attente'
}

export type Evaluation = EvaluationPayload & {
  id: string
  evaluatorId: string
  scoreGlobal?: number
  dateEvaluation: string
  dateModification?: string
}

export type EvaluationResponse = {
  data: Evaluation
}

export type EvaluationsListResponse = {
  data: Evaluation[]
}

const useEvaluationsApi = () => {
  const queryClient = useQueryClient()

  const useCreateEvaluation = () => {
    return useMutation<EvaluationResponse, Error, EvaluationPayload>({
      mutationFn: async (data) => {
        const res = await ApiClient.post('/evaluations', data, { headers: COMMON_JSON_HEADERS })
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY })
      },
    })
  }

  const useGetEvaluation = (evaluationId?: string) => {
    return useQuery<Evaluation, Error>({
      queryKey: [...EVALUATIONS_KEY, 'get', evaluationId],
      enabled: !!evaluationId,
      queryFn: async () => {
        const res = await ApiClient.get<EvaluationResponse>(`/evaluations/${evaluationId}`)
        return res.data.data
      },
    })
  }

  const useGetEvaluationByCandidature = (candidatureId?: string) => {
    return useQuery<Evaluation | null, Error>({
      queryKey: [...EVALUATIONS_KEY, 'candidature', candidatureId],
      enabled: !!candidatureId,
      queryFn: async () => {
        try {
          const res = await ApiClient.get<EvaluationResponse>(
            `/evaluations/candidature/${candidatureId}`
          )
          return res.data.data
        } catch (error: any) {
          if (error?.response?.status === 404) {
            return null
          }
          throw error
        }
      },
    })
  }

  const useListEvaluationsByOffer = (offerId?: string) => {
    return useQuery<Evaluation[], Error>({
      queryKey: [...EVALUATIONS_KEY, 'offer', offerId],
      enabled: !!offerId,
      queryFn: async () => {
        const res = await ApiClient.get<EvaluationsListResponse>(`/evaluations/offer/${offerId}`)
        return res.data.data
      },
    })
  }

  const useUpdateEvaluation = (evaluationId?: string) => {
    return useMutation<EvaluationResponse, Error, Partial<EvaluationPayload>>({
      mutationFn: async (data) => {
        const res = await ApiClient.put(
          `/evaluations/${evaluationId}`,
          data,
          { headers: COMMON_JSON_HEADERS }
        )
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY })
      },
    })
  }

  const useDeleteEvaluation = () => {
    return useMutation<EvaluationResponse, Error, string>({
      mutationFn: async (evaluationId) => {
        const res = await ApiClient.delete(`/evaluations/${evaluationId}`)
        return res.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY })
      },
    })
  }

  return {
    useCreateEvaluation,
    useGetEvaluation,
    useGetEvaluationByCandidature,
    useListEvaluationsByOffer,
    useUpdateEvaluation,
    useDeleteEvaluation,
  }
}

export default useEvaluationsApi
