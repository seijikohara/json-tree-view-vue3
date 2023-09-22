# json-tree-view-vue3

[![npm version](https://badge.fury.io/js/json-tree-view-vue3.svg)](https://www.npmjs.com/package/json-tree-view-vue3) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) ![npm bundle size](https://img.shields.io/bundlephobia/min/json-tree-view-vue3.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A Vue3 component that displays JSON in a collapsible tree.
Inspired by [vue-json-component](https://www.npmjs.com/package/vue-json-component) and [vue-json-tree-view](https://www.npmjs.com/package/vue-json-tree-view) to work with Vue3 and TypeScript.

## Example

```vue
<script setup lang="ts">
import { JsonTreeView } from "json-tree-view-vue3";

const json = `{"string":"text","number":123,"boolean":true,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`
</script>

<template>
  <JsonTreeView :data="json" :maxDepth="3" />
</template>
```

![image](https://user-images.githubusercontent.com/9543980/97531049-b4bf0980-19f6-11eb-9060-676d223a66b3.png)

## Props

| Props       | Required | Param Type | Default value | Description                                           |
|-------------|----------|------------|---------------|-------------------------------------------------------|
| data        | false    | String     |               | JSON string to display the tree                       |
| rootKey     | false    | String     | "/"           | Top root-level name                                   |
| maxDepth    | false    | Number     | 1             | The depth of the tree that will be open when rendered |
| colorScheme | false    | String     | "light"       | "light" or "dark" can be used.                        |

## Events

- **selected**(event: `{key: string, value: unknown, path: string}`]
