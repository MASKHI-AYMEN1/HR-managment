import React, { useState } from 'react'
import Link from 'next/link'
import PublicLayout from '@/layouts/PublicLayout'
import { useIntl } from 'react-intl'
import { FiBookOpen, FiTrendingUp, FiFileText, FiUsers, FiStar, FiChevronDown, FiChevronUp, FiArrowRight } from 'react-icons/fi'

// ─── Article data ───────────────────────────────────────────────────
const ARTICLES = [
  {
    category: 'CV & Lettre',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    icon: FiFileText,
    title: 'Comment rédiger un CV qui attire l\'attention des recruteurs',
    excerpt: 'Les 5 erreurs à éviter et les meilleures pratiques pour structurer un CV percutant en 2026.',
    readTime: '5 min',
    date: 'Mars 2026',
  },
  {
    category: 'Entretien',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    icon: FiUsers,
    title: 'Bien préparer son entretien d\'embauche',
    excerpt: 'De la recherche sur l\'entreprise à la gestion du stress, suivez notre guide complet pour réussir vos entretiens.',
    readTime: '7 min',
    date: 'Mars 2026',
  },
  {
    category: 'Carrière',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    icon: FiTrendingUp,
    title: 'Comment négocier son salaire avec confiance',
    excerpt: 'Techniques et arguments pour obtenir la rémunération que vous méritez lors de votre prochain recrutement.',
    readTime: '6 min',
    date: 'Fév 2026',
  },
  {
    category: 'Développement',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    icon: FiBookOpen,
    title: 'Les compétences les plus recherchées en 2026',
    excerpt: 'IA, gestion de projet, communication interculturelle : découvrez les skills qui font la différence sur le marché.',
    readTime: '4 min',
    date: 'Fév 2026',
  },
  {
    category: 'CV & Lettre',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    icon: FiFileText,
    title: 'Lettre de motivation : les formules à bannir',
    excerpt: 'Évitez les clichés et démarquez-vous avec une lettre authentique et ciblée qui donne envie de vous rencontrer.',
    readTime: '3 min',
    date: 'Jan 2026',
  },
  {
    category: 'Entretien',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    icon: FiUsers,
    title: 'Questions pièges en entretien et comment y répondre',
    excerpt: '« Quels sont vos défauts ? », « Pourquoi vous ? » — les réponses qui font bonne impression selon les recruteurs.',
    readTime: '8 min',
    date: 'Jan 2026',
  },
]

// ─── FAQ data ───────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Combien de temps doit durer mon CV ?',
    a: 'En général, 1 page pour les profils juniors (moins de 5 ans d\'expérience) et 2 pages maximum pour les profils seniors. L\'essentiel est la pertinence : chaque ligne doit apporter de la valeur.',
  },
  {
    q: 'Dois-je mettre une photo sur mon CV ?',
    a: 'En Tunisie et dans les pays francophones, la photo est encore courante. Choisissez un fond neutre, une tenue professionnelle et un cadrage correct. Évitez les selfies.',
  },
  {
    q: 'Comment me préparer à un entretien à distance ?',
    a: 'Testez votre connexion et votre caméra en amont. Choisissez un fond neutre et un espace calme. Habillez-vous comme pour un entretien physique. Regardez la caméra, pas l\'écran.',
  },
  {
    q: 'Quand relancer après un entretien ?',
    a: 'Attendez 5 à 7 jours ouvrés. Envoyez un email court et poli pour témoigner de votre intérêt continu. Évitez de relancer plusieurs fois de suite.',
  },
  {
    q: 'Faut-il personnaliser sa lettre de motivation pour chaque offre ?',
    a: 'Oui, absolument. Un recruteur repère immédiatement une lettre générique. Citez le nom de l\'entreprise, le poste exact et expliquez pourquoi VOUS correspondez à CETTE offre.',
  },
]

