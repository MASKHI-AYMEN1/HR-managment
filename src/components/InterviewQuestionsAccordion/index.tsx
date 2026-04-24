import React from 'react'
import CustomAccordion from '@/components/Accordion'
import { GeneratedQuestionsResponse } from '@/services/interview-evaluation/useInterviewEvaluationApi'

interface InterviewQuestionsAccordionProps {
  generatedQuestions: GeneratedQuestionsResponse
  questionCount?: number
}

const InterviewQuestionsAccordion: React.FC<InterviewQuestionsAccordionProps> = ({
  generatedQuestions,
  questionCount,
}) => {
  const renderQuestionsList = () => {
    if (generatedQuestions.error) {
      return (
        <div className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
          <p className="text-danger-600 dark:text-danger-400 text-sm">
            {generatedQuestions.error}
          </p>
          {generatedQuestions.note && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {generatedQuestions.note}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Interview Structure */}
        {generatedQuestions.interview_structure && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              📝 Structure recommandée
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {generatedQuestions.interview_structure}
            </p>
          </div>
        )}

        {/* Key Technical Areas (for technique interviews) */}
        {generatedQuestions.key_technical_areas && generatedQuestions.key_technical_areas.length > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
              🎯 Domaines techniques à couvrir
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {generatedQuestions.key_technical_areas.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Decision Framework (for manager interviews) */}
        {generatedQuestions.decision_framework && generatedQuestions.decision_framework.length > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
              🎯 Critères de décision
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {generatedQuestions.decision_framework.map((criterion, i) => (
                <li key={i}>{criterion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Points (for RH interviews) */}
        {generatedQuestions.key_points && generatedQuestions.key_points.length > 0 && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">
              🔑 Points clés à évaluer
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {generatedQuestions.key_points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Red Flags */}
        {generatedQuestions.red_flags && generatedQuestions.red_flags.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
              ⚠️ Signaux d'alerte à surveiller
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {generatedQuestions.red_flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-3">
          {generatedQuestions.questions.map((q, index) => (
            <div
              key={q.id || index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full mb-2">
                    {q.category}
                  </span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {q.question}
                  </p>
                  {q.follow_up && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">↪ Follow-up: </span>
                      {q.follow_up}
                    </p>
                  )}
                  {q.evaluation_tips && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      <span className="font-medium">💡 Conseil: </span>
                      {q.evaluation_tips}
                    </p>
                  )}
                  {q.expected_concepts && q.expected_concepts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Concepts attendus:</span>
                      {q.expected_concepts.map((concept, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.decision_criteria && (
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      <span className="font-medium">⚖️ Impact décision: </span>
                      {q.decision_criteria}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const accordionItems = [
    {
      key: 'questions',
      title: (
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            📋 Questions générées ({questionCount || generatedQuestions.questions.length})
          </span>
          {generatedQuestions.error && (
            <span className="text-xs text-danger-500">❌ Erreur</span>
          )}
        </div>
      ),
      content: renderQuestionsList(),
    },
  ]

  return <CustomAccordion items={accordionItems} variant="bordered" />
}

export default InterviewQuestionsAccordion
