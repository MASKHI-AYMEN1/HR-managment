export function formatDate(dateString: string) {
  const formattedDate = new Date(dateString).toLocaleDateString(undefined)

  return formattedDate
}

function getTimeInMilliseconds(date: Date | number | string): number {
  // Check if the input date is a string

  if (typeof date === 'string') {
    // If it's a string, convert it to a Date object and get the time in milliseconds
    const parsedDate = new Date(date)

    return parsedDate.getTime()
  }

  if (typeof date === 'number') {
    return date
  }

  // If the input date is a Date object, get the time in milliseconds
  return date.getTime()
}

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 * @param date - The date to convert to a relative time string
 * @param lang - The language to use for the relative time string
 * @returns A relative time string
 * @see https://www.builder.io/blog/relative-time
 */
export function getRelativeTimeString(
  date: Date | number | string,
  lang: string = 'en-US'
): string {
  // Allow dates or times to be passed
  const timeMs = getTimeInMilliseconds(date)

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ]

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ]

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  )

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })

  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

export function getFormatTimeString(dateToFormat: Date | string, locale: string = 'fr') {
  const date = new Date(dateToFormat)
  // Use Intl.DateTimeFormat for instant locale switching
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Intl.DateTimeFormat(locale, options).format(date)
}
