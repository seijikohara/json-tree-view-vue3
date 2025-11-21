import { test, expect } from '@playwright/test'

test.describe('JsonTreeView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Theme sections', () => {
    test('should display light and dark theme sections', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const darkTheme = page.locator('.theme-dark')

      await expect.soft(lightTheme).toBeVisible()
      await expect.soft(darkTheme).toBeVisible()
    })

    test('should have correct background colors', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const darkTheme = page.locator('.theme-dark')

      await expect.soft(lightTheme).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect.soft(darkTheme).toHaveCSS('background-color', 'rgb(0, 0, 0)')
    })
  })

  test.describe('Tree structure', () => {
    test('should render root element', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const rootElement = lightTheme.locator('.json-view-item').first()

      await expect(rootElement).toBeVisible()
    })

    test('should display data keys for objects and arrays', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const dataKeys = lightTheme.locator('.data-key')

      // Should have multiple data-key elements (for objects and arrays)
      await expect.soft(dataKeys.first()).toBeVisible()
      const count = await dataKeys.count()
      expect.soft(count).toBeGreaterThan(0)
    })

    test('should display value keys for primitive types', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const valueKeys = lightTheme.locator('.value-key')

      // Should have multiple value-key elements
      await expect.soft(valueKeys.first()).toBeVisible()
      const count = await valueKeys.count()
      expect.soft(count).toBeGreaterThan(0)
    })

    test('should display property count for objects and arrays', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const properties = lightTheme.locator('.properties').first()

      await expect.soft(properties).toBeVisible()
      const text = await properties.textContent()
      expect.soft(text).toMatch(/(property|properties|element|elements)/)
    })
  })

  test.describe('Expand/Collapse functionality', () => {
    test('should have chevron arrow with correct classes', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const chevron = lightTheme.locator('.chevron-arrow').first()

      await expect.soft(chevron).toBeVisible()
      await expect.soft(chevron).toHaveClass(/chevron-arrow/)
    })

    test('should toggle aria-expanded attribute on click', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const toggleButton = lightTheme.locator('.data-key').first()

      // Get initial aria-expanded state
      const initialState = await toggleButton.getAttribute('aria-expanded')
      expect.soft(initialState).toBe('true')

      // Click to toggle
      await toggleButton.click()
      await expect.soft(toggleButton).toHaveAttribute('aria-expanded', 'false')

      // Click to toggle back
      await toggleButton.click()
      await expect.soft(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    test('should toggle chevron arrow opened class', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const toggleButton = lightTheme.locator('.data-key').first()
      const chevron = lightTheme.locator('.chevron-arrow').first()

      // Initial state - should have opened class
      await expect.soft(chevron).toHaveClass(/opened/)

      // Click to collapse
      await toggleButton.click()
      await expect.soft(chevron).not.toHaveClass(/opened/)

      // Click to expand
      await toggleButton.click()
      await expect.soft(chevron).toHaveClass(/opened/)
    })

    test('should show/hide children on toggle', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const toggleButton = lightTheme.locator('.data-key').first()
      const valueKeys = lightTheme.locator('.value-key')

      // Initial state - children visible
      const initialCount = await valueKeys.count()
      expect.soft(initialCount).toBeGreaterThan(0)

      // Click to collapse
      await toggleButton.click()
      const collapsedCount = await valueKeys.count()
      expect.soft(collapsedCount).toBeLessThan(initialCount)

      // Click to expand
      await toggleButton.click()
      const expandedCount = await valueKeys.count()
      expect.soft(expandedCount).toBe(initialCount)
    })
  })

  test.describe('Data type rendering', () => {
    test('should render string values', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const stringValue = lightTheme.getByText('"text"')

      await expect.soft(stringValue).toBeVisible()
      // String values should have specific color
      await expect.soft(stringValue).toHaveCSS('color', /rgb\(\d+, \d+, \d+\)/)
    })

    test('should render number values', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const numberValue = lightTheme.getByText('123', { exact: true })

      await expect(numberValue).toBeVisible()
    })

    test('should render boolean values', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const booleanValue = lightTheme.getByText('true', { exact: true })

      await expect(booleanValue).toBeVisible()
    })

    test('should render null values', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const nullValue = lightTheme.getByText('null', { exact: true })

      await expect(nullValue).toBeVisible()
    })

    test('should render array elements', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      // Look for array indicator text
      const arrayIndicator = lightTheme.getByText(/elements?/)

      await expect(arrayIndicator.first()).toBeVisible()
    })

    test('should render nested objects', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const nestedObject = lightTheme.getByText('nestedObject')

      await expect(nestedObject).toBeVisible()
    })
  })

  test.describe('CSS classes and styling', () => {
    test('data-key should have correct styling', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const dataKey = lightTheme.locator('.data-key').first()

      await expect.soft(dataKey).toHaveCSS('cursor', 'pointer')
      await expect.soft(dataKey).toHaveCSS('font-weight', '600')
    })

    test('value-key should have correct styling', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const valueKey = lightTheme.locator('.value-key').first()

      await expect.soft(valueKey).toHaveCSS('font-weight', '600')
      await expect.soft(valueKey).toHaveCSS('margin-left', '10px')
    })

    test('json-view-item should have correct indentation', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const items = lightTheme.locator('.json-view-item:not(.root-item)')

      if (await items.count() > 0) {
        await expect(items.first()).toHaveCSS('margin-left', '15px')
      }
    })
  })

  test.describe('Dark theme comparison', () => {
    test('should render tree structure in both themes', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const darkTheme = page.locator('.theme-dark')

      // Both themes should have tree structure elements
      const lightDataKeys = await lightTheme.locator('.data-key').count()
      const darkDataKeys = await darkTheme.locator('.data-key').count()

      expect.soft(lightDataKeys).toBeGreaterThan(0)
      expect.soft(darkDataKeys).toBeGreaterThan(0)
    })

    test('should have different CSS variable values', async ({ page }) => {
      const lightTheme = page.locator('.theme-light')
      const darkTheme = page.locator('.theme-dark')

      // Themes should exist and be different
      await expect.soft(lightTheme).toBeVisible()
      await expect.soft(darkTheme).toBeVisible()

      const lightBg = await lightTheme.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      )
      const darkBg = await darkTheme.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      )

      expect.soft(lightBg).not.toBe(darkBg)
    })
  })
})
