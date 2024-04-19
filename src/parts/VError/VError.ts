import * as GetCombinedMessage from '../GetCombinedMessage/GetCombinedMessage.ts'
import * as MergeStacks from '../MergeStacks/MergeStacks.ts'

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = GetCombinedMessage.getCombinedMessage(
      error,
      message,
    )
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = MergeStacks.mergeStacks(this.stack as string, error.stack)
    }
    if (error.codeFrame) {
      // @ts-ignore
      this.codeFrame = error.codeFrame
    }
    if (error.code) {
      // @ts-ignore
      this.code = error.code
    }
  }
}
