function booleanToStringOrDefault(
  value: boolean | undefined | null,
  defaultValue: string = 'N/A'
) {
  const isNullOrUndefined = value === undefined || value === null
  if (isNullOrUndefined) {
    return defaultValue
  }

  return value.toString()
}

function getStringOrDefault(
  input: string | null | undefined,
  defaultValue: string = 'N/A'
) {
  if (input === null || input === undefined || input === '') {
    return defaultValue
  }

  return input
}

function truncateString(str: string = '', maxLength: number = 100) {
  const maxDesiredlength = Math.max(0, maxLength)
  const validMaxLength = Math.min(maxDesiredlength, str.length)

  return str.length > validMaxLength
    ? `${str.slice(0, validMaxLength)} ... `
    : str
}

function getInitials(name: string | null | undefined): string {
  if (!name) {
    return '' // Return an empty string if the input is null or undefined
  }

  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function getDomainFromEmail(email: string | null | undefined): string {
  if (!email) {
    return ''
  }

  const match = email.match(/@([^.]+)\./)
  if (match && match[1]) {
    return `@${match[1]}`
  }

  return 'email'
}

const StringUtil = {
  booleanToStringOrDefault,
  getStringOrDefault,
  truncateString,
  getInitials,
  getDomainFromEmail,
}

export default StringUtil
