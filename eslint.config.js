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
      'vue/multi-word-component-names': 'warn',
      // Template layout is oxfmt's domain. This rule wraps attributes based on
      // count, while oxfmt wraps based on printWidth, so the two can disagree
      // on lines that fit within 100 chars and no numeric retuning reconciles
      // them. Disabling it restores the pre-migration behavior, where
      // @vue/eslint-config-prettier turned off formatter-conflicting layout
      // rules like this one.
      'vue/max-attributes-per-line': 'off'
    }
  },

  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json')
]
