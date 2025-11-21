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
import { computed, ref } from 'vue'
import { getValueColorVariable, formatKey, getLengthString } from './utils'

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

const isOpen = ref<boolean>(props.data.depth < props.maxDepth)

const toggleOpen = (): void => {
  isOpen.value = !isOpen.value
}

const onClick = (data: ItemData): void => {
  const selectedData: SelectedData = {
    key: data.key,
    value: data.value!,
    path: data.path
  }
  emit('selected', selectedData)
}

const onSelected = (data: SelectedData): void => emit('selected', data)

const chevronClasses = computed<Record<string, boolean>>(() => ({
  'chevron-arrow': true,
  opened: isOpen.value
}))

const valueClasses = computed<Record<string, boolean>>(() => ({
  'value-key': true,
  'can-select': props.canSelect
}))

const lengthString = computed<string>(() => {
  const { length, type } = props.data
  if (length === undefined) return ''

  return getLengthString(length, type === ItemType.ARRAY)
})

const dataValue = computed<string>(() => JSON.stringify(props.data.value))

const getItemKey = (item: ItemData): string => formatKey(item.key)

const getValueColor = (value: PrimitiveTypes): string => getValueColorVariable(value)
</script>

<template>
  <div class="json-view-item">
    <!-- Container/Collection types (Object/Array) -->
    <template v-if="data.type === ItemType.OBJECT || data.type === ItemType.ARRAY">
      <button class="data-key" type="button" :aria-expanded="isOpen" @click.stop="toggleOpen">
        <div :class="chevronClasses" aria-hidden="true" />
        <span>{{ data.key }}:</span>
        <span class="properties">{{ lengthString }}</span>
      </button>

      <Transition name="expand">
        <div v-show="isOpen">
          <JsonTreeViewItem
            v-for="child in data.children"
            :key="getItemKey(child)"
            :data="child"
            :max-depth="maxDepth"
            :can-select="canSelect"
            @selected="onSelected"
          />
        </div>
      </Transition>
    </template>

    <!-- Primitive value type -->
    <component
      :is="canSelect ? 'button' : 'div'"
      v-if="data.type === ItemType.VALUE"
      :class="valueClasses"
      :type="canSelect ? 'button' : null"
      :tabindex="canSelect ? 0 : null"
      @click="canSelect ? onClick(data) : null"
      @keyup.enter="canSelect ? onClick(data) : null"
      @keyup.space.prevent="canSelect ? onClick(data) : null"
    >
      <span class="value-key">{{ data.key }}:</span>
      <span :style="{ color: getValueColor(data.value as PrimitiveTypes) }">
        {{ dataValue }}
      </span>
    </component>
  </div>
</template>

<style lang="scss">
/* Base item spacing */
.json-view-item:where(:not(.root-item)) {
  margin-inline-start: 15px;
}

/* Value key styling */
.value-key {
  /* Typography */
  color: var(--jtv-valueKey-color);
  font-weight: 600;
  white-space: nowrap;

  /* Layout */
  display: inline-block;
  padding-block: 5px;
  padding-inline: 10px 5px;
  margin-inline-start: 10px;
  border-radius: 2px;

  /* Interactive state */
  &.can-select {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:is(:hover, :focus-visible) {
      background-color: oklch(0 0 0 / 0.08);
    }

    &:focus-visible {
      outline: 2px solid var(--jtv-hover-color);
      outline-offset: 2px;
    }
  }
}

/* Data key button styling */
.data-key {
  /* Reset button styles */
  all: unset;
  box-sizing: border-box;

  /* Typography */
  color: var(--jtv-key-color);
  font-weight: 600;
  white-space: nowrap;

  /* Layout */
  display: flex;
  align-items: center;
  inline-size: 100%;
  padding-block: 5px;
  padding-inline: 5px;
  border-radius: 2px;

  /* Interactive */
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:is(:hover, :focus-visible) {
    background-color: var(--jtv-hover-color);
  }

  &:focus-visible {
    outline: 2px solid var(--jtv-hover-color);
    outline-offset: 2px;
  }

  /* Child element - properties count */
  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-inline-start: calc(var(--jtv-spacing-unit, 4px) * 1);
    user-select: none;
  }
}

/* Chevron arrow indicator */
.chevron-arrow {
  /* Layout */
  flex-shrink: 0;
  inline-size: var(--jtv-arrow-size);
  block-size: var(--jtv-arrow-size);
  margin-inline: 5px 20px;

  /* Visual */
  border-inline-end: 2px solid var(--jtv-arrow-color);
  border-block-end: 2px solid var(--jtv-arrow-color);
  transform: rotate(-45deg);
  transition: transform 0.2s ease;

  &.opened {
    margin-block-start: -3px;
    transform: rotate(45deg);
  }
}

/* Expand/Collapse transition */
.expand-enter-active,
.expand-leave-active {
  transition:
    opacity 0.2s ease,
    max-block-size 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-block-size: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-block-size: 1000px; /* Arbitrary large value */
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .value-key.can-select,
  .data-key,
  .chevron-arrow,
  .expand-enter-active,
  .expand-leave-active {
    transition: none;
  }
}
</style>
