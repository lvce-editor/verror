import { expect, test } from '@jest/globals'
import * as MergeStacks from '../src/parts/MergeStacks/MergeStacks.js'

test('mergeStacks', () => {
  const parentStack = `VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
  at Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:40:11)
  at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
  at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
  at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`
  const childStack = `VError: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.createSymLink (/test/packages/shared-process/src/parts/SymLink/SymLink.js:12:11)
    at async Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:35:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`
  expect(MergeStacks.mergeStacks(parentStack, childStack))
    .toBe(`VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.createSymLink (/test/packages/shared-process/src/parts/SymLink/SymLink.js:12:11)
    at async Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:35:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`)
})

test('mergeStacks - missing newline in child stack', () => {
  const parentStack = `VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:40:11)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`
  const childStack = 'error'
  expect(MergeStacks.mergeStacks(parentStack, childStack))
    .toBe(`VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:40:11)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`)
})

test.skip('mergeStacks - different messages', () => {
  const parentStack = `VError: Failed to bundle js: RollupError: build/.tmp/dist/2f27e39/packages/test-worker/src/parts/IpcChildModule/IpcChildModule.js (7:0): Merge conflict marker encountered.
    at Module.bundleJs (/test/build/src/parts/BundleJsRollup/BundleJsRollup.js:136:11)
    at async bundleJs (/test/build/src/parts/Static/Static.js:434:3)
    at async Module.build (/test/build/src/parts/Static/Static.js:562:3)
    at async main (/test/build/src/build.js:78:5)',`
  const childStack = `RollupError: Merge conflict marker encountered.
    at getRollupError (/test/build/node_modules/rollup/dist/es/shared/parseAst.js:376:41)
    at ParseError.initialise (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:11158:28)
    at convertNode (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:12898:10)
    at convertProgram (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:12218:12)
    at Module.setSource (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:14042:24)
    at async ModuleLoader.addModuleSource (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:18681:13)'`
  expect(MergeStacks.mergeStacks(parentStack, childStack))
    .toBe(`VError: Failed to bundle js: RollupError: build/.tmp/dist/2f27e39/packages/test-worker/src/parts/IpcChildModule/IpcChildModule.js (7:0): Merge conflict marker encountered.
    at getRollupError (/test/build/node_modules/rollup/dist/es/shared/parseAst.js:376:41)
    at ParseError.initialise (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:11158:28)
    at convertNode (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:12898:10)
    at convertProgram (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:12218:12)
    at Module.setSource (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:14042:24)
    at async ModuleLoader.addModuleSource (/test/build/node_modules/rollup/dist/es/shared/node-entry.js:18681:13)'`)
})
