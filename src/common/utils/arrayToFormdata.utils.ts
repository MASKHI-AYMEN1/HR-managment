// utils/objectToFormData.ts

/**
 * @param data - Object of key-value pairs.
 * @returns FormData
 */
export function objectToFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]
    if (value instanceof Set) {
      formData.append(key, Array.from(value).join(','))
    } else {
      formData.append(key, value)
    }
  })

  return formData
}
