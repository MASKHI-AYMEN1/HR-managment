import React from 'react'
import { useRouter } from 'next/router'
import PublicLayout from '@/layouts/PublicLayout'
import Button from '@/components/Button'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import Loader from '@/components/Loader'
import { useIntl } from 'react-intl'

// ─── Stepper Types ────────────────────────────────────────────────
type StepState = 'completed' | 'active' | 'upcoming'

interface StepDef {
  key: string
  label: string
  description?: string
}

// ─── Status helpers ───────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  en_attente: 'En cours d\'évaluation',
  evaluation_rh: 'Entretien RH',
  evaluation_technique: 'Entretien Technique',
  evaluation_manager: 'Entretien Manager',
  retenu_definitif: 'Acceptée',
  refuse_preselection: 'Refusée',
  refuse_rh: 'Refusée après RH',
  refuse_technique: 'Refusée après Technique',
  refuse_manager: 'Refusée après Manager',
}

const EVALUATION_STATUSES = ['evaluation_rh', 'evaluation_technique', 'evaluation_manager']
const REFUSED_STATUSES = ['refuse_preselection', 'refuse_rh', 'refuse_technique', 'refuse_manager']

function getStepState(stepKey: string, status: string, isRefused: boolean): StepState {
  const order = ['submitted', 'evaluation', 'entretien', 'decision']
  
  // Determine current step based on status
  let currentStep = 'evaluation'
  if (status === 'en_attente') {
    currentStep = 'evaluation'
  } else if (EVALUATION_STATUSES.includes(status)) {
    currentStep = 'entretien'
  } else if (status === 'retenu_definitif' || REFUSED_STATUSES.includes(status)) {
    currentStep = 'decision'
  }
  
  const currentIdx = order.indexOf(currentStep)
  const stepIdx = order.indexOf(stepKey)
  
  // Si refusé, griser les étapes après le refus
  if (isRefused) {
    if (status === 'refuse_preselection') {
      // Refusé pendant l'évaluation
      if (stepKey === 'submitted') return 'completed'
      if (stepKey === 'evaluation') return 'active'
      return 'upcoming'
    } else if (status === 'refuse_rh' || status === 'refuse_technique' || status === 'refuse_manager') {
      // Refusé pendant un entretien
      if (stepKey === 'submitted') return 'completed'
      if (stepKey === 'evaluation') return 'completed'
      if (stepKey === 'entretien') return 'active'
      return 'upcoming'
    }
  }
  
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'active'
  return 'upcoming'
}

function getInterviewSubStepState(subStepKey: string, status: string): StepState {
  const order = ['rh', 'technique', 'manager']
  
  // Gestion des refus
  if (status === 'refuse_rh') {
    if (subStepKey === 'rh') return 'active'
    return 'upcoming'
  } else if (status === 'refuse_technique') {
    const idx = order.indexOf(subStepKey)
    if (idx < 1) return 'completed'
    if (idx === 1) return 'active'
    return 'upcoming'
  } else if (status === 'refuse_manager') {
    const idx = order.indexOf(subStepKey)
    if (idx < 2) return 'completed'
    return 'active'
  } else if (status === 'retenu_definitif') {
    return 'completed'
  }
  
  // En cours d'évaluation
  if (!EVALUATION_STATUSES.includes(status)) {
    return 'upcoming'
  }
  
  const statusToStep: Record<string, string> = {
    evaluation_rh: 'rh',
    evaluation_technique: 'technique',
    evaluation_manager: 'manager',
  }
  
  const currentStep = statusToStep[status] ?? 'rh'
  const currentIdx = order.indexOf(currentStep)
  const stepIdx = order.indexOf(subStepKey)
  
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'active'
  return 'upcoming'
}

