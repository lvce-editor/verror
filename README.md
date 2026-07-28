# VError

Improve error messages by adding additional context to an error.

## Install

```sh
npm install @lvce-editor/verror
```

## Usage

```js
import { VError } from '@lvce-editor/verror'

const otherFunction = () => {
  throw new Error(`oops`)
}

const doSomething = () => {
  try {
    const data = otherFunction()
    return data
  } catch (error) {
    throw new VError(error, `failed to get data`)
  }
}
```