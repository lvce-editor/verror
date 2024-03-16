import * as GetCombinedMessage from '../GetCombinedMessage/GetCombinedMessage.js'
import * as MergeStacks from '../MergeStacks/MergeStacks.js'


export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = GetCombinedMessage. getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = MergeStacks.mergeStacks(this.stack, error.stack)
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
    if (error.code) {
      this.code = error.code
    }
  }
}
