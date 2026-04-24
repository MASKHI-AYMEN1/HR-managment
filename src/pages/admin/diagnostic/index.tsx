import React, { useMemo, useState } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import PageTitle from '@/components/PageTitle'
import { useIntl } from 'react-intl'
import useCandidatureApi, {
  DiagnosticCompareCriteria,
  DiagnosticCompareRow,
  LLMCompareResponse,
} from '@/services/candidature/useCandidatureApi'
import Button from '@/components/Button'

const CRITERIA_OPTIONS: Array<{ key: DiagnosticCompareCriteria; label: string }> = [
  { key: 'offer', label: 'Score offre' },
  { key: 'profile', label: 'Profil' },
  { key: 'skills', label: 'Skills' },
  { key: 'formation', label: 'Formation' },
  { key: 'experience', label: 'Experience' },
  { key: 'languages', label: 'Langues' },
  { key: 'certifications', label: 'Certifications' },
]

const CRITERIA_LABELS: Record<string, string> = {
  offer: 'Offre',
  profile: 'Profil',
  skills: 'Skills',
  formation: 'Formation',
  experience: 'Experience',
  languages: 'Langues',
  certifications: 'Certifications',
}

function DiagnosticPage() {
  const intl = useIntl()
  const { useDiagnosticOffers, useDiagnosticCandidatures, useDiagnosticCompare, useDiagnosticCompareLLM } = useCandidatureApi()

  const [selectedOfferId, setSelectedOfferId] = useState('')
  const [selectedCandidatureIds, setSelectedCandidatureIds] = useState<string[]>([])
  const [selectedCriteria, setSelectedCriteria] = useState<DiagnosticCompareCriteria[]>([
    'offer',
    'profile',
    'skills',
    'formation',
    'experience',
  ])

  const [results, setResults] = useState<DiagnosticCompareRow[]>([])
  const [llmResults, setLlmResults] = useState<LLMCompareResponse | null>(null)
  const [comparisonMode, setComparisonMode] = useState<'manual' | 'ai' | null>(null)

  const { data: offers = [], isLoading: loadingOffers } = useDiagnosticOffers()
  const { data: candidatures = [], isLoading: loadingCandidatures } = useDiagnosticCandidatures(selectedOfferId || undefined)
  const compareMutation = useDiagnosticCompare()
  const compareLLMMutation = useDiagnosticCompareLLM()

  const canCompare = selectedOfferId && selectedCandidatureIds.length > 0 && selectedCriteria.length > 0

  const selectedOfferTitle = useMemo(
    () => offers.find((o) => o.id === selectedOfferId)?.title || '',
    [offers, selectedOfferId],
  )

  const toggleCandidature = (id: string) => {
    setSelectedCandidatureIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleCriteria = (key: DiagnosticCompareCriteria) => {
    setSelectedCriteria((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const handleOfferChange = (offerId: string) => {
    setSelectedOfferId(offerId)
    setSelectedCandidatureIds([])
    setResults([])
    setLlmResults(null)
    setComparisonMode(null)
  }

  const handleCompareManual = () => {
    if (!canCompare) return
    compareMutation.mutate(
      {
        offerId: selectedOfferId,
        candidatureIds: selectedCandidatureIds,
        criteria: selectedCriteria,
      },
      {
        onSuccess: (data) => {
          setResults(data.results || [])
          setLlmResults(null)
          setComparisonMode('manual')
        },
      },
    )
  }

  const handleCompareAI = () => {
    if (!canCompare) return
    compareLLMMutation.mutate(
      {
        offerId: selectedOfferId,
        candidatureIds: selectedCandidatureIds,
        criteria: selectedCriteria,
      },
      {
        onSuccess: (data) => {
          setLlmResults(data)
          setResults([])
          setComparisonMode('ai')
        },
      },
    )
  }

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <PageTitle
          title={intl.formatMessage({
            id: 'diagnostic.title',
            defaultMessage: 'Diagnostic candidatures',
          })}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white">
            {intl.formatMessage({ id: 'diagnostic.offer', defaultMessage: 'Offre' })}
          </label>
          <select
            value={selectedOfferId}
            onChange={(e) => handleOfferChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="">{loadingOffers ? 'Chargement...' : 'Sélectionner une offre'}</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white">
            {intl.formatMessage({ id: 'diagnostic.candidatures', defaultMessage: 'Candidatures à comparer' })}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            {!selectedOfferId && <p className="text-sm text-gray-500">Choisir une offre d'abord.</p>}
            {selectedOfferId && loadingCandidatures && <p className="text-sm text-gray-500">Chargement...</p>}
            {selectedOfferId && !loadingCandidatures && candidatures.length === 0 && (
              <p className="text-sm text-gray-500">Aucune candidature trouvée.</p>
            )}
            {candidatures.map((c) => (
              <label key={c.id} className="flex items-start gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={selectedCandidatureIds.includes(c.id)}
                  onChange={() => toggleCandidature(c.id)}
                  className="mt-1"
                />
                <span>
                  <strong>{c.fullName}</strong>
                  {c.email ? ` · ${c.email}` : ''}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white">
            {intl.formatMessage({ id: 'diagnostic.criteria', defaultMessage: 'Critères de comparaison' })}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CRITERIA_OPTIONS.map((criteria) => (
              <label key={criteria.key} className="flex items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={selectedCriteria.includes(criteria.key)}
                  onChange={() => toggleCriteria(criteria.key)}
                />
                {criteria.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            color="warning"
            onClick={handleCompareManual}
            disabled={!canCompare || compareMutation.isPending}
          >
            {compareMutation.isPending
              ? '⏳ Comparaison...'
              : '📊 Comparaison Manuelle'}
          </Button>
          <Button
            color="success"
            onClick={handleCompareAI}
            disabled={!canCompare || compareLLMMutation.isPending}
          >
            {compareLLMMutation.isPending
              ? '🤖 Analyse IA...'
              : '✨ Comparaison avec IA'}
          </Button>
        </div>
      </div>

      {/* Manual Comparison Results */}
      {comparisonMode === 'manual' && results.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              📊 Résultats - Comparaison Manuelle
              {selectedOfferTitle ? ` · ${selectedOfferTitle}` : ''}
            </h3>
          </div>
          <table className="w-full text-sm min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-black dark:text-white">
                <th className="py-2 pr-3">Candidat</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Offre</th>
                <th className="py-2 pr-3">Profil</th>
                <th className="py-2 pr-3">Skills</th>
                <th className="py-2 pr-3">Formation</th>
                <th className="py-2 pr-3">Experience</th>
                <th className="py-2 pr-3">Langues</th>
                <th className="py-2 pr-3">Certifs</th>
                <th className="py-2 pr-3">Total /100</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <React.Fragment key={row.candidatureId}>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-black dark:text-white">
                    <td className="py-2 pr-3 font-medium">{row.fullName}</td>
                    <td className="py-2 pr-3">{row.email || '—'}</td>
                    <td className="py-2 pr-3">{row.scoreOffer}</td>
                    <td className="py-2 pr-3">{row.scoreProfile}</td>
                    <td className="py-2 pr-3">{row.scoreSkills}</td>
                    <td className="py-2 pr-3">{row.scoreFormation}</td>
                    <td className="py-2 pr-3">{row.scoreExperience}</td>
                    <td className="py-2 pr-3">{row.scoreLanguages}</td>
                    <td className="py-2 pr-3">{row.scoreCertifications}</td>
                    <td className="py-2 pr-3 font-semibold">{row.totalScore}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40">
                    <td colSpan={10} className="py-3 px-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {row.criteriaDetails
                          .filter((detail) => selectedCriteria.includes(detail.key as DiagnosticCompareCriteria))
                          .map((detail) => (
                            <div key={`${row.candidatureId}-${detail.key}`} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-black dark:text-white">
                                  {CRITERIA_LABELS[detail.key] || detail.key}
                                </p>
                                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                                  {detail.score} / 100
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words max-h-36 overflow-auto">
                                {detail.content || 'Aucun contenu extrait du CV pour ce critère.'}
                              </p>
                            </div>
                          ))}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Comparison Results */}
      {comparisonMode === 'ai' && llmResults && (
        <div className="space-y-6">
          {/* Ranking Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-green-200 dark:border-green-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Classement IA - {llmResults.offer.title}
              </h3>
            </div>
            <div className="space-y-3">
              {llmResults.ranking.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    index === 0
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
                      : index === 1
                      ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600'
                      : index === 2
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-400 dark:border-orange-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 font-bold text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${item.position}`}
                    </div>
                    <div>
                      <p className="font-semibold text-black dark:text-white">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{item.score}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">/ 100</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h3 className="text-xl font-bold text-black dark:text-white">Analyse Détaillée</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(llmResults.detailed_analysis).map(([name, analysis]) => (
                <div key={name} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-black dark:text-white">{name}</h4>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      Score: {analysis.fit_score}/100
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">{analysis.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <span>✅</span> Points Forts
                      </p>
                      <ul className="space-y-1">
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-green-700 dark:text-green-400">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <p className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                        <span>⚠️</span> Points Faibles
                      </p>
                      <ul className="space-y-1">
                        {analysis.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-orange-700 dark:text-orange-400">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison & Recommendation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚖️</span>
                <h3 className="text-xl font-bold text-black dark:text-white">Comparaison</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{llmResults.comparison}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-bold text-black dark:text-white">Recommandation</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium">{llmResults.recommendation}</p>
            </div>
          </div>

          {/* Model Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Propulsé par {llmResults.provider} - Modèle: {llmResults.model}
          </div>
        </div>
      )}
    </div>
  )
}

DiagnosticPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default DiagnosticPage
