import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiClient from '@/common/configuration/http';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export interface ScheduleInterviewPayload {
  candidature_id: string;
  offer_id: string;
  scheduled_at: string; // ISO-8601
  duration_minutes?: number;
  location?: string;
  interviewer_email?: string;
  notes?: string;
  send_convocation?: boolean;
  create_google_event?: boolean;
}

export interface UpdateInterviewPayload {
  scheduled_at?: string;
  duration_minutes?: number;
  location?: string;
  interviewer_email?: string;
  notes?: string;
  status?: 'planifie' | 'confirme' | 'termine' | 'annule';
}

export interface InterviewRecord {
  id: string;
  candidature_id: string;
  offer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meet_link?: string;
  google_calendar_event_id?: string;
  interviewer_email?: string;
  notes?: string;
  status: 'planifie' | 'confirme' | 'termine' | 'annule';
  convocation_sent: boolean;
  convocation_sent_at?: string;
  reminder_sent: boolean;
  reminder_sent_at?: string;
  created_at: string;
  candidate_first_name?: string;
  candidate_last_name?: string;
  candidate_email?: string;
  offer_title?: string;
}

export interface InterviewListResponse {
  data: InterviewRecord[];
  total: number;
}

// -----------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------

const useInterviewSchedulingApi = () => {
  const queryClient = useQueryClient();

  // ---- Schedule a new interview ----------------------------------------
  const useScheduleInterview = () =>
    useMutation<InterviewRecord, Error, ScheduleInterviewPayload>({
      mutationFn: async (payload) => {
        const res = await ApiClient.post('/interviews/schedule', payload);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interviews', 'list'] });
      },
    });

  // ---- List interviews --------------------------------------------------
  const useListInterviews = (offerId?: string, candidatureId?: string) =>
    useQuery<InterviewListResponse>({
      queryKey: ['interviews', 'list', offerId, candidatureId],
      queryFn: async () => {
        const params: Record<string, string> = {};
        if (offerId) params.offer_id = offerId;
        if (candidatureId) params.candidature_id = candidatureId;
        const res = await ApiClient.get('/interviews/list', { params });
        return res.data;
      },
    });

  // ---- Get single interview --------------------------------------------
  const useGetInterview = (interviewId: string) =>
    useQuery<InterviewRecord>({
      queryKey: ['interviews', interviewId],
      queryFn: async () => {
        const res = await ApiClient.get(`/interviews/${interviewId}`);
        return res.data;
      },
      enabled: !!interviewId,
    });

  // ---- Update interview ------------------------------------------------
  const useUpdateInterview = () =>
    useMutation<InterviewRecord, Error, { id: string; data: UpdateInterviewPayload }>({
      mutationFn: async ({ id, data }) => {
        const res = await ApiClient.put(`/interviews/${id}`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interviews', 'list'] });
      },
    });

  // ---- Cancel interview ------------------------------------------------
  const useCancelInterview = () =>
    useMutation<void, Error, string>({
      mutationFn: async (id) => {
        await ApiClient.delete(`/interviews/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interviews', 'list'] });
      },
    });

  // ---- Send reminder ---------------------------------------------------
  const useSendReminder = () =>
    useMutation<{ sent: boolean; message: string }, Error, string>({
      mutationFn: async (id) => {
        const res = await ApiClient.post(`/interviews/${id}/send-reminder`);
        return res.data;
      },
    });

  // ---- Resend convocation ---------------------------------------------
  const useResendConvocation = () =>
    useMutation<{ sent: boolean }, Error, string>({
      mutationFn: async (id) => {
        const res = await ApiClient.post(`/interviews/${id}/send-convocation`);
        return res.data;
      },
    });

  return {
    useScheduleInterview,
    useListInterviews,
    useGetInterview,
    useUpdateInterview,
    useCancelInterview,
    useSendReminder,
    useResendConvocation,
  };
};

export default useInterviewSchedulingApi;
