import React from 'react'
import PageTitle from '@/components/PageTitle'
import { useIntl } from 'react-intl'
import PublicLayout from '@/layouts/PublicLayout'

const CompanyPage = () => {
  const intl = useIntl()
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <PageTitle title={intl.formatMessage({ id: 'company.title', defaultMessage: 'À propos de nous' })} />
        <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {intl.formatMessage({
            id: 'company.description',
            defaultMessage:
              'Nous sommes une entreprise leader dans la gestion des ressources humaines, offrant des solutions innovantes pour connecter les talents aux opportunités. Notre mission est de simplifier le recrutement et de rendre l\'embauche transparente et efficace pour les employeurs et les candidats.',
          })}
        </p>
      </div>
    </PublicLayout>
  )
}

export default CompanyPage
