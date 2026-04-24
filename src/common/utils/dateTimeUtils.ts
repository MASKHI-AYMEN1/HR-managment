/**
 * Utility functions for handling datetime conversions between local time and ISO format
 * Fixes timezone offset issues when working with datetime-local inputs
 */

/**
 * Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
 * Preserves the local time by using local timezone methods
 * 
 * @param isoString - ISO 8601 date string (e.g., "2024-04-05T12:30:00.000Z")
 * @returns datetime-local format string (e.g., "2024-04-05T12:30")
 */
export const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Convert datetime-local format to ISO string
 * Preserves the local time when converting to ISO format
 * 
 * @param dateTimeLocal - datetime-local format string (e.g., "2024-04-05T12:30")
 * @returns ISO 8601 date string (e.g., "2024-04-05T12:30:00.000Z")
 */
export const dateTimeLocalToISO = (dateTimeLocal: string): string => {
  // datetime-local format: "2024-04-05T12:30"
  // Create a Date object that represents this exact time in local timezone
  const date = new Date(dateTimeLocal)
  return date.toISOString()
}

/**
 * Format a date for display in the user's locale
 * 
 * @param isoString - ISO 8601 date string
 * @param locale - Optional locale string (defaults to 'fr-FR')
 * @returns Formatted date string
 */
export const formatDisplayDate = (
  isoString: string,
  locale: string = 'fr-FR'
): string => {
  const date = new Date(isoString)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date for short display (date only)
 * 
 * @param isoString - ISO 8601 date string
 * @param locale - Optional locale string (defaults to 'fr-FR')
 * @returns Formatted date string (date only)
 */
export const formatDisplayDateShort = (
  isoString: string,
  locale: string = 'fr-FR'
): string => {
  const date = new Date(isoString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format a time for display
 * 
 * @param isoString - ISO 8601 date string
 * @param locale - Optional locale string (defaults to 'fr-FR')
 * @returns Formatted time string
 */
export const formatDisplayTime = (
  isoString: string,
  locale: string = 'fr-FR'
): string => {
  const date = new Date(isoString)
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}
