export function objectToString(data: Record<string, any>) {
  let objectToString = ''
  Object.keys(data).forEach((key) => {
    const value = data[key]
    if (value) {
      objectToString = objectToString + key + '=' + value + '&'
    }
  })

  return objectToString
}
