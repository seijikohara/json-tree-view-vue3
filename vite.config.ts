import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts'

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
    libInjectCss(),
    dts({
      tsconfigPath: 'tsconfig.json',
      entryRoot: 'src',
      processor: 'vue',
      cleanVueFileName: true,
      bundleTypes: true
    })
  ],
  build: {
    target: 'baseline-widely-available',
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => `${name}.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0]
          if (fileName && fileName.endsWith('.css')) {
            return 'style.css'
          }
          return fileName ?? 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
