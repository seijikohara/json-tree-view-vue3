# json-tree-view-vue3

[![npm version](https://img.shields.io/npm/v/json-tree-view-vue3.svg)](https://www.npmjs.com/package/json-tree-view-vue3)
[![CI](https://img.shields.io/github/actions/workflow/status/seijikohara/json-tree-view-vue3/npm-ci.yml?branch=main&label=CI)](https://github.com/seijikohara/json-tree-view-vue3/actions/workflows/npm-ci.yml)
[![E2E Tests](https://img.shields.io/github/actions/workflow/status/seijikohara/json-tree-view-vue3/playwright.yml?branch=main&label=E2E)](https://github.com/seijikohara/json-tree-view-vue3/actions/workflows/playwright.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![npm bundle size](https://img.shields.io/bundlephobia/min/json-tree-view-vue3.svg)](https://bundlephobia.com/package/json-tree-view-vue3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Vue 3 component for rendering JSON data as an interactive, collapsible tree structure.

Inspired by [vue-json-component](https://www.npmjs.com/package/vue-json-component) and [vue-json-tree-view](https://www.npmjs.com/package/vue-json-tree-view), this library provides native Vue 3 and TypeScript support.

## Installation

```bash
npm install json-tree-view-vue3
```

## Usage

```vue
<script setup lang="ts">
import { JsonTreeView } from "json-tree-view-vue3";
import "json-tree-view-vue3/dist/style.css";

const json = `{"string":"text","number":123,"boolean":true,"null":null,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`;
</script>

<template>
  <JsonTreeView :json="json" :maxDepth="3" />
</template>
```

### Example Output

<img width="296" alt="JSON tree view example" src="https://github.com/seijikohara/json-tree-view-vue3/assets/9543980/0d4d74bc-367d-4fd1-a47a-edfb857a6478">

## API Reference

### Props

| Property      | Type     | Required | Default   | Description                                                      |
|---------------|----------|----------|-----------|------------------------------------------------------------------|
| `json`        | `string` | Yes      | -         | A valid JSON string to be rendered as a tree structure           |
| `rootKey`     | `string` | No       | `"/"`     | The label displayed for the root node of the tree                |
| `maxDepth`    | `number` | No       | `1`       | The initial depth level to which the tree will be expanded       |
| `colorScheme` | `string` | No       | `"light"` | Visual theme of the component. Accepts `"light"` or `"dark"`     |

### Events

#### `selected`

Emitted when a user selects a value in the tree.

**Payload Type:**
```typescript
{
  key: string;      // The key of the selected node
  value: PrimitiveTypes;  // The value of the selected node (string, number, boolean, or null)
  path: string;     // The full path to the selected node
}
```

## Styling and Customization

The component uses CSS custom properties (variables) for theming, allowing you to customize colors and dimensions to match your application's design system.

### Available CSS Variables

```css
/* Color palette */
--jtv-key-color: oklch(0.55 0.15 240);        /* Object/Array key color */
--jtv-valueKey-color: oklch(0.25 0.05 210);   /* Primitive value key color */
--jtv-string-color: oklch(0.6 0.12 230);      /* String value color */
--jtv-number-color: oklch(0.65 0.1 180);      /* Number value color */
--jtv-boolean-color: oklch(0.55 0.15 40);     /* Boolean value color */
--jtv-null-color: oklch(0.55 0.12 280);       /* Null value color */

/* UI colors */
--jtv-arrow-color: oklch(0.3 0 0);            /* Expand/collapse arrow color */
--jtv-hover-color: oklch(0 0 0 / 0.1);        /* Hover background color */

/* Dimensions */
--jtv-arrow-size: 6px;                        /* Size of the expand/collapse arrow */
--jtv-spacing-unit: 4px;                      /* Base spacing unit */
```

### Custom Styling Example

You can override these variables to customize the appearance:

```vue
<style>
.json-tree-view {
  /* Custom color scheme */
  --jtv-key-color: #2563eb;
  --jtv-valueKey-color: #1e293b;
  --jtv-string-color: #059669;
  --jtv-number-color: #dc2626;
  --jtv-boolean-color: #7c3aed;
  --jtv-null-color: #64748b;

  /* Custom dimensions */
  --jtv-arrow-size: 8px;
  --jtv-spacing-unit: 6px;
}
</style>

<template>
  <div class="json-tree-view">
    <JsonTreeView :json="json" />
  </div>
</template>
```

### Dark Mode

The component includes built-in dark mode support through the `colorScheme` prop. Alternatively, you can customize the dark theme by overriding the CSS variables within your own dark mode class.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
