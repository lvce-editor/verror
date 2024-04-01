import * as NormalizeErrorLine from '../NormalizeErrorLine/NormalizeErrorLine.ts'

export const getCombinedMessage = (error, message) => {
  const stringifiedError = NormalizeErrorLine.normalizeLine(`${error}`)
  if (message) {
    return `${message}: ${stringifiedError}`
  }
  return stringifiedError
}
