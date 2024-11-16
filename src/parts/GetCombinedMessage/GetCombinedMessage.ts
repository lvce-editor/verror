import * as NormalizeErrorLine from '../NormalizeErrorLine/NormalizeErrorLine.ts'

export const getCombinedMessage = (error: any, message?: string): string => {
  const stringifiedError = NormalizeErrorLine.normalizeLine(`${error}`)
  if (message) {
    return `${message}: ${stringifiedError}`
  }
  return stringifiedError
}
