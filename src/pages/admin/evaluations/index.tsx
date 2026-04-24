import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Slider, Textarea } from '@heroui/react'
import { MdRateReview, MdQuestionAnswer, MdRefresh } from 'react-icons/md'
import { FiSave, FiCheckCircle } from 'react-icons/fi'

import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import Label from '@/components/Label'
import CustomSelect from '@/components/CustomSelect'
import NoInformation from '@/components/NoInformation'
import useToast from '@/common/hooks/useToast'

import useOffersApi from '@/services/offers/useOffersApi'
import useCandidatureApi from '@/services/candidature/useCandidatureApi'
import useEvaluationsApi from '@/services/evaluations/useEvaluationsApi'
import useInterviewsApi, { InterviewQuestionsResponse } from '@/services/interviews/useInterviewsApi'

// ─── Constants ───────────────────────────────────────────────────────────────

const NUM_QUESTIONS_ITEMS = [
  { key: '5',  label: '5' },
  { key: '8',  label: '8' },
  { key: '10', label: '10' },
  { key: '15', label: '15' },
  { key: '20', label: '20' },
]

const RECOMMANDATION_ITEMS = [
  { key: 'en_attente', label: 'En attente' },
  { key: 'accepter',   label: 'Accepter'   },
  { key: 'refuser',    label: 'Refuser'    },
  { key: 'entretien',  label: 'Entretien'  },
]

const SCORE_CRITERIA = [
  { field: 'scoreCompetencesTechniques', labelId: 'evaluation.criteria.technical',  defaultLabel: 'Compétences techniques'  },
  { field: 'scoreSoftSkills',            labelId: 'evaluation.criteria.softSkills', defaultLabel: 'Soft skills'             },
  { field: 'scoreExperience',            labelId: 'evaluation.criteria.experience', defaultLabel: 'Expérience'              },
  { field: 'scoreFormation',             labelId: 'evaluation.criteria.formation',  defaultLabel: 'Formation'               },
  { field: 'scoreMotivation',            labelId: 'evaluation.criteria.motivation', defaultLabel: 'Motivation'              },
  { field: 'scoreAdequationPoste',       labelId: 'evaluation.criteria.adequation', defaultLabel: 'Adéquation au poste'     },
] as const

const SLIDER_MARKS = [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }))

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectionForm = { offerId: string; candidatureId: string }
type EvaluationScores = Record<typeof SCORE_CRITERIA[number]['field'], number>

