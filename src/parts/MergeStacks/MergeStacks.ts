import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import * as NormalizeErrorLine from '../NormalizeErrorLine/NormalizeErrorLine.ts'

export const mergeStacks = (
  parent: string,
  child: string | undefined,
): string => {
  if (!child) {
    return parent
  }
  const parentNewLineIndex = GetNewLineIndex.getNewLineIndex(parent)
  const childNewLineIndex = GetNewLineIndex.getNewLineIndex(child)
  if (childNewLineIndex === -1) {
    return parent
  }
  const parentFirstLine = parent.slice(0, parentNewLineIndex)
  const parentRest = parent.slice(parentNewLineIndex)
  const childRest = child.slice(childNewLineIndex)
  const childFirstLine = NormalizeErrorLine.normalizeLine(
    child.slice(0, childNewLineIndex),
  )
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest
  }
  if (parentFirstLine.includes(': ')) {
    return parent + childRest + parentRest
  }
  return child
}
