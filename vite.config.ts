import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

const name = 'json-tree-view-vue3'

export default defineConfig({
  plugins: [
    vue({
      features: {
        propsDestructure: true
      },
      script: {
        defineModel: true,
        hoistStatic: true
      }
    }),
    libInjectCss()
  ],
  build: {
    target: 'baseline-widely-available',
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name,
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? `${name}.js` : `${name}.${format}.cjs`)
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          // Ensure CSS is output as style.css to match package.json exports
          const fileName = assetInfo.names?.[0]
          if (fileName && /\.css$/.test(fileName)) {
            return 'style.css'
          }
          return fileName ?? 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
