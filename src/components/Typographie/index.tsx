import React from 'react'

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'small'
  | 'label'

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant
  as?: React.ElementType
  color?: string
  weight?:
    | 'thin'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | string
  align?: 'left' | 'center' | 'right' | 'justify'
}

const sizeMap: Record<Variant, string> = {
  h1: 'text-4xl md:text-5xl',
  h2: 'text-3xl md:text-4xl',
  h3: 'text-2xl md:text-3xl',
  h4: 'text-xl md:text-2xl',
  h5: 'text-lg',
  h6: 'text-base',
  p: 'text-base',
  span: 'text-base',
  small: 'text-sm',
  label: 'text-xs',
}

const weightMap: Record<string, string> = {
  thin: 'font-thin',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

const isTailwindTextClass = (s?: string) => typeof s === 'string' && s.startsWith('text-')

export default function Typography({
  variant = 'p',
  as,
  color,
  weight,
  align,
  className,
  style,
  children,
  ...rest
}: TypographyProps) {
  const Tag: React.ElementType = as || (variant as any) || 'p'
  const sizeClass = sizeMap[variant] || ''
  const weightClass = weight ? weightMap[weight] || weight : ''
  const alignClass = align ? `text-${align}` : ''
    const defaultColor = 'text-black dark:text-white'
    const colorValue = (color ?? defaultColor).toString().trim()
    const colorClass = isTailwindTextClass(colorValue) ? colorValue : ''
    const inlineColorStyle = colorValue && !isTailwindTextClass(colorValue) ? { color: colorValue } : undefined

  const classes = [sizeClass, weightClass, alignClass, colorClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes || undefined} style={{ ...style, ...inlineColorStyle }} {...rest}>
      {children}
    </Tag>
  )
}
