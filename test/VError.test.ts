import { expect, test } from '@jest/globals'
import { VError } from '../src/parts/VError/VError.js'

test('VError - missing child stack', () => {
  class DOMException extends Error {
    constructor(message) {
      super(message)
      this.stack = undefined
      this.name = 'DOMException'
    }
  }
  const cause = new DOMException(
    'The requested version (1) is less than the existing version (6).',
  )
  const verror = new VError(cause, 'Failed to save IndexedDb value')
  expect(verror.stack).toMatch(
    'VError: Failed to save IndexedDb value: DOMException: The requested version (1) is less than the existing version (6).',
  )
})

test('VError - merging stacks', () => {
  const cause = new TypeError()
  cause.message = "Cannot read properties of undefined (reading 'match')"
  cause.stack = `Cannot read properties of undefined (reading 'match')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`
  const verror = new VError(cause, 'Failed to drop files')
  expect(verror.stack).toBe(
    `VError: Failed to drop files: TypeError: Cannot read properties of undefined (reading 'match')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`,
  )
})

test('VError - merging stacks - parent stack does not include message', () => {
  const error = new Error()
  error.message = 'Unknown command "ElectronWindowAbout.open"'
  error.stack = `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  const verror = new VError(error, 'Failed to open about window')
  expect(verror.message).toBe(
    'Failed to open about window: Unknown command "ElectronWindowAbout.open"',
  )
  expect(verror.stack).toBe(
    `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`,
  )
})

test('VError - remove unnecessary Error prefix', () => {
  const error = new Error()
  error.message = 'Failed to import script /test/extension.js: Not found (404)'
  const verror = new VError(
    error,
    'Failed to activate extension test.test-extension',
  )
  expect(verror.message).toBe(
    'Failed to activate extension test.test-extension: Failed to import script /test/extension.js: Not found (404)',
  )
})

test('VError - rollup error', () => {
  const RollupError = class extends Error {
    code: any
    pos: any
    id: any
    loc: any
    frame: any
    constructor({ code, frame, id, loc, message, pos }) {
      super(message)
      this.code = code
      this.pos = pos
      this.id = id
      this.loc = loc
      this.frame = frame
    }
  }
  const error = new RollupError({
    code: 'PARSE_ERROR',
    frame: `5:     case IpcChildType.MessagePort:
6:       return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
7: <<<<<<< HEAD
   ^
8:     case IpcChildType.ModuleWorkerAndMessagePort:
9:       return import('../IpcChildWithModuleWorkerAndMessagePort/IpcChildWithModuleWorkerAndMessagePort.js')`,
    id: '/test/packages/test-worker/src/parts/IpcChildModule/IpcChildModule.js',
    loc: {
      column: 0,
      file: '/test/packages/test-worker/src/parts/IpcChildModule/IpcChildModule.js',
      line: 7,
    },
    message: 'Merge conflict marker encountered.',
    pos: 236,
  })
  const verror = new VError(error, 'Failed to bundle js')
  expect(verror.message).toBe(
    'Failed to bundle js: Merge conflict marker encountered.',
  )
})

test('VError - module not found', () => {
  const cause = new Error(
    "[ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/embeds-worker/src/embedsProcessMain.js' imported from /test/packages/main-process/",
  )
  cause.message = "Cannot read properties of undefined (reading 'match')"
  cause.stack = undefined
  const verror = new VError(
    cause,
    'Utility process exited before ipc connection was established',
  )
  expect(verror.stack).toMatch(
    "VError: Utility process exited before ipc connection was established: Cannot read properties of undefined (reading 'match')",
  )
})

test('VError - with codeFrame', () => {
  const cause = new TypeError('x is not a function')
  // @ts-ignore
  cause.codeFrame = 'let x = 1;'
  const verror = new VError(cause, 'failed ')
  // @ts-ignore
  expect(verror.codeFrame).toBe('let x = 1;')
})
