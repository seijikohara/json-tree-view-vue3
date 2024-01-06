# json-tree-view-vue3

[![npm version](https://badge.fury.io/js/json-tree-view-vue3.svg)](https://www.npmjs.com/package/json-tree-view-vue3) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) ![npm bundle size](https://img.shields.io/bundlephobia/min/json-tree-view-vue3.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A Vue3 component that displays JSON in a collapsible tree.
Inspired by [vue-json-component](https://www.npmjs.com/package/vue-json-component) and [vue-json-tree-view](https://www.npmjs.com/package/vue-json-tree-view) to work with Vue3 and TypeScript.

## Example

```vue
<script setup lang="ts">
import { JsonTreeView } from "json-tree-view-vue3";
import 'json-tree-view-vue3/dist/style.css'

const json = `{"string":"text","number":123,"boolean":true,"null":null,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`
</script>

<template>
  <JsonTreeView :json="json" :maxDepth="3" />
</template>
```

<img width="296" alt="image" src="https://github.com/seijikohara/json-tree-view-vue3/assets/9543980/0d4d74bc-367d-4fd1-a47a-edfb857a6478">

## Props

| Props       | Required | Param Type | Default value | Description                                           |
|-------------|----------|------------|---------------|-------------------------------------------------------|
| json        | true     | string     |               | JSON string to display the tree                       |
| rootKey     | false    | string     | "/"           | Top root-level name                                   |
| maxDepth    | false    | number     | 1             | The depth of the tree that will be open when rendered |
| colorScheme | false    | string     | "light"       | "light" or "dark" can be used.                        |

## Events

- **selected**(event: `{key: string, value: PrimitiveTypes, path: string}`]