// ─── Tips strip ─────────────────────────────────────────────────────
const QUICK_TIPS = [
  { icon: '🎯', tip: 'Adaptez votre CV à chaque offre en reprenant les mots-clés de l\'annonce.' },
  { icon: '🤝', tip: 'Soignez votre profil LinkedIn : 70 % des recruteurs le consultent avant un entretien.' },
  { icon: '📧', tip: 'Après chaque entretien, envoyez un email de remerciement dans les 24 h.' },
  { icon: '🔍', tip: 'Renseignez-vous sur l\'entreprise : son activité, ses valeurs et ses actualités récentes.' },
  { icon: '💡', tip: 'Préparez 3 exemples STAR (Situation, Tâche, Action, Résultat) pour valoriser vos expériences.' },
]

// ─── Component ──────────────────────────────────────────────────────
export default function ConseilsCarrierePage() {
  const intl = useIntl()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous')

  const categories = ['Tous', 'CV & Lettre', 'Entretien', 'Carrière', 'Développement']
  const filtered = categoryFilter === 'Tous' ? ARTICLES : ARTICLES.filter((a) => a.category === categoryFilter)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {intl.formatMessage({ id: 'career.badge', defaultMessage: 'Conseils carrière' })}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {intl.formatMessage({ id: 'career.hero.title', defaultMessage: 'Boostez votre carrière' })}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            {intl.formatMessage({
              id: 'career.hero.subtitle',
              defaultMessage:
                'Conseils pratiques, guides et astuces pour optimiser votre CV, réussir vos entretiens et progresser dans votre vie professionnelle.',
            })}
          </p>
        </div>
      </section>

      {/* Quick Tips Strip */}
      <section className="bg-yellow-500 py-5 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-8 min-w-max">
          {QUICK_TIPS.map(({ icon, tip }, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-xl">{icon}</span>
              <p className="text-gray-900 text-xs font-medium max-w-[220px]">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'career.articles.title', defaultMessage: 'Nos derniers articles' })}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {intl.formatMessage({ id: 'career.articles.subtitle', defaultMessage: 'Conseils rédigés par nos experts RH' })}
            </p>
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                  categoryFilter === cat
                    ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-yellow-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => {
            const Icon = article.icon
            return (
              <article
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${article.color}`}>
                    <Icon size={11} />
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, s) => <FiStar key={s} size={10} fill="currentColor" />)}
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2 group-hover:text-yellow-500 transition">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{article.date} · {article.readTime} de lecture</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                    Lire <FiArrowRight size={12} />
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Steps guide */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16 px-4 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {intl.formatMessage({ id: 'career.guide.title', defaultMessage: 'De la candidature à l\'embauche' })}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {intl.formatMessage({ id: 'career.guide.subtitle', defaultMessage: 'Les 4 étapes clés pour décrocher votre prochain emploi' })}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Recherche', desc: 'Explorez les offres, filtrez par domaine, salaire et localisation.' },
              { step: '02', icon: '📝', title: 'Candidature', desc: 'Préparez un CV ciblé et une lettre de motivation authentique.' },
              { step: '03', icon: '🤝', title: 'Entretien', desc: 'Préparez-vous, renseignez-vous sur l\'entreprise et restez vous-même.' },
              { step: '04', icon: '🎉', title: 'Embauche', desc: 'Recevez votre offre, négociez et lancez votre nouvelle aventure.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {step}
                </div>
                <div className="text-3xl my-4">{icon}</div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {intl.formatMessage({ id: 'career.faq.title', defaultMessage: 'Questions fréquentes' })}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{q}</span>
                {openFaq === i
                  ? <FiChevronUp className="text-yellow-500 shrink-0" size={18} />
                  : <FiChevronDown className="text-gray-400 shrink-0" size={18} />
                }
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-yellow-500 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center text-gray-900">
          <h2 className="text-2xl font-extrabold mb-3">
            {intl.formatMessage({ id: 'career.cta.title', defaultMessage: 'Prêt à trouver votre prochain emploi ?' })}
          </h2>
          <p className="text-sm mb-6 opacity-80">
            {intl.formatMessage({ id: 'career.cta.subtitle', defaultMessage: 'Consultez nos offres en cours et postulez dès maintenant.' })}
          </p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition text-sm"
          >
            {intl.formatMessage({ id: 'career.cta.button', defaultMessage: 'Voir les offres d\'emploi' })}
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
