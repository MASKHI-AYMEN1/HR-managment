import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import { Slider, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Checkbox } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import CustomSelect from '@/components/CustomSelect'
import Typography from '@/components/Typographie'
import useToast from '@/common/hooks/useToast'
import { dateTimeLocalToISO } from '@/common/utils/dateTimeUtils'
import useInterviewEvaluationApi, {
  InterviewEvaluationRHCreate,
  InterviewEvaluationRHUpdate,
  DisponibiliteEnum,
  InterviewDecisionEnum,
  GeneratedQuestionsResponse,
} from '@/services/interview-evaluation/useInterviewEvaluationApi'
import InterviewQuestionsAccordion from '@/components/InterviewQuestionsAccordion'
import CustomTextarea from '@/components/Textarea/CustomTextarea'

const DISPONIBILITE_OPTIONS: { key: DisponibiliteEnum; label: string }[] = [
  { key: 'immediate', label: 'Dès maintenant' },
  { key: 'un_mois', label: '1 mois' },
  { key: 'deux_mois', label: '2 mois' },
  { key: 'trois_mois_plus', label: '3 mois +' },
]

export default function RHEvaluatePage() {
  const router = useRouter()
  const { candidatureId } = router.query
  const queryClient = useQueryClient()
  const intl = useIntl()
  const toast = useToast()

  // React Hook Form
  const { control, setValue, watch } = useForm({
    defaultValues: {
      disponibilite: '' as DisponibiliteEnum | '',
    },
  })

  const disponibiliteValue = watch('disponibilite')

  // Form state
  const [scoreCommunication, setScoreCommunication] = useState(0)
  const [scoreExperience, setScoreExperience] = useState(0)
  const [scoreFormation, setScoreFormation] = useState(0)
  const [scoreMotivation, setScoreMotivation] = useState(0)
  const [scoreComportement, setScoreComportement] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestionsResponse | null>(null)

  // Modal states
  const [showRefuseModal, setShowRefuseModal] = useState(false)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [refuseReason, setRefuseReason] = useState('')

  // Technical interview scheduling
  const [techInterviewDate, setTechInterviewDate] = useState('')
  const [techInterviewDuration, setTechInterviewDuration] = useState('60')
  const [techInterviewLocation, setTechInterviewLocation] = useState('')
  const [techInterviewMeetLink, setTechInterviewMeetLink] = useState('')
  const [techInterviewerEmail, setTechInterviewerEmail] = useState('')
  const [sendEmailInvitation, setSendEmailInvitation] = useState(true)

  const {
    useGetCandidatureInfo,
    useCreateEvaluationRH,
    useUpdateEvaluationRH,
    useGenerateRHQuestions,
    useUpdateInterviewScheduling,
  } = useInterviewEvaluationApi()

  const { data: candidatureInfo, isLoading: isLoadingCandidature, refetch: refetchCandidatureInfo } = useGetCandidatureInfo(candidatureId as string)
  const { mutate: createEvaluation, isPending: isCreating } = useCreateEvaluationRH()
  const { mutate: updateEvaluation, isPending: isUpdating } = useUpdateEvaluationRH()
  const { mutate: generateQuestions, isPending: isGeneratingQuestions } = useGenerateRHQuestions()
  const { mutate: updateInterviewScheduling, isPending: isUpdatingScheduling } = useUpdateInterviewScheduling()

  // Load and pre-fill form when candidature data is available
  useEffect(() => {
    if (candidatureInfo?.evaluationRH) {
      setScoreCommunication(candidatureInfo.evaluationRH.scoreCommunication ?? 0)
      setScoreExperience(candidatureInfo.evaluationRH.scoreExperience ?? 0)
      setScoreFormation(candidatureInfo.evaluationRH.scoreFormation ?? 0)
      setScoreMotivation(candidatureInfo.evaluationRH.scoreMotivation ?? 0)
      setScoreComportement(candidatureInfo.evaluationRH.scoreComportement ?? 0)
      setValue('disponibilite', candidatureInfo.evaluationRH.disponibilite ?? '')
      setCommentaire(candidatureInfo.evaluationRH.commentaire ?? '')
    }
  }, [candidatureInfo])

  const handleGenerateQuestions = () => {
    if (!candidatureInfo) return

    generateQuestions(
      {
        offer_id: candidatureInfo.offerId,
        candidature_id: candidatureInfo.candidatureId,
        num_questions: 10,
      },
      {
        onSuccess: (data) => {
          setGeneratedQuestions(data)
        },
        onError: (error) => {
          console.error('Error generating questions:', error)
          toast.showToast({ 
            type: 'error',
            message: 'Erreur lors de la génération des questions',
            data: { description: 'Impossible de générer les questions d\'entretien' }
          })
        },
      }
    )
  }

  const handleSave = (decision: InterviewDecisionEnum) => {
    if (decision === 'refuse') {
      setShowRefuseModal(true)
      return
    }
    
    if (decision === 'accepte') {
      setShowAcceptModal(true)
      return
    }

    // For 'en_attente', save directly
    saveEvaluation(decision)
  }

  const saveEvaluation = (decision: InterviewDecisionEnum, interviewDate?: string) => {
    if (!candidatureInfo) return

    // If refusing, append reason to comment
    let finalComment = commentaire
    if (decision === 'refuse' && refuseReason) {
      finalComment = commentaire 
        ? `${commentaire}\n\nRaison du refus: ${refuseReason}`
        : `Raison du refus: ${refuseReason}`
    }

    const data = {
      scoreCommunication,
      scoreExperience,
      scoreFormation,
      scoreMotivation,
      scoreComportement,
      disponibilite: disponibiliteValue || undefined,
      commentaire: finalComment || undefined,
      decision,
    }

    const onSuccess = () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'candidature', candidatureId] })
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'rh'] })
      
      // If accepted and has interview date, update the technical evaluation scheduling
      if (decision === 'accepte' && interviewDate) {
        // Wait a bit for the backend to create the technical evaluation
        setTimeout(() => {
          refetchCandidatureInfo().then(({ data: updatedCandidatureInfo }) => {
            if (updatedCandidatureInfo?.evaluationTechnique) {
              // Parse the datetime-local value to ISO string (preserving local time)
              const schedulingData = {
                date_entretien: dateTimeLocalToISO(interviewDate),
                duree_minutes: parseInt(techInterviewDuration),
                lieu: techInterviewLocation || undefined,
                meet_link: techInterviewMeetLink || undefined,
                interviewer_email: techInterviewerEmail || undefined,
                notes_entretien: `Entretien technique planifié depuis l'évaluation RH.${sendEmailInvitation ? ' Email d\'invitation envoyé.' : ''}`,
              }

              updateInterviewScheduling(
                {
                  evaluationId: updatedCandidatureInfo.evaluationTechnique.id,
                  interviewType: 'technique',
                  data: schedulingData,
                },
                {
                  onSuccess: () => {
                    console.log('Technical interview scheduled successfully')
                    if (sendEmailInvitation) {
                      // TODO: Backend should handle email sending
                      console.log('Email invitation should be sent by backend')
                    }
                  },
                  onError: (error) => {
                    console.error('Failed to schedule technical interview:', error)
                    toast.showToast({
                      type: 'error',
                      message: 'Erreur de planification',
                      data: { description: 'Évaluation RH sauvegardée mais erreur lors de la planification de l\'entretien technique' }
                    })
                  },
                }
              )
            }
          })
        }, 500) // Wait 500ms for backend to create the evaluation
      }
      
      toast.showToast({
        type: 'success',
        message: 'Évaluation enregistrée avec succès!',
        data: { 
          description: decision === 'accepte' ? 'Le candidat a été accepté' : decision === 'refuse' ? 'Le candidat a été refusé' : 'Évaluation sauvegardée'
        }
      })
      if (decision !== 'en_attente') {
        router.push('/admin/interviews/rh')
      }
    }

    if (candidatureInfo.evaluationRH) {
      // Update existing
      updateEvaluation(
        { id: candidatureInfo.evaluationRH.id, data: data as InterviewEvaluationRHUpdate },
        { onSuccess }
      )
    } else {
      // Create new
      createEvaluation(
        { ...data, candidatureId: candidatureInfo.candidatureId } as InterviewEvaluationRHCreate,
        { onSuccess }
      )
    }
  }

  const handleConfirmRefuse = () => {
    saveEvaluation('refuse')
    setShowRefuseModal(false)
    setRefuseReason('')
  }

  const handleConfirmAccept = () => {
    if (!techInterviewDate) {
      toast.showToast({
        type: 'warning',
        message: 'Date requise',
        data: { description: 'Veuillez sélectionner une date pour l\'entretien technique' }
      })
      return
    }

    // TODO: Implement email sending logic if sendEmailInvitation is true
    if (sendEmailInvitation) {
      console.log('Sending email invitation to candidate')
      // This should call an API endpoint to send the email
    }

    saveEvaluation('accepte', techInterviewDate)
    setShowAcceptModal(false)
    
    // Reset scheduling fields
    setTechInterviewDate('')
    setTechInterviewDuration('60')
    setTechInterviewLocation('')
    setTechInterviewMeetLink('')
    setTechInterviewerEmail('')
    setSendEmailInvitation(true)
  }

  if (isLoadingCandidature) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warning-600 mx-auto mb-4"></div>
            <Typography>Chargement des informations...</Typography>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!candidatureInfo) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-lg text-center">
            <Typography className="text-danger-600 dark:text-danger-400">
              Candidature introuvable
            </Typography>
            <Button
              className="mt-4"
              onClick={() => router.push('/admin/interviews/rh')}
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const isSaving = isCreating || isUpdating || isUpdatingScheduling

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="bordered"
            onClick={() => router.push('/admin/interviews/rh')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Retour
          </Button>
          <div>
            <PageTitle title="Évaluation RH" />
            <Typography className="text-gray-500 text-sm">
              {candidatureInfo.candidatureName} - {candidatureInfo.offerTitle}
            </Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mx-auto">
          <div className="flex flex-col gap-6">
            {/* AI Question Generation */}
            <div className="flex flex-col gap-3">
              <Button
                color="primary"
                isLoading={isGeneratingQuestions}
                onClick={handleGenerateQuestions}
                className="w-full md:w-auto"
              >
                {generatedQuestions ? '🔄 Régénérer questions IA' : '✨ Générer questions IA'}
              </Button>

              {generatedQuestions && (
                <InterviewQuestionsAccordion 
                  generatedQuestions={generatedQuestions}
                  questionCount={10}
                />
              )}
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Typography className="text-sm font-medium">
                  {intl.formatMessage({ id: 'interview.rh.communication', defaultMessage: 'Communication' })} ({scoreCommunication}/5)
                </Typography>
                <Slider
                  size="sm"
                  step={0.5}
                  minValue={0}
                  maxValue={5}
                  value={scoreCommunication}
                  onChange={(v) => setScoreCommunication(v as number)}
                  color="warning"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Typography className="text-sm font-medium">
                  {intl.formatMessage({ id: 'interview.rh.experience', defaultMessage: 'Expérience' })} ({scoreExperience}/5)
                </Typography>
                <Slider
                  size="sm"
                  step={0.5}
                  minValue={0}
                  maxValue={5}
                  value={scoreExperience}
                  onChange={(v) => setScoreExperience(v as number)}
                  color="warning"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Typography className="text-sm font-medium">
                  {intl.formatMessage({ id: 'interview.rh.formation', defaultMessage: 'Formation' })} ({scoreFormation}/5)
                </Typography>
                <Slider
                  size="sm"
                  step={0.5}
                  minValue={0}
                  maxValue={5}
                  value={scoreFormation}
                  onChange={(v) => setScoreFormation(v as number)}
                  color="warning"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Typography className="text-sm font-medium">
                  {intl.formatMessage({ id: 'interview.rh.motivation', defaultMessage: 'Motivation' })} ({scoreMotivation}/5)
                </Typography>
                <Slider
                  size="sm"
                  step={0.5}
                  minValue={0}
                  maxValue={5}
                  value={scoreMotivation}
                  onChange={(v) => setScoreMotivation(v as number)}
                  color="warning"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Typography className="text-sm font-medium">
                  {intl.formatMessage({ id: 'interview.rh.comportement', defaultMessage: 'Comportement' })} ({scoreComportement}/5)
                </Typography>
                <Slider
                  size="sm"
                  step={0.5}
                  minValue={0}
                  maxValue={5}
                  value={scoreComportement}
                  onChange={(v) => setScoreComportement(v as number)}
                  color="warning"
                />
              </div>

              <div className="flex flex-col gap-2">
                <CustomSelect
                  name="disponibilite"
                  control={control}
                  placeholder={intl.formatMessage({ id: 'interview.rh.disponibilite', defaultMessage: 'Disponibilité' })}
                  items={DISPONIBILITE_OPTIONS}
                  getKey={(item) => item.key}
                  getLabel={(item) => item.label}
                />
              </div>
            </div>

            {/* Commentaire */}
            <div className="flex flex-col gap-2">
              <CustomTextarea
              name="commentaire"
              label={intl.formatMessage({ id: 'interview.commentaire', defaultMessage: 'Commentaire' })}
                value={commentaire}
                onChange={setCommentaire}
                placeholder="Ajouter un commentaire..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="bordered"
                onClick={() => router.push('/admin/interviews/rh')}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button
                color="primary"
                isLoading={isSaving}
                onClick={() => handleSave('en_attente')}
              >
              Enregistrer
              </Button>
              {candidatureInfo && candidatureInfo.evaluationRH && !candidatureInfo.evaluationRH.isClosed && (<><Button
                color="danger"
                isLoading={isSaving}
                onClick={() => handleSave('refuse')}
              >
                Refuser
              </Button>
              <Button
                color="success"
                isLoading={isSaving}
                onClick={() => handleSave('accepte')}
              >
                Accepter
              </Button></>)}
            </div>
          </div>
        </div>

        {/* Refuse Modal */}
        <Modal 
          isOpen={showRefuseModal} 
          onClose={() => setShowRefuseModal(false)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>
              <Typography variant="h3" className="text-danger-600">
                Confirmer le refus
              </Typography>
            </ModalHeader>
            <ModalBody>
              <Typography className="mb-4">
                Êtes-vous sûr de vouloir refuser cette candidature ?
              </Typography>
              <CustomTextarea
                name="refuseReason"
                label="Raison du refus (optionnel)"
                placeholder="Expliquez brièvement la raison du refus..."
                value={refuseReason}
                onChange={setRefuseReason}
                rows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onClick={() => {
                  setShowRefuseModal(false)
                  setRefuseReason('')
                }}
              >
                Annuler
              </Button>
              <Button
                color="danger"
                onClick={handleConfirmRefuse}
              >
                Confirmer le refus
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Accept Modal with Technical Interview Scheduling */}
        <Modal 
          isOpen={showAcceptModal} 
          onClose={() => setShowAcceptModal(false)}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              <Typography variant="h3" className="text-success-600">
                Accepter et planifier l'entretien technique
              </Typography>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Typography>
                  Planifiez l'entretien technique pour le candidat <strong>{candidatureInfo?.candidatureName}</strong>
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="datetime-local"
                    label="Date et heure de l'entretien"
                    value={techInterviewDate}
                    onChange={(e) => setTechInterviewDate(e.target.value)}
                    isRequired
                    variant="bordered"
                  />

                  <Input
                    type="number"
                    label="Durée (minutes)"
                    value={techInterviewDuration}
                    onChange={(e) => setTechInterviewDuration(e.target.value)}
                    min="15"
                    max="240"
                    variant="bordered"
                  />

                  <Input
                    label="Lieu"
                    placeholder="Bureau, Salle de réunion..."
                    value={techInterviewLocation}
                    onChange={(e) => setTechInterviewLocation(e.target.value)}
                    variant="bordered"
                  />

                  <Input
                    label="Lien de réunion (Meet, Zoom...)"
                    placeholder="https://meet.google.com/..."
                    value={techInterviewMeetLink}
                    onChange={(e) => setTechInterviewMeetLink(e.target.value)}
                    variant="bordered"
                  />

                  <Input
                    type="email"
                    label="Email de l'évaluateur technique"
                    placeholder="evaluateur@example.com"
                    value={techInterviewerEmail}
                    onChange={(e) => setTechInterviewerEmail(e.target.value)}
                    variant="bordered"
                    className="md:col-span-2"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <Checkbox
                    isSelected={sendEmailInvitation}
                    onValueChange={setSendEmailInvitation}
                  >
                    <Typography className="text-sm">
                      Envoyer un email d'invitation au candidat
                    </Typography>
                  </Checkbox>
                  {sendEmailInvitation && (
                    <Typography className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-7">
                      Un email sera envoyé au candidat avec les détails de l'entretien technique
                    </Typography>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onClick={() => {
                  setShowAcceptModal(false)
                  setTechInterviewDate('')
                  setTechInterviewDuration('60')
                  setTechInterviewLocation('')
                  setTechInterviewMeetLink('')
                  setTechInterviewerEmail('')
                  setSendEmailInvitation(true)
                }}
              >
                Annuler
              </Button>
              <Button
                color="success"
                onClick={handleConfirmAccept}
                isDisabled={!techInterviewDate}
              >
                Confirmer l'acceptation
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  )
}
