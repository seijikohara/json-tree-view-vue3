<script lang="ts">
export enum ItemType {
  OBJECT,
  ARRAY,
  VALUE
}

export type PrimitiveTypes = string | number | boolean | null

export interface SelectedData {
  key: string
  value: PrimitiveTypes
  path: string
}

export type ItemData = {
  key: string
  type: ItemType
  path: string
  depth: number
  length?: number
  children?: ItemData[]
  value?: PrimitiveTypes
}

export type Props = {
  data: ItemData
  maxDepth?: number
  canSelect?: boolean
}
</script>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { then, when } from 'switch-ts'

defineOptions({
  name: 'JsonTreeViewItem'
})

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 1,
  canSelect: false
})

const emit = defineEmits<{
  (e: 'selected', value: SelectedData): void
}>()

const state = reactive({
  open: props.data.depth < props.maxDepth
})

const toggleOpen = (): void => {
  state.open = !state.open
}

const onClick = (data: ItemData): void =>
  emit('selected', {
    key: data.key,
    value: data.value,
    path: data.path
  } as SelectedData)

const onSelected = (data: SelectedData): void => emit('selected', data)

const getKey = (itemDate: ItemData): string => {
  const keyValue = Number(itemDate.key)
  return !isNaN(keyValue) ? `${itemDate.key}":` : `"${itemDate.key}":`
}

const getValueColor = (value: PrimitiveTypes): string =>
  when(typeof value)
    .is((v) => v === 'string', then('var(--jtv-string-color)'))
    .is((v) => v === 'number', then('var(--jtv-number-color)'))
    .is((v) => v === 'boolean', then('var(--jtv-boolean-color)'))
    .is((v) => v === 'object', then('var(--jtv-null-color)')) // for null value
    .default(then('var(--jtv-valueKey-color)'))

const classes = computed((): unknown => {
  return {
    'chevron-arrow': true,
    opened: state.open
  }
})

const valueClasses = computed((): unknown => {
  return {
    'value-key': true,
    'can-select': props.canSelect
  }
})

const lengthString = computed((): string => {
  const length = props.data.length
  if (props.data.type === ItemType.ARRAY) {
    return length === 1 ? `${length} element` : `${length} elements`
  }
  return length === 1 ? `${length} property` : `${length} properties`
})

const dataValue = computed((): string => JSON.stringify(props.data.value))
</script>

<template>
  <div class="json-view-item">
    <div v-if="data.type === ItemType.OBJECT || data.type === ItemType.ARRAY">
      <button
        class="data-key"
        :aria-expanded="state.open ? 'true' : 'false'"
        @click.stop="toggleOpen"
      >
        <div :class="classes" />
        {{ data.key }}:
        <span class="properties">{{ lengthString }}</span>
      </button>
      <div v-if="state.open">
        <JsonTreeViewItem
          v-for="child in data.children"
          :key="getKey(child)"
          :data="child"
          :maxDepth="maxDepth"
          :canSelect="canSelect"
          @selected="onSelected"
        />
      </div>
    </div>
    <div
      v-if="data.type === ItemType.VALUE"
      :class="valueClasses"
      :role="canSelect ? 'button' : undefined"
      :tabindex="canSelect ? '0' : undefined"
      @click="onClick(data)"
      @keyup.enter="onClick(data)"
      @keyup.space="onClick(data)"
    >
      <span class="value-key">{{ data.key }}:</span>
      <span :style="{ color: getValueColor(data.value as PrimitiveTypes) }">
        {{ dataValue }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.json-view-item:not(.root-item) {
  margin-left: 15px;
}
.value-key {
  color: var(--jtv-valueKey-color);
  font-weight: 600;
  margin-left: 10px;
  border-radius: 2px;
  white-space: nowrap;
  padding: 5px 5px 5px 10px;
  &.can-select {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    &:focus {
      outline: 2px solid var(--jtv-hover-color);
    }
  }
}
.data-key {
  font-size: 100%;
  font-family: inherit;
  border: 0;
  background-color: transparent;
  width: 100%;
  color: var(--jtv-key-color);
  display: flex;
  align-items: center;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px;
  &:hover {
    background-color: var(--jtv-hover-color);
  }
  &:focus {
    outline: 2px solid var(--jtv-hover-color);
  }
  &::-moz-focus-inner {
    border: 0;
  }
  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-left: 4px;
    user-select: none;
  }
}
.chevron-arrow {
  flex-shrink: 0;
  border-right: 2px solid var(--jtv-arrow-color);
  border-bottom: 2px solid var(--jtv-arrow-color);
  width: var(--jtv-arrow-size);
  height: var(--jtv-arrow-size);
  margin-right: 20px;
  margin-left: 5px;
  transform: rotate(-45deg);
  &.opened {
    margin-top: -3px;
    transform: rotate(45deg);
  }
}
</style>
