import type { PrimitiveTypes } from './JsonTreeViewItem.vue'

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isPrimitive = (value: unknown): value is PrimitiveTypes =>
  value === null ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean'

export const getValueColorVariable = (value: PrimitiveTypes): string => {
  const typeColorMap: Record<string, string> = {
    string: 'var(--jtv-string-color)',
    number: 'var(--jtv-number-color)',
    boolean: 'var(--jtv-boolean-color)',
    object: 'var(--jtv-null-color)'
  }

  return typeColorMap[typeof value] ?? 'var(--jtv-valueKey-color)'
}

export const formatKey = (key: string): string => {
  const numericKey = Number(key)
  return Number.isNaN(numericKey) ? `"${key}":` : `${key}":`
}

export const getLengthString = (length: number, isArray: boolean): string => {
  const unit = isArray ? 'element' : 'property'
  const pluralUnit = isArray ? 'elements' : 'properties'
  return length === 1 ? `${length} ${unit}` : `${length} ${pluralUnit}`
}

export const buildPath = (
  basePath: string,
  key: string,
  includeKey: boolean,
  isArrayElement: boolean = false
): string => {
  if (!includeKey) return basePath

  if (isArrayElement) {
    return `${basePath}${key}[${key}].`
  }

  return `${basePath}${key}.`
}

export const buildValuePath = (basePath: string, key: string, includeKey: boolean): string => {
  if (!includeKey) {
    return basePath.slice(0, -1)
  }
  return `${basePath}${key}`
}
