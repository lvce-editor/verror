import { hash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..')

const locations = [
  'package-lock.json',
  '.github/workflows/ci.yml',
  '.github/workflows/pr.yml',
  '.github/workflows/release.yml',
  'scripts/computeNodeModulesCacheKey.js',
]

const getAbsolutePath = (relativePath) => {
  return join(root, relativePath)
}

const getContent = (absolutePath) => {
  return readFile(absolutePath, 'utf8')
}

export const computeHash = (contents) => {
  return hash('sha1', JSON.stringify(contents))
}

const computeCacheKey = async (locations) => {
  const absolutePaths = locations.map(getAbsolutePath)
  const contents = await Promise.all(absolutePaths.map(getContent))
  const hash = computeHash(contents)
  return hash
}

const main = async () => {
  const hash = await computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
