import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import oxlint from 'eslint-plugin-oxlint'

export default [
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  {
    name: 'app/vue-language-options',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    }
  },

  ...pluginVue.configs['flat/strongly-recommended'],

  {
    name: 'app/custom-rules',
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'warn'
    }
  },

  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json')
]
