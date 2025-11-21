<script lang="ts">
export type ColorScheme = 'light' | 'dark'

export type Props = {
  json: string
  rootKey?: string
  maxDepth?: number
  colorScheme?: ColorScheme
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import JsonTreeViewItem, {
  type ItemData,
  ItemType,
  type PrimitiveTypes,
  type SelectedData
} from './JsonTreeViewItem.vue'
import { isArray, isObject, buildPath, buildValuePath } from './utils'

defineOptions({
  name: 'JsonTreeView'
})

const { json, rootKey = '/', maxDepth = 1, colorScheme = 'light' } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selected', value: SelectedData): void
}>()

const onSelected = (selectedData: SelectedData) => emit('selected', selectedData)

const buildArrayItem = (
  key: string,
  array: unknown[],
  depth: number,
  path: string,
  includeKey: boolean
) => {
  const children = array.map((element, index) =>
    buildItemData(
      index.toString(),
      element,
      depth + 1,
      buildPath(path, key, includeKey, true),
      false
    )
  )

  return {
    key,
    type: ItemType.ARRAY,
    depth,
    path,
    length: children.length,
    children
  }
}

const buildObjectItem = (
  key: string,
  obj: Record<string, unknown>,
  depth: number,
  path: string,
  includeKey: boolean
) => {
  const children = Object.entries(obj).map(([childKey, childValue]) =>
    buildItemData(childKey, childValue, depth + 1, buildPath(path, key, includeKey), true)
  )

  return {
    key,
    type: ItemType.OBJECT,
    depth,
    path,
    length: children.length,
    children
  }
}

const buildValueItem = (
  key: string,
  value: PrimitiveTypes,
  depth: number,
  path: string,
  includeKey: boolean
) => ({
  key,
  type: ItemType.VALUE,
  path: buildValuePath(path, key, includeKey),
  depth,
  value
})

const buildItemData = (
  key: string,
  value: unknown,
  depth: number,
  path: string,
  includeKey: boolean
): ItemData => {
  if (isArray(value)) {
    return buildArrayItem(key, value, depth, path, includeKey)
  }

  if (isObject(value)) {
    return buildObjectItem(key, value, depth, path, includeKey)
  }

  return buildValueItem(key, value as PrimitiveTypes, depth, path, includeKey)
}

const parseJsonToItemData = (jsonStr: string, key: string): ItemData => {
  try {
    const data = JSON.parse(jsonStr)

    if (isObject(data) || isArray(data)) {
      return buildItemData(key, data, 0, '', true)
    }

    return buildValueItem(key, data as PrimitiveTypes, 0, '', true)
  } catch {
    return buildValueItem(key, jsonStr, 0, '', true)
  }
}

const parsed = computed(() => parseJsonToItemData(json, rootKey))
</script>

<template>
  <JsonTreeViewItem
    class="root-item"
    :class="{ dark: colorScheme === 'dark' }"
    :data="parsed"
    :max-depth="maxDepth"
    @selected="onSelected"
  />
</template>

<style lang="scss" scoped>
.root-item {
  /* Color palette - Light theme */
  --jtv-key-color: oklch(0.55 0.15 240); /* #0977e6 */
  --jtv-valueKey-color: oklch(0.25 0.05 210); /* #073642 */
  --jtv-string-color: oklch(0.6 0.12 230); /* #268bd2 */
  --jtv-number-color: oklch(0.65 0.1 180); /* #2aa198 */
  --jtv-boolean-color: oklch(0.55 0.15 40); /* #cb4b16 */
  --jtv-null-color: oklch(0.55 0.12 280); /* #6c71c4 */

  /* UI colors */
  --jtv-arrow-color: oklch(0.3 0 0); /* #444 */
  --jtv-hover-color: oklch(0 0 0 / 0.1); /* rgba(0, 0, 0, 0.1) */

  /* Dimensions */
  --jtv-arrow-size: 6px;
  --jtv-spacing-unit: 4px;

  /* Layout */
  display: block;
  inline-size: 100%;
  block-size: auto;
  margin-inline-start: 0;

  &.dark {
    /* Color palette - Dark theme */
    --jtv-key-color: oklch(0.75 0.1 220); /* #80d8ff */
    --jtv-valueKey-color: oklch(0.95 0.02 90); /* #fdf6e3 */
    --jtv-hover-color: oklch(1 0 0 / 0.1); /* rgba(255, 255, 255, 0.1) */
    --jtv-arrow-color: oklch(0.95 0.02 90); /* #fdf6e3 */
  }
}
</style>
