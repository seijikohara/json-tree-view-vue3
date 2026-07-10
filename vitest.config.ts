import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

const allBrowsers = [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }]

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['src/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      // Locally, run only chromium for a fast feedback loop; CI selects each
      // browser explicitly via `--project=<name>` and needs all three defined.
      instances: process.env.CI ? allBrowsers : [{ browser: 'chromium' }]
    }
  }
})
