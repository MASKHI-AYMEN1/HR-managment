import React from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { FiBriefcase, FiDollarSign, FiAward, FiLayers, FiCalendar, FiFileText, FiClock } from 'react-icons/fi'
import useOffersApi from '@/services/offers/useOffersApi'
import PublicLayout from '@/layouts/PublicLayout'
import PageTitle from '@/components/PageTitle'
import Typography from '@/components/Typographie'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import { processHtmlContent } from '@/common/utils/html.utils'

export default function OfferDetailPage() {
  const intl = useIntl()
  const router = useRouter()
  const { id } = router.query
  const { useGetOffer } = useOffersApi()
  const { data: offer, isLoading } = useGetOffer(id as string)

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      </PublicLayout>
    )
  }

  if (!offer) {
    return (
      <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Typography className="text-xl font-semibold text-gray-500">
          {intl.formatMessage({ id: 'offer.notFound', defaultMessage: 'Offer not found' })}
        </Typography>
        <Button onClick={() => router.push('/offers')} color="warning">
          {intl.formatMessage({ id: 'button.back', defaultMessage: 'Back' })}
        </Button>
      </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
    <div className="max-w-3xl mx-auto px-4 py-10 min-w-0">
      {/* Back */}
      <div className="mb-6">
        <Button onClick={() => router.push('/offers')} color="default" variant="bordered">
          ← {intl.formatMessage({ id: 'button.back', defaultMessage: 'Back' })}
        </Button>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        {/* Image */}
        {offer.image && (
          <div className="mb-6">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        )}
        
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <PageTitle title={offer.title} />
            {offer.dateCreation && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <FiClock className="w-4 h-4" />
                <span>
                  {intl.formatMessage({ id: 'offer.postedOn', defaultMessage: 'Posted on' })}{' '}
                  {new Date(offer.dateCreation).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          {offer.isClosed && (
            <span className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-medium">
              {intl.formatMessage({ id: 'offer.closedBadge', defaultMessage: 'Offer closed' })}
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {(Array.isArray(offer.typeContrat) ? offer.typeContrat.length : !!offer.typeContrat) && (
            <InfoItem
              icon={<FiBriefcase className="w-5 h-5" />}
              label={intl.formatMessage({ id: 'offer.contract', defaultMessage: 'Type of contract' })}
              value={(Array.isArray(offer.typeContrat) ? offer.typeContrat : [offer.typeContrat]).filter(Boolean).join(', ')}
              color="blue"
            />
          )}
          {offer.salary != null && (
            <InfoItem
              icon={<FiDollarSign className="w-5 h-5" />}
              label={intl.formatMessage({ id: 'offer.salaryLabel', defaultMessage: 'Salary' })}
              value={`${offer.salary} TND`}
              color="green"
            />
          )}
          {offer.niveau && (
            <InfoItem
              icon={<FiAward className="w-5 h-5" />}
              label={intl.formatMessage({ id: 'offer.niveauLabel', defaultMessage: 'Required level' })}
              value={offer.niveau}
              color="purple"
            />
          )}
          {offer.experienceDomain && (
            <InfoItem
              icon={<FiLayers className="w-5 h-5" />}
              label={intl.formatMessage({ id: 'offer.domainLabel', defaultMessage: 'Experience domain' })}
              value={offer.experienceDomain}
              color="orange"
            />
          )}
          {offer.dateDeadline && (
            <InfoItem
              icon={<FiCalendar className="w-5 h-5" />}
              label={intl.formatMessage({ id: 'offer.deadline', defaultMessage: 'Deadline' })}
              value={new Date(offer.dateDeadline).toLocaleDateString()}
              color="red"
            />
          )}
        </div>
      </div>

      {/* Description */}
      {offer.description && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 overflow-x-hidden min-w-0 break-words">
          <div className="flex items-center gap-2 mb-4">
            <FiFileText className="w-5 h-5 text-yellow-500" />
            <Typography className="font-semibold text-lg">
              {intl.formatMessage({ id: 'offer.description', defaultMessage: 'Description' })}
            </Typography>
          </div>
          <div 
            className="wysiwyg-content"
            dangerouslySetInnerHTML={{ __html: processHtmlContent(offer.description) }}
          />
        </div>
      )}

      {/* Apply button */}
      {!offer.isClosed && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 text-center">
          <Typography className="text-xl font-semibold mb-4">
            {intl.formatMessage({ id: 'offer.interested', defaultMessage: 'Interested in this position?' })}
          </Typography>
          <Link href={`/offers/${id}/postuler`}>
            <Button color="warning" className="text-base px-10 py-3 shadow-lg hover:shadow-xl transition-shadow">
              {intl.formatMessage({ id: 'offer.apply', defaultMessage: 'Apply for this offer' })}
            </Button>
          </Link>
        </div>
      )}
    </div>
    </PublicLayout>
  )
}

type InfoItemProps = {
  icon: React.ReactNode
  label: string
  value: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

function InfoItem({ icon, label, value, color = 'blue' }: InfoItemProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white text-base truncate">{value}</p>
      </div>
    </div>
  )
}
