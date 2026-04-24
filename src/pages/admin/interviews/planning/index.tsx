import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Chip, Tooltip, Divider } from '@heroui/react';
import {
  MdCalendarToday,
  MdVideoCall,
  MdEmail,
  MdNotifications,
  MdCancel,
  MdAdd,
  MdLocationOn,
  MdPerson,
  MdWork,
  MdAccessTime,
} from 'react-icons/md';
import { FiRefreshCw } from 'react-icons/fi';

import AdminLayout from '@/layouts/AdminLayout';
import PageTitle from '@/components/PageTitle';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import NoInformation from '@/components/NoInformation';

import useInterviewSchedulingApi, { InterviewRecord } from '@/services/interviews/useInterviewSchedulingApi';
import ScheduleInterviewModal from '@/features/Interviews/ScheduleInterviewModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: 'warning' | 'success' | 'default' | 'danger' | 'primary' | 'secondary' }> = {
  planifie:  { label: 'Planifié', color: 'warning' },
  confirme:  { label: 'Confirmé', color: 'success' },
  termine:   { label: 'Terminé',  color: 'default' },
  annule:    { label: 'Annulé',   color: 'danger'  },
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function isUpcoming(iso: string) {
  return new Date(iso) > new Date();
}

function groupByDate(interviews: InterviewRecord[]) {
  const groups: Record<string, InterviewRecord[]> = {};
  interviews.forEach((iv) => {
    const dateKey = new Date(iv.scheduled_at).toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(iv);
  });
  return Object.entries(groups).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
}

// ─── Interview Card ───────────────────────────────────────────────────────────

interface CardProps {
  interview: InterviewRecord;
  onSendReminder: (id: string) => void;
  onSendConvocation: (id: string) => void;
  onCancel: (id: string) => void;
  isLoadingReminder: boolean;
  isLoadingConvocation: boolean;
}

