// Ports the 21 Playwright E2E cases (e2e/json-tree-view.spec.ts) to Vitest
// Browser Mode component tests. JsonTreeView is mounted directly instead of
// the demo App.vue; the demo JSON payload is duplicated below so this suite
// does not depend on the demo entry point. Two cases (color-scheme visibility
// and background colors) originally tested the demo's `.theme-light`/
// `.theme-dark` wrapper divs, which live in App.vue, not in the library --
// they are reinterpreted here as assertions on the component's own `dark`
// class binding and its derived computed colors, which is the actual library
// behavior those E2E cases stood in for.
import { describe, expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import JsonTreeView from '../JsonTreeView.vue'

const json =
  '{"string":"text","number":123,"boolean":true,"null":null,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}'

const renderLightTree = () =>
  render(JsonTreeView, {
    props: { json, rootKey: 'root', colorScheme: 'light', maxDepth: 2 }
  })

const renderDarkTree = () => render(JsonTreeView, { props: { json, colorScheme: 'dark' } })

const query = <T extends Element = HTMLElement>(root: ParentNode, selector: string): T => {
  const el = root.querySelector<T>(selector)
  if (!el) {
    throw new Error(`query: no element matched "${selector}"`)
  }
  return el
}

const styleOf = (el: Element | null | undefined, selectorForError: string): CSSStyleDeclaration => {
  if (!el) {
    throw new Error(`styleOf: element not found for ${selectorForError}`)
  }
  return getComputedStyle(el)
}

describe('JsonTreeView', () => {
  describe('Color scheme', () => {
    test('renders both light and dark color-scheme instances', async () => {
      const light = await renderLightTree()
      const dark = await renderDarkTree()

      expect(light.container.querySelector('.root-item')).toBeTruthy()
      expect(dark.container.querySelector('.root-item')).toBeTruthy()
    })

    test('applies the dark class to the root element only when colorScheme is dark', async () => {
      const light = await renderLightTree()
      const dark = await renderDarkTree()

      const lightRoot = light.container.querySelector('.root-item')
      const darkRoot = dark.container.querySelector('.root-item')

      expect(lightRoot?.classList.contains('dark')).toBe(false)
      expect(darkRoot?.classList.contains('dark')).toBe(true)
    })
  })

  describe('Tree structure', () => {
    test('renders the root element', async () => {
      const { container } = await renderLightTree()
      expect(container.querySelector('.json-view-item')).toBeTruthy()
    })

    test('displays data keys for objects and arrays', async () => {
      const { container } = await renderLightTree()
      expect(container.querySelectorAll('.data-key').length).toBeGreaterThan(0)
    })

    test('displays value keys for primitive types', async () => {
      const { container } = await renderLightTree()
      expect(container.querySelectorAll('.value-key').length).toBeGreaterThan(0)
    })

    test('displays a property count for objects and arrays', async () => {
      const { container } = await renderLightTree()
      const properties = container.querySelector('.properties')

      expect(properties).toBeTruthy()
      expect(properties?.textContent).toMatch(/(property|properties|element|elements)/)
    })
  })

  describe('Expand/collapse functionality', () => {
    test('renders a chevron arrow with the expected class', async () => {
      const { container } = await renderLightTree()
      const chevron = container.querySelector('.chevron-arrow')

      expect(chevron).toBeTruthy()
      expect(chevron?.classList.contains('chevron-arrow')).toBe(true)
    })

    test('toggles aria-expanded on click', async () => {
      const { container } = await renderLightTree()
      const toggleButton = query<HTMLButtonElement>(container, '.data-key')

      expect(toggleButton.getAttribute('aria-expanded')).toBe('true')

      toggleButton.click()
      await nextTick()
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false')

      toggleButton.click()
      await nextTick()
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true')
    })

    test('toggles the chevron opened class', async () => {
      const { container } = await renderLightTree()
      const toggleButton = query<HTMLButtonElement>(container, '.data-key')
      const chevron = query(container, '.chevron-arrow')

      expect(chevron.classList.contains('opened')).toBe(true)

      toggleButton.click()
      await nextTick()
      expect(chevron.classList.contains('opened')).toBe(false)

      toggleButton.click()
      await nextTick()
      expect(chevron.classList.contains('opened')).toBe(true)
    })

    test('shows and hides children on toggle', async () => {
      const { container } = await renderLightTree()
      const toggleButton = query<HTMLButtonElement>(container, '.data-key')
      const rootItem = query(container, '.root-item')
      const firstChild = query(rootItem, '.json-view-item')

      expect(firstChild.checkVisibility()).toBe(true)

      toggleButton.click()
      // <Transition> delays display:none until its 0.2s leave transition
      // ends, so a single microtask tick is not enough here -- poll instead.
      await expect.poll(() => firstChild.checkVisibility()).toBe(false)

      toggleButton.click()
      await expect.poll(() => firstChild.checkVisibility()).toBe(true)
    })
  })

  describe('Data type rendering', () => {
    test('renders string values', async () => {
      const screen = await renderLightTree()
      const stringValue = screen.getByText('"text"')

      await expect.element(stringValue).toBeVisible()
      expect(styleOf(stringValue.element(), `getByText('"text"')`).color).toMatch(
        /(rgb\(\d+, \d+, \d+\)|oklch\([^)]+\))/
      )
    })

    test('renders number values', async () => {
      const screen = await renderLightTree()
      await expect.element(screen.getByText('123', { exact: true })).toBeVisible()
    })

    test('renders boolean values', async () => {
      const screen = await renderLightTree()
      await expect.element(screen.getByText('true', { exact: true })).toBeVisible()
    })

    test('renders null values', async () => {
      const screen = await renderLightTree()
      await expect.element(screen.getByText('null', { exact: true })).toBeVisible()
    })

    test('renders array elements', async () => {
      const { container } = await renderLightTree()
      const arrayIndicator = Array.from(container.querySelectorAll('.properties')).find((el) =>
        /elements?/.test(el.textContent ?? '')
      )

      expect(arrayIndicator).toBeTruthy()
    })

    test('renders nested objects', async () => {
      const screen = await renderLightTree()
      await expect.element(screen.getByText('nestedObject')).toBeVisible()
    })
  })

  describe('CSS classes and styling', () => {
    test('data-key has the expected styling', async () => {
      const { container } = await renderLightTree()
      const style = styleOf(container.querySelector('.data-key'), '.data-key')

      expect(style.cursor).toBe('pointer')
      expect(style.fontWeight).toBe('600')
    })

    test('value-key has the expected styling', async () => {
      const { container } = await renderLightTree()
      const style = styleOf(container.querySelector('.value-key'), '.value-key')

      expect(style.fontWeight).toBe('600')
      expect(style.marginLeft).toBe('10px')
    })

    test('non-root json-view-item has the expected indentation', async () => {
      const { container } = await renderLightTree()
      const items = container.querySelectorAll('.json-view-item:not(.root-item)')

      if (items.length > 0) {
        expect(styleOf(items[0], '.json-view-item:not(.root-item)').marginLeft).toBe('15px')
      }
    })
  })

  describe('Dark theme comparison', () => {
    test('renders tree structure in both color schemes', async () => {
      const light = await renderLightTree()
      const dark = await renderDarkTree()

      expect(light.container.querySelectorAll('.data-key').length).toBeGreaterThan(0)
      expect(dark.container.querySelectorAll('.data-key').length).toBeGreaterThan(0)
    })

    test('applies different CSS variable-derived colors per color scheme', async () => {
      const light = await renderLightTree()
      const dark = await renderDarkTree()

      const lightColor = styleOf(
        light.container.querySelector('.data-key'),
        '.data-key (light)'
      ).color
      const darkColor = styleOf(dark.container.querySelector('.data-key'), '.data-key (dark)').color

      expect(lightColor).not.toBe(darkColor)
    })
  })
})