// ─── Interview Sub-Step UI ────────────────────────────────────────
function InterviewSubStep({
  label,
  state,
  isLast,
  isRefused,
  evaluationDate,
}: {
  label: string
  state: StepState
  isLast: boolean
  isRefused?: boolean
  evaluationDate?: string
}) {
  const circleBase = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all'
  const circle =
    state === 'completed'
      ? `${circleBase} bg-green-500 text-white`
      : state === 'active'
      ? isRefused
        ? `${circleBase} bg-red-500 text-white ring-2 ring-red-200 dark:ring-red-900`
        : `${circleBase} bg-green-500 text-white ring-2 ring-green-200 dark:ring-green-900`
      : `${circleBase} bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600`

  const lineColor = state === 'completed' ? 'bg-blue-400' : 'bg-gray-300 dark:bg-gray-700'

  return (
    <div className="flex gap-3 pl-6">
      <div className="flex flex-col items-center">
        <div className={circle}>
          {state === 'completed' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : state === 'active' && isRefused ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span>●</span>
          )}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${lineColor}`} />}
      </div>

      <div className="pb-4">
        <p
          className={`font-medium text-xs leading-tight ${
            state === 'upcoming'
              ? 'text-gray-400 dark:text-gray-600'
              : state === 'active' && isRefused
              ? 'text-red-600 dark:text-red-400'
              : state === 'active'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-blue-700 dark:text-blue-400'
          }`}
        >
          {label}
        </p>
        {evaluationDate && state !== 'upcoming' && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {new Date(evaluationDate).toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Single step UI ───────────────────────────────────────────────
function Step({
  step,
  state,
  isLast,
  isAccepted,
  isRefused,
  showInterviewSubSteps,
  interviewSubStepsState,
  evaluationDates,
}: {
  step: StepDef
  state: StepState
  isLast: boolean
  isAccepted?: boolean
  isRefused?: boolean
  showInterviewSubSteps?: boolean
  interviewSubStepsState?: { rh: StepState; technique: StepState; manager: StepState; isRefused?: boolean }
  evaluationDates?: { rh?: string; technique?: string; manager?: string }
}) {
  const circleBase = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all'
  
  // Ajuster les couleurs pour griser les étapes upcoming en cas de refus
  const circle =
    state === 'completed'
      ? `${circleBase} bg-green-500 text-white`
      : state === 'active'
      ? isRefused
        ? `${circleBase} bg-red-500 text-white ring-4 ring-red-200 dark:ring-red-900`
        : isAccepted
        ? `${circleBase} bg-green-500 text-white ring-4 ring-green-200 dark:ring-green-900`
        : `${circleBase} bg-yellow-400 text-gray-900 ring-4 ring-yellow-100 dark:ring-yellow-900`
      : `${circleBase} bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600`

  const lineColor =
    state === 'completed' ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-700'

  return (
    <div className="flex gap-4">
      {/* Left side: circle + line */}
      <div className="flex flex-col items-center">
        <div className={circle}>
          {state === 'completed' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : state === 'active' && isRefused ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span>{isLast && state === 'active' && isAccepted ? '🎉' : '●'}</span>
          )}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-1 min-h-[32px] ${lineColor}`} />}
      </div>

      {/* Right side: text */}
      <div className="pb-8 flex-1">
        <p
          className={`font-semibold text-sm leading-tight ${
            state === 'upcoming'
              ? 'text-gray-400 dark:text-gray-600'
              : state === 'active' && isRefused
              ? 'text-red-600 dark:text-red-400'
              : state === 'active' && isAccepted
              ? 'text-green-600 dark:text-green-400'
              : state === 'active'
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-green-700 dark:text-green-400'
          }`}
        >
          {step.label}
        </p>
        {step.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{step.description}</p>
        )}
        
        {/* Show interview sub-steps if in interview phase */}
        {showInterviewSubSteps && interviewSubStepsState && (
          <div className="mt-4 space-y-0">
            <InterviewSubStep
              label="Entretien RH"
              state={interviewSubStepsState.rh}
              isLast={false}
              isRefused={interviewSubStepsState.rh === 'active' && interviewSubStepsState.isRefused}
              evaluationDate={evaluationDates?.rh}
            />
            <InterviewSubStep
              label="Entretien Technique"
              state={interviewSubStepsState.technique}
              isLast={false}
              isRefused={interviewSubStepsState.technique === 'active' && interviewSubStepsState.isRefused}
              evaluationDate={evaluationDates?.technique}
            />
            <InterviewSubStep
              label="Entretien Manager"
              state={interviewSubStepsState.manager}
              isLast={true}
              isRefused={interviewSubStepsState.manager === 'active' && interviewSubStepsState.isRefused}
              evaluationDate={evaluationDates?.manager}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function CandidatureDetailPage() {
  const intl  = useIntl()
  const router = useRouter()
  const { id, title: queryTitle } = router.query as { id: string; title?: string }

  const { useGetCandidature } = useCandidatureApi()
  const { data: candidature, isLoading, isError } = useGetCandidature(id)

  if (isLoading) return <PublicLayout><Loader /></PublicLayout>

  if (isError || !candidature) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-lg mb-6">
            {intl.formatMessage({ id: 'candidature.notFound', defaultMessage: 'Candidature introuvable.' })}
          </p>
          <Button color="warning" onClick={() => router.push('/candidatures')}>
            {intl.formatMessage({ id: 'button.back', defaultMessage: 'Retour' })}
          </Button>
        </div>
      </PublicLayout>
    )
  }

  const status: string = candidature.status ?? 'en_attente'
  const isAccepted = status === 'retenu_definitif'
  const isRefused = REFUSED_STATUSES.includes(status)
  const isInInterview = EVALUATION_STATUSES.includes(status)

  const steps: StepDef[] = [
    {
      key: 'submitted',
      label: intl.formatMessage({ id: 'candidature.step.submitted', defaultMessage: 'Candidature soumise' }),
      description: candidature.createdAt
        ? new Date(candidature.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : undefined,
    },
    {
      key: 'evaluation',
      label: intl.formatMessage({ id: 'candidature.step.evaluation', defaultMessage: 'En cours d\'évaluation' }),
      description: status === 'en_attente'
        ? intl.formatMessage({ id: 'candidature.step.evaluation.desc', defaultMessage: 'Votre dossier est en cours d\'analyse par notre équipe RH.' })
        : undefined,
    },
    {
      key: 'entretien',
      label: intl.formatMessage({ id: 'candidature.step.entretien', defaultMessage: 'Entretien' }),
      description: !isInInterview && !isRefused && !isAccepted
        ? intl.formatMessage({ id: 'candidature.step.entretien.desc', defaultMessage: 'Un entretien sera planifié si votre profil est retenu.' })
        : isRefused
        ? intl.formatMessage({ id: 'candidature.step.entretien.refused', defaultMessage: 'Processus interrompu' })
        : undefined,
    },
    {
      key: 'decision',
      label: isAccepted
        ? intl.formatMessage({ id: 'candidature.step.accepted', defaultMessage: '🎉 Félicitations ! Candidature acceptée' })
        : isRefused
        ? intl.formatMessage({ id: 'candidature.step.refused', defaultMessage: 'Candidature non retenue' })
        : intl.formatMessage({ id: 'candidature.step.decision', defaultMessage: 'Décision finale' }),
      description: isAccepted
        ? intl.formatMessage({ id: 'candidature.step.accepted.desc', defaultMessage: 'Nous vous contacterons très prochainement pour la suite du processus.' })
        : isRefused
        ? intl.formatMessage({ id: 'candidature.step.refused.desc', defaultMessage: 'Nous vous remercions pour l\'intérêt porté à notre offre et vous souhaitons bonne continuation.' })
        : undefined,
    },
  ]

  // Get interview sub-steps state
  const interviewSubStepsState = isInInterview || isRefused || isAccepted
    ? {
        rh: getInterviewSubStepState('rh', status),
        technique: getInterviewSubStepState('technique', status),
        manager: getInterviewSubStepState('manager', status),
        isRefused,
      }
    : undefined

  // Récupérer les vraies dates d'évaluation depuis l'API
  const evaluationDates = {
    rh: candidature.evaluationRhDate,
    technique: candidature.evaluationTechniqueDate,
    manager: candidature.evaluationManagerDate,
  }

  const fullName = `${candidature.firstName ?? ''} ${candidature.lastName ?? ''}`.trim()

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back button */}
        <button
          onClick={() => router.push('/candidatures')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {intl.formatMessage({ id: 'candidature.backToList', defaultMessage: 'Mes candidatures' })}
        </button>

        {/* Header card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {queryTitle || candidature.offerTitle || intl.formatMessage({ id: 'candidature.offer', defaultMessage: 'Offre' })}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{fullName}</p>
              {candidature.email && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{candidature.email}</p>
              )}
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                isAccepted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : isRefused
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : isInInterview
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              }`}
            >
              {STATUS_LABEL[status] ?? status}
            </span>
          </div>
        </div>

        {/* Stepper card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-6">
            {intl.formatMessage({ id: 'candidature.progress', defaultMessage: 'Avancement de votre candidature' })}
          </h2>
          {steps.map((step, i) => (
            <Step
              key={step.key}
              step={step}
              state={getStepState(step.key, status, isRefused)}
              isLast={i === steps.length - 1}
              isAccepted={isAccepted}
              isRefused={isRefused}
              showInterviewSubSteps={step.key === 'entretien' && (isInInterview || isRefused || isAccepted)}
              interviewSubStepsState={step.key === 'entretien' ? interviewSubStepsState : undefined}
              evaluationDates={step.key === 'entretien' ? evaluationDates : undefined}
            />
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
