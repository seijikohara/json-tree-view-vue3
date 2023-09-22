<script setup lang="ts">
import JsonTreeView from './components/JsonTreeView.vue'

defineOptions({
  name: 'JsonTreeView'
})

const json = `{"string":"text","number":123,"boolean":true,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`

const onSelected = (event: unknown) => {
  console.log(event)
}
</script>

<template>
  <div class="theme-light">
    <JsonTreeView
      rootKey="root"
      colorScheme="light"
      :data="json"
      :maxDepth="2"
      @selected="onSelected"
    />
  </div>
  <div class="theme-dark">
    <JsonTreeView colorScheme="dark" :data="json" @selected="onSelected" />
  </div>
</template>

<style lang="scss" scoped>
.theme-light {
  background-color: #ffffff;
}
.theme-dark {
  background-color: #000000;
}
</style>
