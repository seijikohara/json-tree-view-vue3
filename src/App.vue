<template>
  <div class="theme-light">
    <JsonTreeView
      :data="state.json"
      rootKey="root"
      :maxDepth="2"
      colorScheme="light"
    />
  </div>
  <div class="theme-dark">
    <JsonTreeView :data="state.json" colorScheme="dark" />
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
    return {
      state,
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
