import React from 'react'
import { FormattedDate } from 'react-intl'

export interface CustomFormattedDateProps {
  value: string | number | Date
  options?: Intl.DateTimeFormatOptions
  className?: string
}

const defaultOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
}

export default function CustomFormattedDate({ value, options = defaultOptions, className }: CustomFormattedDateProps) {
  const dateProps: any = {}
  if (options.weekday) dateProps.weekday = options.weekday
  if (options.day) dateProps.day = options.day
  if (options.month) dateProps.month = options.month
  if (options.year) dateProps.year = options.year
  if (options.hour) dateProps.hour = options.hour
  if (options.minute) dateProps.minute = options.minute
  if (options.second) dateProps.second = options.second

  return (
    <span className={className}>
      <FormattedDate value={value} {...dateProps} />
    </span>
  )
}