const InterviewCard: React.FC<CardProps> = ({
  interview,
  onSendReminder,
  onSendConvocation,
  onCancel,
  isLoadingReminder,
  isLoadingConvocation,
}) => {
  const { time } = formatDateTime(interview.scheduled_at);
  const status = STATUS_CONFIG[interview.status] ?? { label: interview.status, color: 'default' };
  const upcoming = isUpcoming(interview.scheduled_at);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-base truncate">
            {interview.candidate_first_name} {interview.candidate_last_name}
          </p>
          <p className="text-sm text-[#ffbb00] font-medium truncate">{interview.offer_title}</p>
        </div>
        <Chip size="sm" color={status.color} variant="flat" className="shrink-0">
          {status.label}
        </Chip>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <MdAccessTime className="shrink-0 text-[#ffbb00]" />
          <span>{time} · {interview.duration_minutes} min</span>
        </div>
        {interview.location && (
          <div className="flex items-center gap-2">
            <MdLocationOn className="shrink-0 text-[#ffbb00]" />
            <span className="truncate">{interview.location}</span>
          </div>
        )}
        {interview.interviewer_email && (
          <div className="flex items-center gap-2">
            <MdPerson className="shrink-0 text-[#ffbb00]" />
            <span className="truncate">{interview.interviewer_email}</span>
          </div>
        )}
        {interview.candidate_email && (
          <div className="flex items-center gap-2">
            <MdEmail className="shrink-0 text-gray-400" />
            <span className="truncate">{interview.candidate_email}</span>
          </div>
        )}
      </div>

      {/* Meet link */}
      {interview.meet_link && (
        <a
          href={interview.meet_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#1CA1EF] hover:text-blue-700 font-medium mb-4 w-fit"
        >
          <MdVideoCall className="text-lg" />
          Rejoindre Google Meet
        </a>
      )}

      {/* Email badges */}
      <div className="flex gap-2 flex-wrap mb-4">
        {interview.convocation_sent ? (
          <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            ✓ Convocation envoyée
          </span>
        ) : (
          <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
            ✉ Convocation non envoyée
          </span>
        )}
        {interview.reminder_sent && (
          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            🔔 Rappel envoyé
          </span>
        )}
      </div>

      {/* Notes */}
      {interview.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/40 rounded p-2 mb-4 line-clamp-2">
          {interview.notes}
        </p>
      )}

      {/* Action buttons */}
      {upcoming && interview.status !== 'annule' && (
        <div className="flex gap-2 flex-wrap pt-3 border-t border-gray-100 dark:border-gray-700">
          <Tooltip content="Renvoyer la convocation">
            <button
              onClick={() => onSendConvocation(interview.id)}
              disabled={isLoadingConvocation}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 disabled:opacity-50 transition-colors"
            >
              <MdEmail />
              Convocation
            </button>
          </Tooltip>
          <Tooltip content="Envoyer un rappel">
            <button
              onClick={() => onSendReminder(interview.id)}
              disabled={isLoadingReminder}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 disabled:opacity-50 transition-colors"
            >
              <MdNotifications />
              Rappel
            </button>
          </Tooltip>
          <Tooltip content="Annuler l'entretien">
            <button
              onClick={() => onCancel(interview.id)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
            >
              <MdCancel />
              Annuler
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

// ─── Stats Banner ─────────────────────────────────────────────────────────────

const StatsBanner: React.FC<{ interviews: InterviewRecord[] }> = ({ interviews }) => {
  const total    = interviews.length;
  const upcoming = interviews.filter((i) => isUpcoming(i.scheduled_at) && i.status !== 'annule').length;
  const withMeet = interviews.filter((i) => i.meet_link).length;
  const sent     = interviews.filter((i) => i.convocation_sent).length;

  const stats = [
    { label: 'Total',          value: total,    icon: MdCalendarToday, color: 'text-[#001f3f] dark:text-white' },
    { label: 'À venir',        value: upcoming, icon: MdAccessTime,    color: 'text-[#ffbb00]' },
    { label: 'Avec Meet',      value: withMeet, icon: MdVideoCall,     color: 'text-[#1CA1EF]' },
    { label: 'Convocations',   value: sent,     icon: MdEmail,         color: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className={`text-2xl ${color}`}>
            <Icon />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InterviewPlanningPage() {
  const intl = useIntl();
  const t = (id: string, def: string) => intl.formatMessage({ id, defaultMessage: def });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);
  const [activeConvocation, setActiveConvocation] = useState<string | null>(null);

  const { useListInterviews, useSendReminder, useResendConvocation, useCancelInterview } =
    useInterviewSchedulingApi();

  const { data, isLoading, refetch } = useListInterviews();
  const { mutate: sendReminder }     = useSendReminder();
  const { mutate: resendConvocation } = useResendConvocation();
  const { mutate: cancelInterview }  = useCancelInterview();

  const interviews = data?.data ?? [];
  const grouped    = groupByDate(interviews.filter((i) => i.status !== 'annule'));
  const cancelled  = interviews.filter((i) => i.status === 'annule');

  const handleSendReminder = (id: string) => {
    setActiveReminder(id);
    sendReminder(id, { onSettled: () => setActiveReminder(null) });
  };

  const handleSendConvocation = (id: string) => {
    setActiveConvocation(id);
    resendConvocation(id, { onSettled: () => setActiveConvocation(null) });
  };

  const handleCancel = (id: string) => {
    if (window.confirm(t('interview.cancelConfirm', 'Confirmer l\'annulation de cet entretien ?'))) {
      cancelInterview(id);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PageTitle
            title={t('interview.planning.title', 'Planification des entretiens')}
          />
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#ffbb00] text-white hover:bg-[#e6a800] font-semibold"
            >
              <MdAdd />
              {t('interview.planning.schedule', 'Planifier un entretien')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && interviews.length > 0 && <StatsBanner interviews={interviews} />}

        {/* Content */}
        {isLoading ? (
          <Loader />
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MdCalendarToday className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {t('interview.planning.empty', 'Aucun entretien planifié')}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6">
              {t('interview.planning.emptyDesc', 'Cliquez sur "Planifier un entretien" pour commencer.')}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ffbb00] text-white font-semibold"
            >
              <MdAdd className="mr-1" />
              {t('interview.planning.schedule', 'Planifier un entretien')}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming grouped by date */}
            {grouped.map(([dateKey, dayInterviews]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="text-[#ffbb00]" />
                    <h2 className="font-semibold text-gray-800 dark:text-white capitalize">
                      {dateKey}
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <span className="text-xs text-gray-400">
                    {dayInterviews.length} entretien{dayInterviews.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dayInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      onSendReminder={handleSendReminder}
                      onSendConvocation={handleSendConvocation}
                      onCancel={handleCancel}
                      isLoadingReminder={activeReminder === interview.id}
                      isLoadingConvocation={activeConvocation === interview.id}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Cancelled section */}
            {cancelled.length > 0 && (
              <div>
                <Divider className="my-4" />
                <details>
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-3 select-none">
                    Entretiens annulés ({cancelled.length})
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-3 opacity-60">
                    {cancelled.map((interview) => (
                      <InterviewCard
                        key={interview.id}
                        interview={interview}
                        onSendReminder={handleSendReminder}
                        onSendConvocation={handleSendConvocation}
                        onCancel={handleCancel}
                        isLoadingReminder={activeReminder === interview.id}
                        isLoadingConvocation={activeConvocation === interview.id}
                      />
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Schedule Modal */}
        <ScheduleInterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}
