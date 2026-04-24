import { FiSearch, FiMapPin } from 'react-icons/fi'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Typography from '@/components/Typographie'

export function Hero() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()
  const intl = useIntl()

  const popularTerms = [
    intl.formatMessage({ id: 'hero.term.dev' }),
    intl.formatMessage({ id: 'hero.term.marketing' }),
    intl.formatMessage({ id: 'hero.term.design' }),
    intl.formatMessage({ id: 'hero.term.sales' }),
    intl.formatMessage({ id: 'hero.term.data' }),
  ]

  const handleSearch = () => {
    router.push(`/offers?search=${encodeURIComponent(search)}`)
  }

  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Typography
            variant="h1"
            weight="bold"
            className="text-gray-900 dark:text-white mb-6 leading-tight"
          >
            {intl.formatMessage({ id: 'hero.title' })}{' '}
            <span className="text-yellow-500">{intl.formatMessage({ id: 'hero.titleHighlight' })}</span>
          </Typography>
          <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
            {intl.formatMessage({ id: 'hero.subtitle' })}
          </Typography>
        </div>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiSearch className="text-yellow-500 shrink-0" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={intl.formatMessage({ id: 'hero.searchPlaceholder' })}
                className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 text-sm"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FiMapPin className="text-yellow-500 shrink-0" size={18} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={intl.formatMessage({ id: 'hero.locationPlaceholder' })}
                className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg"
            >
              {intl.formatMessage({ id: 'hero.searchButton' })}
            </button>
          </div>
        </div>

        {/* Popular searches */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="self-center">{intl.formatMessage({ id: 'hero.popularSearches' })}</span>
          {popularTerms.map((term) => (
            <button
              key={term}
              onClick={() => { setSearch(term); router.push(`/offers?search=${encodeURIComponent(term)}`) }}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}