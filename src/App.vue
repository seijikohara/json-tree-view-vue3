<template>
  <div class="theme-light">
    <JsonTreeView
      rootKey="root"
      colorScheme="light"
      :data="state.json"
      :maxDepth="2"
      @selected="onSelected"
    />
  </div>
  <div class="theme-dark">
    <JsonTreeView
      colorScheme="dark"
      :data="state.json"
      @selected="onSelected"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { JsonTreeView } from "./components";

export default defineComponent({
  components: { JsonTreeView },
  setup() {
    const state = reactive({
      json: `{"string":"text","number":123,"boolean":true,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`,
    });

    function onSelected(event: unknown) {
      console.log(event);
    }

    return {
      state,
      onSelected,
    };
  },
});
</script>

<style lang="scss" scoped>
.theme-light {
  background-color: #ffffff;
}
.theme-dark {
  background-color: #000000;
}
</style>