export default function EvaluationsPage() {
  const intl = useIntl()
  const t = (id: string, def: string) => intl.formatMessage({ id, defaultMessage: def })
  const toast = useToast()

  // ── Selection form (react-hook-form) ────────────────────────────────────────
  const { control, watch, setValue } = useForm<SelectionForm>({
    defaultValues: { offerId: '', candidatureId: '' },
  })
  const watchedOfferId       = watch('offerId')
  const watchedCandidatureId = watch('candidatureId')

  // Reset candidature when offer changes
  useEffect(() => {
    setValue('candidatureId', '')
  }, [watchedOfferId, setValue])

  // ── Evaluation state ────────────────────────────────────────────────────────
  const [scores, setScores] = React.useState<EvaluationScores>({
    scoreCompetencesTechniques: 3,
    scoreSoftSkills:            3,
    scoreExperience:            3,
    scoreFormation:             3,
    scoreMotivation:            3,
    scoreAdequationPoste:       3,
  })
  const [commentaires,   setCommentaires]   = React.useState('')
  const [pointsForts,    setPointsForts]    = React.useState('')
  const [pointsFaibles,  setPointsFaibles]  = React.useState('')
  const [recommandation, setRecommandation] = React.useState('en_attente')

  // ── Interview state ─────────────────────────────────────────────────────────
  const [numQuestions,  setNumQuestions]  = React.useState('10')
  const [interviewData, setInterviewData] = React.useState<InterviewQuestionsResponse | null>(null)

  // ── APIs ────────────────────────────────────────────────────────────────────
  const { useListOffersByStatus }      = useOffersApi()
  const { useListCandidaturesByOffer } = useCandidatureApi()
  const { useCreateEvaluation, useGetEvaluationByCandidature, useUpdateEvaluation } = useEvaluationsApi()
  const { useGenerateQuestions }       = useInterviewsApi()

  const { data: offersData,       isLoading: offersLoading }       = useListOffersByStatus('en_evaluation', 1, 100)
  const { data: candidaturesData, isLoading: candidaturesLoading } = useListCandidaturesByOffer({
    offerId:  watchedOfferId || undefined,
    status:   'accepter',
    page:     1,
    pageSize: 100,
  })
  const { data: existingEvaluation, isLoading: evaluationLoading } = useGetEvaluationByCandidature(
    watchedCandidatureId || undefined,
  )

  const createMutation   = useCreateEvaluation()
  const updateMutation   = useUpdateEvaluation(existingEvaluation?.id)
  const generateMutation = useGenerateQuestions()

  const offersInEvaluation   = offersData?.data ?? []
  const acceptedCandidatures = candidaturesData?.data ?? []

  // ── Sync form with existing evaluation ──────────────────────────────────────
  useEffect(() => {
    if (existingEvaluation) {
      setScores({
        scoreCompetencesTechniques: existingEvaluation.scoreCompetencesTechniques ?? 3,
        scoreSoftSkills:            existingEvaluation.scoreSoftSkills            ?? 3,
        scoreExperience:            existingEvaluation.scoreExperience            ?? 3,
        scoreFormation:             existingEvaluation.scoreFormation             ?? 3,
        scoreMotivation:            existingEvaluation.scoreMotivation            ?? 3,
        scoreAdequationPoste:       existingEvaluation.scoreAdequationPoste       ?? 3,
      })
      setCommentaires(existingEvaluation.commentaires   || '')
      setPointsForts(existingEvaluation.pointsForts     || '')
      setPointsFaibles(existingEvaluation.pointsFaibles || '')
      setRecommandation(existingEvaluation.recommandation || 'en_attente')
    } else {
      setScores({ scoreCompetencesTechniques: 3, scoreSoftSkills: 3, scoreExperience: 3, scoreFormation: 3, scoreMotivation: 3, scoreAdequationPoste: 3 })
      setCommentaires('')
      setPointsForts('')
      setPointsFaibles('')
      setRecommandation('en_attente')
    }
    setInterviewData(null)
  }, [existingEvaluation, watchedCandidatureId])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!watchedCandidatureId) return
    const payload = {
      candidatureId: watchedCandidatureId,
      ...scores,
      commentaires:  commentaires  || undefined,
      pointsForts:   pointsForts   || undefined,
      pointsFaibles: pointsFaibles || undefined,
      recommandation: recommandation as any,
    }
    try {
      if (existingEvaluation) {
        await updateMutation.mutateAsync(payload)
        toast.showToast({
          type: 'success',
          message: t('evaluation.updateSuccess', 'Évaluation mise à jour avec succès !'),
          data: { description: 'L\'évaluation a été modifiée' }
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast.showToast({
          type: 'success',
          message: t('evaluation.createSuccess', 'Évaluation créée avec succès !'),
          data: { description: 'L\'évaluation a été créée' }
        })
      }
    } catch (error: any) {
      toast.showToast({
        type: 'error',
        message: error?.response?.data?.detail || t('evaluation.error', 'Erreur lors de la sauvegarde'),
        data: { description: 'Impossible de sauvegarder l\'évaluation' }
      })
    }
  }

  const handleGenerateQuestions = () => {
    if (!watchedOfferId || !watchedCandidatureId) return
    generateMutation.mutate(
      { offer_id: watchedOfferId, candidature_id: watchedCandidatureId, num_questions: parseInt(numQuestions) },
      { onSuccess: (data) => setInterviewData(data) },
    )
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const globalScore = existingEvaluation?.scoreGlobal
    ? Number(existingEvaluation.scoreGlobal)
    : Object.values(scores).reduce((a, b) => a + b, 0) / 6

  const getScoreColor = (s: number) => s >= 4 ? 'success' : s >= 3 ? 'warning' : 'danger'

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      'Technique':            'bg-yellow-100 text-yellow-800',
      'Expérience':           'bg-amber-100 text-amber-800',
      'Comportementale':      'bg-green-100 text-green-800',
      'Motivation':           'bg-orange-100 text-orange-800',
      'Projet':               'bg-red-100 text-red-800',
      "Culture d'entreprise": 'bg-gray-100 text-gray-800',
    }
    return map[category] || 'bg-gray-100 text-gray-800'
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageTitle title={t('menuAdminItems.evaluations', 'Évaluations')} />

        {/* ── Section 1 : Sélection ──────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <MdRateReview className="text-2xl text-purple-600" />
            <div>
              <Label variant="semibold">{t('evaluation.selection', 'Sélection')}</Label>
              <Label variant="muted" className="text-sm">
                {t('evaluation.selectionDesc', 'Choisissez une offre en évaluation et un candidat accepté')}
              </Label>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Offer */}
              <div>
                <Label variant="small" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {t('evaluation.selectOffer', 'Offre en évaluation')}
                </Label>
                <CustomSelect
                  name="offerId"
                  control={control}
                  label=""
                  placeholder={t('evaluation.chooseOffer', 'Sélectionner une offre...')}
                  items={offersInEvaluation}
                  getKey={(o: any) => o.id}
                  getLabel={(o: any) => `${o.title}${o.candidaturesCount ? ` (${o.candidaturesCount})` : ''}`}
                  isDisabled={offersLoading}
                  variant="bordered"
                />
                {!offersLoading && offersInEvaluation.length === 0 && (
                  <Label variant="muted" className="text-sm mt-1">
                    {t('evaluation.noOffersInEvaluation', 'Aucune offre en évaluation')}
                  </Label>
                )}
              </div>

              {/* Candidature */}
              <div>
                <Label variant="small" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {t('evaluation.selectCandidate', 'Candidat accepté')}
                </Label>
                <CustomSelect
                  name="candidatureId"
                  control={control}
                  label=""
                  placeholder={t('evaluation.chooseCandidate', 'Sélectionner un candidat...')}
                  items={acceptedCandidatures}
                  getKey={(c: any) => c.id}
                  getLabel={(c: any) => `${c.firstName} ${c.lastName}${c.email ? ` (${c.email})` : ''}`}
                  isDisabled={!watchedOfferId || candidaturesLoading}
                  variant="bordered"
                />
                {watchedOfferId && !candidaturesLoading && acceptedCandidatures.length === 0 && (
                  <Label variant="muted" className="text-sm mt-1">
                    {t('evaluation.noAcceptedCandidates', 'Aucun candidat accepté pour cette offre')}
                  </Label>
                )}
              </div>
            </div>

            {/* Existing evaluation notice */}
            {watchedCandidatureId && !evaluationLoading && existingEvaluation && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <FiCheckCircle className="text-blue-600 text-xl flex-shrink-0" />
                <Label variant="small" className="text-blue-700 dark:text-blue-300">
                  {t('evaluation.existingFound', 'Une évaluation existe déjà pour ce candidat. Elle sera mise à jour.')}
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* ── Loading ────────────────────────────────────────────────────────── */}
        {watchedCandidatureId && evaluationLoading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}

        {/* ── Section 2 : Questions d'entretien ─────────────────────────────── */}
        {watchedCandidatureId && !evaluationLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MdQuestionAnswer className="text-2xl" />
                <Label variant="semibold" className="text-lg text-white">
                  {t('interview.generateTitle', "Générer des questions d'entretien")}
                </Label>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="w-48">
                  <Label variant="small" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('interview.numQuestions', 'Nombre de questions')}
                  </Label>
                  <CustomSelect
                    name="numQuestionsField"
                    control={control}
                    label=""
                    placeholder="10"
                    items={NUM_QUESTIONS_ITEMS}
                    getKey={(item) => item.key}
                    getLabel={(item) => item.label}
                    disallowEmptySelection
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys as Set<string>)[0]
                      if (val) setNumQuestions(val)
                    }}
                  />
                </div>
                <Button
                  color="warning"
                  onClick={handleGenerateQuestions}
                  disabled={generateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <MdQuestionAnswer size={18} />
                  {t('interview.generate', 'Générer les questions')}
                </Button>
              </div>

              {generateMutation.isPending && (
                <div className="flex items-center gap-3 py-6 justify-center">
                  <Loader />
                  <Label variant="muted">
                    {t('interview.generating', 'Génération des questions en cours...')}
                  </Label>
                </div>
              )}

              {interviewData && !generateMutation.isPending && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <Label variant="semibold" className="text-gray-700 dark:text-gray-300">
                      {interviewData.questions.length} {t('interview.questions', 'questions')}
                      {interviewData.candidate_specific && interviewData.candidate_name && (
                        <> — {interviewData.candidate_name}</>
                      )}
                    </Label>
                    <Button
                      onClick={handleGenerateQuestions}
                      disabled={generateMutation.isPending}
                      className="flex items-center gap-1 text-sm"
                    >
                      <MdRefresh size={16} />
                      {t('interview.refresh', 'Rafraîchir')}
                    </Button>
                  </div>

                  {interviewData.interview_structure && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <Label variant="semibold" className="mb-1">
                        {t('interview.structure', 'Structure suggérée')}
                      </Label>
                      <Label variant="small" className="text-gray-700 dark:text-gray-300 mt-1">
                        {interviewData.interview_structure}
                      </Label>
                    </div>
                  )}

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="space-y-4">
                    {interviewData.questions.map((q, idx) => (
                      <div
                        key={q.id ?? idx}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full flex items-center justify-center font-semibold text-sm">
                            {q.id ?? idx + 1}
                          </div>
                          <div className="flex-grow space-y-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(q.category)}`}>
                              {q.category}
                            </span>
                            <Label variant="medium" className="text-base text-gray-900 dark:text-white">
                              {q.question}
                            </Label>
                            {q.follow_up && (
                              <Label variant="small" className="text-gray-600 dark:text-gray-400 italic pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                                <strong>{t('interview.followUp', 'Question de suivi')} :</strong> {q.follow_up}
                              </Label>
                            )}
                            {q.evaluation_tips && (
                              <Label variant="small" className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                <strong>{t('interview.evaluationTips', "Points d'évaluation")} :</strong> {q.evaluation_tips}
                              </Label>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {interviewData.key_points_to_verify && interviewData.key_points_to_verify.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <Label variant="semibold" className="mb-2">
                        {t('interview.keyPoints', 'Points clés à vérifier')}
                      </Label>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {interviewData.key_points_to_verify.map((pt, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Label variant="muted" className="text-xs text-center block pt-2">
                    {t('interview.poweredBy', 'Généré par')} {interviewData.provider} ({interviewData.model})
                  </Label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Section 3 : Formulaire d'évaluation ──────────────────────────── */}
        {watchedCandidatureId && !evaluationLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MdRateReview className="text-2xl" />
                <Label variant="semibold" className="text-lg text-white">
                  {t('evaluation.form', "Formulaire d'évaluation")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label variant="small" className="text-white/80">
                  {t('evaluation.globalScore', 'Note globale')} :
                </Label>
                <span className={`text-2xl font-bold ${
                  globalScore >= 4 ? 'text-green-200' : globalScore >= 3 ? 'text-yellow-200' : 'text-red-200'
                }`}>
                  {globalScore.toFixed(2)} / 5
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SCORE_CRITERIA.map(({ field, labelId, defaultLabel }) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label variant="small" className="font-semibold">
                      {t(labelId, defaultLabel)}
                    </Label>
                    <Slider
                      size="md"
                      step={0.5}
                      maxValue={5}
                      minValue={0}
                      value={scores[field]}
                      onChange={(v) => setScores((prev) => ({ ...prev, [field]: v as number }))}
                      className="max-w-full"
                      color={getScoreColor(scores[field])}
                      showTooltip
                      marks={SLIDER_MARKS}
                    />
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Text fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label variant="small" className="font-semibold">
                    {t('evaluation.strengths', 'Points forts')}
                  </Label>
                  <Textarea
                    placeholder={t('evaluation.strengthsPlaceholder', 'Listez les points forts du candidat...')}
                    value={pointsForts}
                    onValueChange={setPointsForts}
                    minRows={4}
                    variant="bordered"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label variant="small" className="font-semibold">
                    {t('evaluation.weaknesses', 'Points faibles')}
                  </Label>
                  <Textarea
                    placeholder={t('evaluation.weaknessesPlaceholder', 'Listez les points à améliorer...')}
                    value={pointsFaibles}
                    onValueChange={setPointsFaibles}
                    minRows={4}
                    variant="bordered"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label variant="small" className="font-semibold">
                    {t('evaluation.comments', 'Commentaires')}
                  </Label>
                  <Textarea
                    placeholder={t('evaluation.commentsPlaceholder', 'Commentaires généraux...')}
                    value={commentaires}
                    onValueChange={setCommentaires}
                    minRows={4}
                    variant="bordered"
                  />
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Recommendation + Save */}
              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="w-full md:w-64">
                  <Label variant="small" className="font-semibold mb-1">
                    {t('evaluation.recommendation', 'Recommandation')}
                  </Label>
                  <CustomSelect
                    name="recommandationField"
                    control={control}
                    label=""
                    placeholder="Recommandation"
                    items={RECOMMANDATION_ITEMS}
                    getKey={(item) => item.key}
                    getLabel={(item) => item.label}
                    disallowEmptySelection
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys as Set<string>)[0]
                      if (val) setRecommandation(val)
                    }}
                  />
                </div>
                <div className="flex justify-end flex-1">
                  <Button
                    color="primary"
                    onClick={handleSave}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex items-center gap-2 font-semibold"
                  >
                    <FiSave size={18} />
                    {existingEvaluation
                      ? t('evaluation.update', "Mettre à jour l'évaluation")
                      : t('evaluation.save', "Sauvegarder l'évaluation")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!watchedCandidatureId && !offersLoading && (
          <NoInformation label={t('evaluation.selectToStart', 'Sélectionnez une offre et un candidat pour commencer')} />
        )}
      </div>
    </AdminLayout>
  )
}

