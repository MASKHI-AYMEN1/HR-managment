import { FiCode, FiTrendingUp, FiPenTool, FiVolume2, FiDatabase, FiUsers } from 'react-icons/fi'
import Typography from '@/components/Typographie'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

const CATEGORY_META = [
  { key: 'dev',       icon: FiCode,       count: 245, color: 'bg-yellow-50 text-yellow-600' },
  { key: 'finance',   icon: FiTrendingUp, count: 132, color: 'bg-green-50 text-green-600' },
  { key: 'design',    icon: FiPenTool,    count: 89,  color: 'bg-pink-50 text-pink-600' },
  { key: 'marketing', icon: FiVolume2,    count: 167, color: 'bg-orange-50 text-orange-600' },
  { key: 'data',      icon: FiDatabase,   count: 94,  color: 'bg-purple-50 text-purple-600' },
  { key: 'hr',        icon: FiUsers,      count: 76,  color: 'bg-teal-50 text-teal-600' },
]

export function Categories() {
  const router = useRouter()
  const intl = useIntl()

  const categories = CATEGORY_META.map((c) => ({
    ...c,
    name: intl.formatMessage({ id: `categories.${c.key}` }),
  }))

  return (
    <section id="categories" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Typography variant="h2" weight="bold" className="text-gray-900 dark:text-white mb-4">
            {intl.formatMessage({ id: 'categories.title' })}
          </Typography>
          <Typography variant="p" className="text-gray-500 dark:text-gray-400 text-lg">
            {intl.formatMessage({ id: 'categories.subtitle' })}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.key}
                onClick={() => router.push(`/offers?search=${encodeURIComponent(category.name)}`)}
                className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-yellow-500 hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${category.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <Typography variant="h6" weight="semibold" className="text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </Typography>
                    <Typography variant="p" className="text-gray-500 dark:text-gray-400 text-sm">
                      {intl.formatMessage({ id: 'categories.offersCount' }, { count: category.count })}
                    </Typography>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}