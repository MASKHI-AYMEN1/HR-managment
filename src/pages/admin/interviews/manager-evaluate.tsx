import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import { Textarea } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useIntl } from 'react-intl'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import Typography from '@/components/Typographie'
import useToast from '@/common/hooks/useToast'
import useInterviewEvaluationApi, {
  CandidatureInterviewInfo,
  InterviewEvaluationManagerCreate,
  InterviewEvaluationManagerUpdate,
  InterviewDecisionEnum,
  GeneratedQuestionsResponse,
} from '@/services/interview-evaluation/useInterviewEvaluationApi'
import InterviewQuestionsAccordion from '@/components/InterviewQuestionsAccordion'

export default function ManagerEvaluatePage() {
  const router = useRouter()
  const { candidatureId } = router.query
  const queryClient = useQueryClient()
  const intl = useIntl()
  const toast = useToast()

  // Form state
  const [commentaire, setCommentaire] = useState('')
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestionsResponse | null>(null)

  const {
    useGetCandidatureInfo,
    useCreateEvaluationManager,
    useUpdateEvaluationManager,
    useGenerateManagerQuestions,
  } = useInterviewEvaluationApi()

  const { data: candidatureInfo, isLoading: isLoadingCandidature } = useGetCandidatureInfo(candidatureId as string)
  const { mutate: createEvaluation, isPending: isCreating } = useCreateEvaluationManager()
  const { mutate: updateEvaluation, isPending: isUpdating } = useUpdateEvaluationManager()
  const { mutate: generateQuestions, isPending: isGeneratingQuestions } = useGenerateManagerQuestions()

  // Load and pre-fill form when candidature data is available
  useEffect(() => {
    if (candidatureInfo?.evaluationManager) {
      setCommentaire(candidatureInfo.evaluationManager.commentaire ?? '')
    }
  }, [candidatureInfo])

  const handleGenerateQuestions = () => {
    if (!candidatureInfo) return

    generateQuestions(
      {
        offer_id: candidatureInfo.offerId,
        candidature_id: candidatureInfo.candidatureId,
        num_questions: 8,
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
      commentaire: commentaire || undefined,
      decision,
    }

    const onSuccess = () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'candidature', candidatureId] })
      queryClient.invalidateQueries({ queryKey: ['interview-evaluation', 'manager'] })
      
      toast.showToast({
        type: 'success',
        message: 'Évaluation enregistrée avec succès!',
        data: { 
          description: decision === 'accepte' ? 'Le candidat a été accepté définitivement' : decision === 'refuse' ? 'Le candidat a été refusé' : 'Évaluation sauvegardée'
        }
      })
      
      // If accepted, the candidature process is complete (no more interviews to schedule)
      if (decision !== 'en_attente') {
        router.push('/admin/interviews/manager')
      }
    }

    if (candidatureInfo.evaluationManager) {
      // Update existing
      updateEvaluation(
        { id: candidatureInfo.evaluationManager.id, data: data as InterviewEvaluationManagerUpdate },
        { onSuccess }
      )
    } else {
      // Create new
      createEvaluation(
        { ...data, candidatureId: candidatureInfo.candidatureId } as InterviewEvaluationManagerCreate,
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
              onClick={() => router.push('/admin/interviews/manager')}
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
            onClick={() => router.push('/admin/interviews/manager')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Retour
          </Button>
          <div>
            <PageTitle title="Décision Finale - Manager" />
            <Typography className="text-gray-500 text-sm">
              {candidatureInfo.candidatureName} - {candidatureInfo.offerTitle}
            </Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
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
                  questionCount={8}
                />
              )}
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Résumé des évaluations précédentes */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <Typography className="text-sm font-medium mb-3">
                {intl.formatMessage({ id: 'interview.manager.resume', defaultMessage: 'Résumé des évaluations' })}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Typography variant="span" className="text-gray-500">
                    {intl.formatMessage({ id: 'interview.manager.evaluationRH', defaultMessage: 'Évaluation RH:' })}
                  </Typography>
                  {candidatureInfo.evaluationRH ? (
                    <span className={`ml-2 font-medium ${
                      candidatureInfo.evaluationRH.decision === 'accepte' ? 'text-success-600' :
                      candidatureInfo.evaluationRH.decision === 'refuse' ? 'text-danger-600' :
                      'text-warning-600'
                    }`}>
                      {candidatureInfo.evaluationRH.decision === 'accepte' ? 'Accepté' :
                       candidatureInfo.evaluationRH.decision === 'refuse' ? 'Refusé' : 'En attente'}
                      {candidatureInfo.evaluationRH.scoreGlobal && ` (${candidatureInfo.evaluationRH.scoreGlobal.toFixed(1)}/5)`}
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-400">Non évalué</span>
                  )}
                </div>
                <div>
                  <Typography variant="span" className="text-gray-500">
                    {intl.formatMessage({ id: 'interview.manager.evaluationTechnique', defaultMessage: 'Évaluation Technique:' })}
                  </Typography>
                  {candidatureInfo.evaluationTechnique ? (
                    <span className={`ml-2 font-medium ${
                      candidatureInfo.evaluationTechnique.decision === 'accepte' ? 'text-success-600' :
                      candidatureInfo.evaluationTechnique.decision === 'refuse' ? 'text-danger-600' :
                      'text-warning-600'
                    }`}>
                      {candidatureInfo.evaluationTechnique.decision === 'accepte' ? 'Accepté' :
                       candidatureInfo.evaluationTechnique.decision === 'refuse' ? 'Refusé' : 'En attente'}
                      {candidatureInfo.evaluationTechnique.scoreCompetenceTechnique && 
                        ` (${candidatureInfo.evaluationTechnique.scoreCompetenceTechnique}/5)`}
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-400">Non évalué</span>
                  )}
                </div>
              </div>
            </div>

            {/* Commentaire */}
            <div className="flex flex-col gap-2">
              <Typography className="text-sm font-medium">
                {intl.formatMessage({ id: 'interview.manager.commentaireFinal', defaultMessage: 'Commentaire final' })}
              </Typography>
              <Textarea
                value={commentaire}
                onValueChange={setCommentaire}
                placeholder="Ajouter votre commentaire final sur ce candidat..."
                minRows={5}
              />
            </div>

            {/* Instructions */}
            <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg">
              <p className="text-sm text-warning-700 dark:text-warning-400">
                <strong>Note:</strong> Votre décision est finale. En acceptant ce candidat, 
                son statut passera à "Accepté" et le processus de recrutement sera terminé.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
              color='secondary'
                onClick={() => router.push('/admin/interviews/manager')}
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
             {candidatureInfo.evaluationManager && candidatureInfo.evaluationManager.isClosed==false && (<>
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
              </Button></> )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
