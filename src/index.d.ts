export class VError extends Error {
  new(message: string): Error
  new(error: any, message: string): Error
}
