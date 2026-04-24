import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { MdRefresh, MdQuestionAnswer } from 'react-icons/md';
import AdminLayout from '@/layouts/AdminLayout';
import PageTitle from '@/components/PageTitle';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import Label from '@/components/Label';
import CustomSelect from '@/components/CustomSelect';
import useOffersApi from '@/services/offers/useOffersApi';
import useInterviewsApi from '@/services/interviews/useInterviewsApi';

interface InterviewFormValues {
  offerId: string;
  candidateId: string;
  numQuestions: string;
}

const NUM_QUESTIONS_ITEMS = [
  { key: '5', label: '5' },
  { key: '10', label: '10' },
  { key: '15', label: '15' },
  { key: '20', label: '20' },
];

const InterviewPage = () => {
  const intl = useIntl();
  const { control, watch, setValue } = useForm<InterviewFormValues>({
    defaultValues: { offerId: '', candidateId: '', numQuestions: '10' },
  });

  const watchedOfferId = watch('offerId');
  const watchedCandidateId = watch('candidateId');
  const watchedNumQuestions = watch('numQuestions');

  // Reset candidate when offer changes
  useEffect(() => {
    setValue('candidateId', '');
  }, [watchedOfferId, setValue]);

  const { useListOffersByStatus } = useOffersApi();
  const { useGenerateQuestions, useListCandidatesForInterview } = useInterviewsApi();

  const { data: offersData, isLoading: offersLoading } = useListOffersByStatus('en_evaluation', 1, 100);
  const { data: candidatesData, isLoading: candidatesLoading } = useListCandidatesForInterview(watchedOfferId);
  const { mutate: generateQuestions, data: questionsData, isPending: generating } = useGenerateQuestions();

  // Offers in evaluation status (all returned by the API are already filtered)
  const offersInEvaluation = offersData?.data ?? [];
  const candidateItems = candidatesData?.candidates ?? [];

  const handleGenerateQuestions = () => {
    if (!watchedOfferId) return;

    generateQuestions({
      offer_id: watchedOfferId,
      candidature_id: watchedCandidateId || undefined,
      num_questions: parseInt(watchedNumQuestions || '10'),
    });
  };

  const handleRefresh = () => {
    handleGenerateQuestions();
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Technique': 'bg-yellow-100 text-yellow-800',
      'Expérience': 'bg-brown-100 text-brown-800',
      'Comportementale': 'bg-green-100 text-green-800',
      'Motivation': 'bg-yellow-100 text-yellow-800',
      'Projet': 'bg-red-100 text-red-800',
      'Culture d\'entreprise': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageTitle
          title={intl.formatMessage({ id: 'interview.title', defaultMessage: 'Entretiens' })}
        />

        {/* Selection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Offer Selection */}
              <div>
                <Label variant="small" className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {intl.formatMessage({ id: 'interview.selectOffer', defaultMessage: 'Sélectionner une offre' })}
                </Label>
                <CustomSelect
                  name="offerId"
                  control={control}
                  label=""
                  placeholder={intl.formatMessage({ id: 'interview.chooseOffer', defaultMessage: 'Choisir une offre' })}
                  items={offersInEvaluation}
                  getKey={(offer: any) => offer.id}
                  getLabel={(offer: any) => offer.title}
                  isDisabled={offersLoading}
                  variant="bordered"
                />
                {!offersLoading && offersInEvaluation.length === 0 && (
                  <Label variant="muted" className="text-sm mt-1">
                    {intl.formatMessage({
                      id: 'interview.noOffersInEvaluation',
                      defaultMessage: 'Aucune offre en évaluation',
                    })}
                  </Label>
                )}
              </div>

              {/* Candidate Selection */}
              <div>
                <Label variant="small" className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {intl.formatMessage({ id: 'interview.selectCandidate', defaultMessage: 'Sélectionner un candidat (optionnel)' })}
                </Label>
                <CustomSelect
                  name="candidateId"
                  control={control}
                  label=""
                  placeholder={intl.formatMessage({ id: 'interview.genericQuestions', defaultMessage: 'Questions génériques' })}
                  items={candidateItems}
                  getKey={(c: any) => c.id}
                  getLabel={(c: any) => `${c.name} (${c.status})`}
                  isDisabled={!watchedOfferId || candidatesLoading}
                  isClearable
                  variant="bordered"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="max-w-xs">
                <Label variant="small" className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {intl.formatMessage({ id: 'interview.numQuestions', defaultMessage: 'Nombre de questions' })}
                </Label>
                <CustomSelect
                  name="numQuestions"
                  control={control}
                  label=""
                  placeholder="10"
                  items={NUM_QUESTIONS_ITEMS}
                  getKey={(item) => item.key}
                  getLabel={(item) => item.label}
                  disallowEmptySelection
                  variant="bordered"
                />
              </div>

              <div className="mt-6">
                <Button
                color="warning"
                  onClick={handleGenerateQuestions}
                  disabled={!watchedOfferId || generating}
                  className="flex items-center gap-2"
                >
                  <MdQuestionAnswer size={20} />
                  {intl.formatMessage({ id: 'interview.generate', defaultMessage: 'Générer les questions' })}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Display */}
        {questionsData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 flex justify-between items-center">
              <div>
                <Label variant="semibold" className="text-xl text-white">
                  {intl.formatMessage({ id: 'interview.questions', defaultMessage: 'Questions d\'entretien' })}
                </Label>
                <Label variant="small" className="opacity-90 text-white mt-1">
                  {questionsData.offer_title}
                  {questionsData.candidate_specific && questionsData.candidate_name && (
                    <> - {questionsData.candidate_name}</>
                  )}
                </Label>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={generating}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30"
              >
                <MdRefresh size={18} />
                {intl.formatMessage({ id: 'interview.refresh', defaultMessage: 'Rafraîchir' })}
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {questionsData.error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <Label variant="default" className="text-red-800 dark:text-red-300">{questionsData.error}</Label>
                </div>
              )}

              {questionsData.interview_structure && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <Label variant="semibold" className="mb-2">
                    {intl.formatMessage({ id: 'interview.structure', defaultMessage: 'Structure suggérée' })}
                  </Label>
                  <Label variant="small" className="text-gray-700 dark:text-gray-300 mt-1">
                    {questionsData.interview_structure}
                  </Label>
                </div>
              )}

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="space-y-6">
                {questionsData.questions.map((question, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full flex items-center justify-center font-semibold">
                        {question.id || index + 1}
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                            {question.category}
                          </span>
                        </div>
                        <Label variant="medium" className="text-base text-gray-900 dark:text-white">
                          {question.question}
                        </Label>
                        {question.follow_up && (
                          <Label variant="small" className="text-gray-600 dark:text-gray-400 italic pl-4 border-l-2 border-gray-300 dark:border-gray-600 mt-1">
                            <strong>{intl.formatMessage({ id: 'interview.followUp', defaultMessage: 'Question de suivi' })}:</strong> {question.follow_up}
                          </Label>
                        )}
                        {question.evaluation_tips && (
                          <Label variant="small" className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">
                            <strong>{intl.formatMessage({ id: 'interview.evaluationTips', defaultMessage: 'Points d\'évaluation' })}:</strong> {question.evaluation_tips}
                          </Label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {questionsData.key_points_to_verify && questionsData.key_points_to_verify.length > 0 && (
                <>
                  <hr className="border-gray-200 dark:border-gray-700 my-4" />
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <Label variant="semibold" className="mb-2">
                      {intl.formatMessage({ id: 'interview.keyPoints', defaultMessage: 'Points clés à vérifier' })}
                    </Label>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {questionsData.key_points_to_verify.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Label variant="muted" className="text-xs text-center pt-4 block">
                {intl.formatMessage({ id: 'interview.poweredBy', defaultMessage: 'Généré par' })} {questionsData.provider} ({questionsData.model})
              </Label>
            </div>
          </div>
        )}

        {generating && (
          <div className="flex justify-center items-center py-12">
            <Loader />
            <Label variant="muted" className="ml-3">
              {intl.formatMessage({ id: 'interview.generating', defaultMessage: 'Génération des questions en cours...' })}
            </Label>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InterviewPage;
