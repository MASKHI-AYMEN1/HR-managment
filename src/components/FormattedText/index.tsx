import React from 'react'
import { FormattedMessage } from 'react-intl'

interface FormattedTextProps {
  id: string
  defaultMessage: string
  values?: Record<string, any>
  variant?: 'default' | 'muted' | 'semibold' | 'bold' | 'small' | 'large' | 'title' | 'subtitle'
  className?: string
}

const variantStyles = {
  default: 'text-black dark:text-white',
  muted: 'text-gray-600 dark:text-gray-400',
  semibold: 'text-black dark:text-white font-semibold',
  bold: 'text-black dark:text-white font-bold',
  small: 'text-sm text-black dark:text-white',
  large: 'text-lg text-black dark:text-white',
  title: 'text-2xl font-bold text-black dark:text-white',
  subtitle: 'text-gray-600 dark:text-gray-400 mt-1',
}

export default function FormattedText({
  id,
  defaultMessage,
  values,
  variant = 'default',
  className = '',
}: FormattedTextProps) {
  const combinedClassName = `${variantStyles[variant]} ${className}`.trim()

  return (
    <div className={combinedClassName}>
      <FormattedMessage id={id} defaultMessage={defaultMessage} values={values} />
    </div>
  )
}
