import React, { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import useDashboardApi from '@/services/dashboard/useDashboardApi'
import { Spinner, Chip } from '@heroui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useIntl } from 'react-intl'
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiClock,
  FiLock,
  FiTrendingUp,
} from 'react-icons/fi'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const STATUS_COLOR: Record<string, 'warning' | 'success' | 'danger' | 'primary' | 'default' | 'secondary'> = {
  en_attente: 'warning',
  accepter: 'success',
  refuser: 'danger',
  entretien: 'primary',
}

interface KpiCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, color }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl p-5 shadow-sm border border-divider bg-content1 dark:bg-gray-900`}
  >
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-xl text-white text-xl ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground dark:text-white">{value}</p>
      <p className="text-sm text-default-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
)

const DashboardPage = () => {
  const { formatMessage, formatDate } = useIntl()
  const t = (id: string) => formatMessage({ id })
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const { useGetDashboardStats } = useDashboardApi()
  const { data, isLoading } = useGetDashboardStats()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-80">
        <Spinner size="lg" />
      </div>
    )
  }

  const { kpi, recentCandidatures, recentOffers, monthlyStats } = data

  // --- chart data ---
  const chartLabels = monthlyStats.map((m) => m.month)
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t('candidature.status.en_attente'),
        data: monthlyStats.map((m) => m.enAttente),
        backgroundColor: 'rgba(234,179,8,0.7)',
        borderRadius: 6,
      },
      {
        label: t('candidature.status.accepter'),
        data: monthlyStats.map((m) => m.accepter),
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderRadius: 6,
      },
      {
        label: t('candidature.status.refuser'),
        data: monthlyStats.map((m) => m.refuser),
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 6,
      },
      {
        label: t('candidature.status.entretien'),
        data: monthlyStats.map((m) => m.entretien),
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderRadius: 6,
      },
    ],
  }

  // --- chart options (dark-mode-aware) ---
  const axisColor  = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'
  const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: axisColor, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor:  isDark ? '#cbd5e1' : '#475569',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks:  { color: axisColor },
        grid:   { color: gridColor },
        border: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks:  { stepSize: 1, color: axisColor },
        grid:   { color: gridColor },
        border: { color: gridColor },
      },
    },
  }

  const kpiCards: KpiCardProps[] = [
    {
      label: t('dashboard.kpi.totalOffers'),
      value: kpi.totalOffers,
      icon: <FiBriefcase />,
      color: 'bg-blue-500',
    },
    {
      label: t('dashboard.kpi.activeOffers'),
      value: kpi.activeOffers,
      icon: <FiCheckCircle />,
      color: 'bg-emerald-500',
    },
    {
      label: t('dashboard.kpi.closedOffers'),
      value: kpi.closedOffers,
      icon: <FiLock />,
      color: 'bg-slate-500',
    },
    {
      label: t('dashboard.kpi.totalCandidatures'),
      value: kpi.totalCandidatures,
      icon: <FiUsers />,
      color: 'bg-purple-500',
    },
    {
      label: t('candidature.status.en_attente'),
      value: kpi.enAttente,
      icon: <FiClock />,
      color: 'bg-yellow-500',
    },
    {
      label: t('candidature.status.accepter'),
      value: kpi.accepter,
      icon: <FiTrendingUp />,
      color: 'bg-green-500',
    },
    {
      label: t('candidature.status.refuser'),
      value: kpi.refuser,
      icon: <FiXCircle />,
      color: 'bg-red-500',
    },
    {
      label: t('candidature.status.entretien'),
      value: kpi.entretien,
      icon: <FiCheckCircle />,
      color: 'bg-blue-500',
    },
  ]

  return (
    <div className="space-y-6 py-2">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Chart + Recent Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <div className="lg:col-span-2 bg-content1 dark:bg-gray-900 rounded-2xl shadow-sm border border-divider p-5">
          <h2 className="text-base font-semibold text-foreground dark:text-white mb-4">
            {t('dashboard.chart.title')}
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Recent Offers */}
        <div className="bg-content1 dark:bg-gray-900 rounded-2xl shadow-sm border border-divider p-5 flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground dark:text-white">
            {t('dashboard.recentOffers')}
          </h2>
          {recentOffers.length === 0 ? (
            <p className="text-sm text-default-400">{t('table.emptyContent')}</p>
          ) : (
            recentOffers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between rounded-xl border border-divider px-4 py-3 bg-content2 dark:bg-gray-800 hover:bg-content3 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground dark:text-white truncate">{offer.title}</p>
                  <p className="text-xs text-default-400 dark:text-gray-400 mt-0.5">
                    {offer.candidaturesCount} {t('dashboard.candidatures')}
                    {offer.dateDeadline
                      ? ` · ${formatDate(offer.dateDeadline, { day: '2-digit', month: 'short', year: 'numeric' })}`
                      : ''}
                  </p>
                </div>
                <Chip
                  size="sm"
                  color={offer.isClosed ? 'default' : 'success'}
                  variant="flat"
                  className="ml-2 shrink-0"
                >
                  {offer.isClosed ? t('dashboard.closed') : t('dashboard.open')}
                </Chip>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Candidatures Table */}
      <div className="bg-content1 dark:bg-gray-900 rounded-2xl shadow-sm border border-divider p-5">
        <h2 className="text-base font-semibold text-foreground dark:text-white mb-4">
          {t('dashboard.recentCandidatures')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider text-default-500">
                <th className="text-left pb-3 pr-4 font-medium text-black dark:text-white">{t('candidature.firstName')}</th>
                <th className="text-left pb-3 pr-4 font-medium text-black dark:text-white">{t('candidature.lastName')}</th>
                <th className="text-left pb-3 pr-4 font-medium text-black dark:text-white">{t('candidature.email')}</th>
                <th className="text-left pb-3 pr-4 font-medium text-black dark:text-white">{t('candidature.status')}</th>
                <th className="text-left pb-3 font-medium text-black dark:text-white">{t('offer.dateCreation')}</th>
              </tr>
            </thead>
            <tbody>
              {recentCandidatures.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-black dark:text-white">
                    {t('table.emptyContent')}
                  </td>
                </tr>
              ) : (
                recentCandidatures.map((c) => (
                  <tr key={c.id} className="border-b border-divider last:border-0 hover:bg-content2 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 pr-4 text-black dark:text-white">{c.firstName}</td>
                    <td className="py-3 pr-4 text-black dark:text-white">{c.lastName}</td>
                    <td className="py-3 pr-4 text-black dark:text-white">{c.email || '—'}</td>
                    <td className="py-3 pr-4 text-black dark:text-white">
                      <Chip
                        size="sm"
                        color={STATUS_COLOR[c.status] ?? 'default'}
                        variant="flat"
                      >
                        {t(`candidature.status.${c.status}`)}
                      </Chip>
                    </td>
                    <td className="py-3 text-black dark:text-white">
                      {c.createdAt
                        ? formatDate(c.createdAt, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default DashboardPage