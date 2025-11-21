import type { PrimitiveTypes } from './JsonTreeViewItem.vue'

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isPrimitive = (value: unknown): value is PrimitiveTypes =>
  value === null ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean'

export const getValueColorVariable = (value: PrimitiveTypes) => {
  if (value === null) {
    return 'var(--jtv-null-color)'
  }

  const typeColorMap: Record<string, string> = {
    string: 'var(--jtv-string-color)',
    number: 'var(--jtv-number-color)',
    boolean: 'var(--jtv-boolean-color)'
  }

  return typeColorMap[typeof value] ?? 'var(--jtv-valueKey-color)'
}

export const formatKey = (key: string) => {
  const numericKey = Number(key)
  return Number.isNaN(numericKey) ? `"${key}":` : `${key}":`
}

export const getLengthString = (length: number, isArray: boolean) => {
  const unit = isArray ? 'element' : 'property'
  const pluralUnit = isArray ? 'elements' : 'properties'
  return length === 1 ? `${length} ${unit}` : `${length} ${pluralUnit}`
}

export const buildPath = (
  basePath: string,
  key: string,
  includeKey: boolean,
  isArrayElement = false
) => {
  if (!includeKey) return basePath

  if (isArrayElement) {
    return `${basePath}${key}[${key}].`
  }

  return `${basePath}${key}.`
}

export const buildValuePath = (basePath: string, key: string, includeKey: boolean) => {
  if (!includeKey) {
    return basePath.slice(0, -1)
  }
  return `${basePath}${key}`
}
