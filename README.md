# json-tree-view-vue3

[![npm version](https://badge.fury.io/js/json-tree-view-vue3.svg)](https://badge.fury.io/js/vue-json-component) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) ![npm bundle size](https://img.shields.io/bundlephobia/min/json-tree-view-vue3.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A Vue3 component that displays JSON in a collapsible tree.
Inspired by [vue-json-component](https://github.com/tylerkrupicka/vue-json-component) and [vue-json-tree-view](https://github.com/michaelfitzhavey/vue-json-tree-view) to work with Vue3.

## Example

```vue
<template>
  <JsonTreeView :data="state.json" :maxDepth="3" />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { JsonTreeView } from "json-tree-view-vue3";

export default defineComponent({
  components: { JsonTreeView },
  setup() {
    const state = reactive({
      json: `{"string":"text","number":123,"boolean":true,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`
    });
    return {
      state
    };
  }
});
</script>
```

![image](https://user-images.githubusercontent.com/9543980/97531049-b4bf0980-19f6-11eb-9060-676d223a66b3.png)

## Props

| Props       | Required | Param Type | Default value | Description                                           |
|-------------|----------|------------|---------------|-------------------------------------------------------|
| data        | false    | String     |               | JSON string to display the tree                       |
| rootKey     | false    | String     | "/"           | Top root-level name                                   |
| maxDepth    | false    | Number     | 1             | The depth of the tree that will be open when rendered |
| colorScheme | false    | String     | "light"       | "light" or "dark" can be used.                        |