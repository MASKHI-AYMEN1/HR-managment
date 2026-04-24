import React from 'react'
import FormattedText from '@/components/FormattedText'

interface PageTitleProps {
  title: string
  subtitle?: string
  titleId?: string
  subtitleId?: string
  className?: string
}

export default function PageTitle({ 
  title, 
  subtitle, 
  titleId, 
  subtitleId,
  className = '' 
}: PageTitleProps) {
  return (
    <div className={`${className}`}>
      <FormattedText
        id={titleId || 'page.title'}
        defaultMessage={title}
        variant="title"
        className='text-yellow-500'
      />
      {subtitle && (
        <FormattedText
          id={subtitleId || 'page.subtitle'}
          defaultMessage={subtitle}
          variant="subtitle"
          className='text-yellow-700'
        />
      )}
    </div>
  )
}
