import ApiClient from '@/common/configuration/http'
import { useQuery } from '@tanstack/react-query'

const DASHBOARD_KEY = ['dashboard', 'stats']

export type DashboardKpi = {
  totalOffers: number
  activeOffers: number
  closedOffers: number
  totalCandidatures: number
  enAttente: number
  accepter: number
  refuser: number
  entretien: number
}

export type RecentCandidature = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  status: string
  offerId: string
  createdAt: string | null
}

export type RecentOffer = {
  id: string
  title: string
  isClosed: boolean
  dateDeadline: string | null
  candidaturesCount: number
}

export type MonthlyPoint = {
  month: string
  total: number
  accepter: number
  refuser: number
  enAttente: number
  entretien: number
}

export type DashboardStats = {
  kpi: DashboardKpi
  recentCandidatures: RecentCandidature[]
  recentOffers: RecentOffer[]
  monthlyStats: MonthlyPoint[]
}

const useDashboardApi = () => {
  const useGetDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
      queryKey: DASHBOARD_KEY,
      queryFn: async () => {
        const res = await ApiClient.get('/dashboard/stats')
        const d = res.data
        return {
          kpi: {
            totalOffers: d.kpi.total_offers,
            activeOffers: d.kpi.active_offers,
            closedOffers: d.kpi.closed_offers,
            totalCandidatures: d.kpi.total_candidatures,
            enAttente: d.kpi.en_attente,
            accepter: d.kpi.accepter,
            refuser: d.kpi.refuser,
            entretien: d.kpi.entretien,
          },
          recentCandidatures: (d.recent_candidatures || []).map((c: any) => ({
            id: c.id,
            firstName: c.first_name,
            lastName: c.last_name,
            email: c.email,
            status: c.status,
            offerId: c.offer_id,
            createdAt: c.created_at,
          })),
          recentOffers: (d.recent_offers || []).map((o: any) => ({
            id: o.id,
            title: o.title,
            isClosed: o.is_closed,
            dateDeadline: o.date_deadline,
            candidaturesCount: o.candidatures_count,
          })),
          monthlyStats: (d.monthly_stats || []).map((m: any) => ({
            month: m.month,
            total: m.total,
            accepter: m.accepter,
            refuser: m.refuser,
            enAttente: m.en_attente,
            entretien: m.entretien,
          })),
        }
      },
    })
  }

  return { useGetDashboardStats }
}

export default useDashboardApi
