import { useMutation, useQuery } from '@tanstack/react-query';
import ApiClient from '@/common/configuration/http'

export interface InterviewQuestionsRequest {
  offer_id: string;
  candidature_id?: string;
  num_questions?: number;
}

export interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  follow_up?: string;
  evaluation_tips?: string;
}

export interface InterviewQuestionsResponse {
  questions: InterviewQuestion[];
  candidate_specific: boolean;
  candidate_name?: string;
  offer_title: string;
  model: string;
  provider: string;
  error?: string;
  interview_structure?: string;
  key_points_to_verify?: string[];
  key_competencies?: string[];
}

export interface CandidateForInterview {
  id: string;
  name: string;
  email: string;
  status: string;
  has_cv: boolean;
}

const useInterviewsApi = () => {
  const useGenerateQuestions = () => {
    return useMutation<InterviewQuestionsResponse, Error, InterviewQuestionsRequest>({
      mutationFn: async (data: InterviewQuestionsRequest) => {
        const response = await ApiClient.post('/interviews/generate', data);
        return response.data;
      },
    });
  };

  const useListCandidatesForInterview = (offerId: string) => {
    return useQuery({
      queryKey: ['interviews', 'candidates', offerId],
      queryFn: async () => {
        const response = await ApiClient.get(`/interviews/offers/${offerId}/candidates`);
        return response.data as {
          offer_id: string;
          candidates: CandidateForInterview[];
          total: number;
        };
      },
      enabled: !!offerId,
    });
  };

  return {
    useGenerateQuestions,
    useListCandidatesForInterview,
  };
};

export default useInterviewsApi;
