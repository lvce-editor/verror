import { expect, test } from '@jest/globals'
import * as GetCombinedMessage from '../src/parts/GetCombinedMessage/GetCombinedMessage.js'

test('getCombinedMessage - no message', () => {
  const error = new TypeError('x is not a function')
  const message = ''
  expect(GetCombinedMessage.getCombinedMessage(error, message)).toBe('TypeError: x is not a function')
})


test('getCombinedMessage - with message', () => {
  const error = new TypeError('x is not a function')
  const message = 'Failed to execute function'
  expect(GetCombinedMessage.getCombinedMessage(error, message)).toBe('Failed to execute function: TypeError: x is not a function')
})
