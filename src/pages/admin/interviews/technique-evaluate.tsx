import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import { Slider } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useIntl } from 'react-intl'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import Typography from '@/components/Typographie'
import useToast from '@/common/hooks/useToast'
import useInterviewEvaluationApi, {
  CandidatureInterviewInfo,
  InterviewEvaluationTechniqueCreate,
  InterviewEvaluationTechniqueUpdate,
  InterviewDecisionEnum,
  GeneratedQuestionsResponse,
} from '@/services/interview-evaluation/useInterviewEvaluationApi'
import InterviewQuestionsAccordion from '@/components/InterviewQuestionsAccordion'
import CustomTextarea from '@/components/Textarea/CustomTextarea'

export default function TechniqueEvaluatePage() {
  const router = useRouter()
  const { candidatureId } = router.query
  const queryClient = useQueryClient()
  const intl = useIntl()
  const toast = useToast()

  // Form state
  const [pointsForts, setPointsForts] = useState('')
  const [pointsFaibles, setPointsFaibles] = useState('')
  const [scoreCompetenceTechnique, setScoreCompetenceTechnique] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestionsResponse | null>(null)

  const {
    useGetCandidatureInfo,
    useCreateEvaluationTechnique,
    useUpdateEvaluationTechnique,
    useGenerateTechniqueQuestions,
  } = useInterviewEvaluationApi()

  const { data: candidatureInfo, isLoading: isLoadingCandidature } = useGetCandidatureInfo(candidatureId as string)
  const { mutate: createEvaluation, isPending: isCreating } = useCreateEvaluationTechnique()
  const { mutate: updateEvaluation, isPending: isUpdating } = useUpdateEvaluationTechnique()
  const { mutate: generateQuestions, isPending: isGeneratingQuestions } = useGenerateTechniqueQuestions()

  // Load and pre-fill form when candidature data is available
  useEffect(() => {
    if (candidatureInfo?.evaluationTechnique) {
      setPointsForts(candidatureInfo.evaluationTechnique.pointsForts ?? '')
      setPointsFaibles(candidatureInfo.evaluationTechnique.pointsFaibles ?? '')
      setScoreCompetenceTechnique(candidatureInfo.evaluationTechnique.scoreCompetenceTechnique ?? 0)
      setCommentaire(candidatureInfo.evaluationTechnique.commentaire ?? '')
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
    if (!candidatureInfo) return

    const data = {
      pointsForts: pointsForts || undefined,
      pointsFaibles: pointsFaibles || undefined,
      scoreCompetenceTechnique,
      commentaire: commentaire || undefined,
      decision,
    }

    const onSuccess = () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'candidature', candidatureId] })
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'technique'] })

      toast.showToast({
        type: 'success',
        message: 'Évaluation enregistrée avec succès!',
        data: {
          description: decision === 'accepte' ? 'Le candidat a été accepté' : decision === 'refuse' ? 'Le candidat a été refusé' : 'Évaluation sauvegardée'
        }
      })
      if (decision !== 'en_attente') {
        router.push('/admin/interviews/technique')
      }
    }

    if (candidatureInfo.evaluationTechnique) {
      // Update existing
      updateEvaluation(
        { id: candidatureInfo.evaluationTechnique.id, data: data as InterviewEvaluationTechniqueUpdate },
        { onSuccess }
      )
    } else {
      // Create new
      createEvaluation(
        { ...data, candidatureId: candidatureInfo.candidatureId } as InterviewEvaluationTechniqueCreate,
        { onSuccess }
      )
    }
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
              onClick={() => router.push('/admin/interviews/technique')}
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const isSaving = isCreating || isUpdating

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="bordered"
            color='primary'
            onClick={() => router.push('/admin/interviews/technique')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Retour
          </Button>
          <div>
            <PageTitle title="Évaluation Technique" />
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
                color='primary'
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

            {/* Points forts */}
            <div className="flex flex-col gap-2">
              <CustomTextarea
                name="pointsForts"
                label={intl.formatMessage({ id: 'interview.technique.pointsForts', defaultMessage: 'Points Forts' })}
                value={pointsForts}
                onChange={setPointsForts}
                placeholder="Décrire les points forts techniques du candidat..."
                rows={4}
              />
            </div>

            {/* Points faibles */}
            <div className="flex flex-col gap-2">
              <CustomTextarea
                name="pointsFaibles"
                label={intl.formatMessage({ id: 'interview.technique.pointsFaibles', defaultMessage: 'Points Faibles' })}
                value={pointsFaibles}
                onChange={setPointsFaibles}
                placeholder="Décrire les points faibles ou axes d'amélioration..."
                rows={4}
              />
            </div>

            {/* Score compétence technique */}
            <div className="flex flex-col gap-2">
              <Typography className="text-sm font-medium">
                {intl.formatMessage({ id: 'interview.technique.competence', defaultMessage: 'Compétence Technique' })} ({scoreCompetenceTechnique}/5)
              </Typography>
              <Slider
                size="md"
                step={0.5}
                minValue={0}
                maxValue={5}
                value={scoreCompetenceTechnique}
                onChange={(v) => setScoreCompetenceTechnique(v as number)}
                color="warning"
                showSteps
                marks={[
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                ]}
              />
            </div>

            {/* Commentaire */}
            <div className="flex flex-col gap-2">
              <CustomTextarea
                name="commentaire"
                label={intl.formatMessage({ id: 'interview.commentaire', defaultMessage: 'Commentaire' })}
                value={commentaire}
                onChange={setCommentaire}
                placeholder="Ajouter un commentaire général..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                color='secondary'
                onClick={() => router.push('/admin/interviews/technique')}
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
              
              {candidatureInfo.evaluationTechnique && candidatureInfo.evaluationTechnique.isClosed == false && (<>
                <Button
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
      </div>
    </AdminLayout>
  )
}
