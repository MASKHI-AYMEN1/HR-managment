import React, { ReactNode } from 'react'

interface LabelProps {
  children: ReactNode
  variant?: 'default' | 'muted' | 'semibold' | 'bold' | 'small' | 'large' | 'title' | 'subtitle' | 'medium'
  className?: string
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const variantStyles = {
  default: 'text-black dark:text-white',
  muted: 'text-gray-600 dark:text-gray-400',
  semibold: 'text-black dark:text-white font-semibold',
  bold: 'text-black dark:text-white font-bold',
  medium: 'text-black dark:text-white font-medium',
  small: 'text-sm text-black dark:text-white',
  large: 'text-lg text-black dark:text-white',
  title: 'text-2xl font-bold text-black dark:text-white',
  subtitle: 'text-gray-600 dark:text-gray-400 mt-1',
}

export default function Label({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
}: LabelProps) {
  const combinedClassName = `${variantStyles[variant]} ${className}`.trim()

  return <Component className={combinedClassName}>{children}</Component>
}
