import React, { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import useInterviewEvaluationApi, { CalendarInterview, UpdateInterviewScheduling } from '@/services/interview-evaluation/useInterviewEvaluationApi'
import EditInterviewModal from '@/components/EditInterviewModal'
import useToast from '@/common/hooks/useToast'
import { useIntl } from 'react-intl'
import { Tabs, Tab, Chip } from '@heroui/react'

type InterviewTypeFilter = 'all' | 'rh' | 'technique' | 'manager'

function AdminCalendarPage() {
  const intl = useIntl()
  const [editingInterview, setEditingInterview] = useState<CalendarInterview | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<InterviewTypeFilter>('all')
  
  const { useGetCalendarInterviews, useUpdateInterviewScheduling } = useInterviewEvaluationApi()
  const { showToast } = useToast()
  
  const filterType = selectedType === 'all' ? undefined : selectedType
  const { data: interviewsData, isLoading } = useGetCalendarInterviews(filterType)
  const updateMutation = useUpdateInterviewScheduling()

  const eventsData = interviewsData?.data || []

  // Count interviews by type
  const allInterviews = interviewsData?.data || []
  const allCount = allInterviews.length
  const rhCount = allInterviews.filter(i => i.interviewType === 'rh').length
  const techniqueCount = allInterviews.filter(i => i.interviewType === 'technique').length
  const managerCount = allInterviews.filter(i => i.interviewType === 'manager').length

  const events = useMemo(
    () =>
      eventsData.map((interview) => ({
        id: interview.id,
        title: `${interview.candidatureName} - ${interview.offerTitle}`,
        start: interview.dateEntretien,
        end: interview.dateEntretien,
        backgroundColor: 
          interview.interviewType === 'rh' ? '#3b82f6' : 
          interview.interviewType === 'technique' ? '#8b5cf6' : 
          '#10b981',
        extendedProps: {
          candidatureName: interview.candidatureName,
          candidatureEmail: interview.candidatureEmail,
          offerTitle: interview.offerTitle,
          candidatureId: interview.candidatureId,
          interviewType: interview.interviewType,
          interview: interview,
        },
      })),
    [eventsData],
  )

  const handleEventClick = (clickInfo: any) => {
    const interview = clickInfo.event.extendedProps?.interview
    if (interview) {
      setEditingInterview(interview)
      setIsEditModalOpen(true)
    }
  }

  const handleSaveInterview = async (
    evaluationId: string,
    interviewType: 'rh' | 'technique' | 'manager',
    data: UpdateInterviewScheduling
  ) => {
    try {
      await updateMutation.mutateAsync({ evaluationId, interviewType, data })
      showToast({ type: 'success', message: 'Entretien mis à jour avec succès' })
      setIsEditModalOpen(false)
      setEditingInterview(null)
    } catch (error) {
      showToast({ type: 'error', message: 'Erreur lors de la mise à jour de l\'entretien' })
      console.error('Update error:', error)
    }
  }

  return (
    <div className="space-y-6 py-2">
      <PageTitle
        title={intl.formatMessage({
          id: 'calendar.admin.title',
          defaultMessage: 'Calendrier des entretiens',
        })}
      />

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <Tabs
          selectedKey={selectedType}
          onSelectionChange={(key) => setSelectedType(key as InterviewTypeFilter)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "w-full",
          }}
        >
          <Tab 
            key="all" 
            title={
              <div className="flex items-center gap-2">
                <span>Tous</span>
                <Chip size="sm" variant="flat" color="primary">{allCount}</Chip>
              </div>
            } 
          />
          <Tab 
            key="rh" 
            title={
              <div className="flex items-center gap-2">
                <span>RH</span>
                <Chip size="sm" variant="flat" color="primary">{rhCount}</Chip>
              </div>
            } 
          />
          <Tab 
            key="technique" 
            title={
              <div className="flex items-center gap-2">
                <span>Technique</span>
                <Chip size="sm" variant="flat" color="secondary">{techniqueCount}</Chip>
              </div>
            } 
          />
          <Tab 
            key="manager" 
            title={
              <div className="flex items-center gap-2">
                <span>Manager</span>
                <Chip size="sm" variant="flat" color="success">{managerCount}</Chip>
              </div>
            } 
          />
        </Tabs>
      </div>

      {/* Help text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Astuce :</strong> Cliquez sur un entretien dans le calendrier pour modifier sa date, durée, lieu et autres informations.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500">
            {intl.formatMessage({ id: 'loading', defaultMessage: 'Loading...' })}
          </div>
        ) : eventsData.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Aucun entretien planifié
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedType === 'all' 
                ? "Les entretiens avec une date planifiée apparaîtront ici"
                : `Aucun entretien ${selectedType.toUpperCase()} planifié pour le moment`
              }
            </p>
          </div>
        ) : (
          <div className="custom-calendar">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={events}
              height="auto"
              locale="fr"
              eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              eventClick={handleEventClick}
              eventDidMount={(info) => {
                const candidatureName = info.event.extendedProps?.candidatureName || ''
                const candidatureEmail = info.event.extendedProps?.candidatureEmail || ''
                const offerTitle = info.event.extendedProps?.offerTitle || ''
                const interviewType = info.event.extendedProps?.interviewType || ''
                const typeLabel = interviewType === 'rh' ? 'RH' : interviewType === 'technique' ? 'Technique' : 'Manager'
                info.el.title = `${candidatureName}\n${candidatureEmail}\n${offerTitle}\nType: ${typeLabel}\n\n🖱️ Cliquez pour modifier`
                info.el.style.cursor = 'pointer'
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste'
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
            />
          </div>
        )}
      </div>

      {/* Edit Interview Modal */}
      <EditInterviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingInterview(null)
        }}
        interview={editingInterview}
        onSave={handleSaveInterview}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}

AdminCalendarPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default AdminCalendarPage
