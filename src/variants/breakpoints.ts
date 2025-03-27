import type { Variant } from '@unocss/core'
import { resolveBreakpoints } from '../utils'
import type { Theme } from '../theme'

const regexCache: Record<string, RegExp> = {}

export const variantBreakpoints: Variant<Theme> = {
  name: 'breakpoints',
  match(matcher, context) {
    const variantEntries: Array<[string, string, number]> = Object.entries(
      resolveBreakpoints(context) ?? {}
    ).map(([point, size], idx) => [point, size, idx])
    for (const [point, size, idx] of variantEntries) {
      if (!regexCache[point])
        regexCache[point] = new RegExp(`^((?:[al]t-)?${point}[:-])`)

      const match = matcher.match(regexCache[point])
      if (!match) continue

      const [, pre] = match

      const m = matcher.slice(pre.length)
      // container rule is responsive, but also is breakpoint aware
      // it is handled on its own module (container.ts) and so we
      // exclude it from here
      if (m === 'container') continue

      const isLtPrefix = pre.startsWith('lt-')
      const isAtPrefix = pre.startsWith('at-')

      let order = 1000 // parseInt(size)

      if (isLtPrefix) {
        // lt-md means max-width of sm breakpoint
        // Only valid if there's a previous breakpoint
        if (idx <= 0)
          continue

        order -= idx + 1
        return {
          matcher: m,
          handle: (input, next) =>
            next({
              ...input,
              parent: `${
                input.parent ? `${input.parent} $$ ` : ''
              }@media (max-width: ${variantEntries[idx - 1][1]})`,
              parentOrder: order,
            }),
        }
      }

      order += idx + 1

      // at-md means min-width of sm+0.1 and max-width of md
      if (isAtPrefix) {
        if (idx <= 0)
          continue

        return {
          matcher: m,
          handle: (input, next) => {
            const prevSize = variantEntries[idx - 1][1]
            const value = prevSize.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || ''
            const unit = prevSize.slice(value.length)
            const minWidth = parseFloat(value) + 0.1
            const minWidthValue = Number.isNaN(minWidth) ? prevSize : `${minWidth}${unit}`

            return next({
              ...input,
              parent: `${
                input.parent ? `${input.parent} $$ ` : ''
              }@media (min-width: ${minWidthValue}) and (max-width: ${size})`,
              parentOrder: order,
            })
          },
        }
      }

      // Regular breakpoint (e.g., md) means max-width of md
      return {
        matcher: m,
        handle: (input, next) =>
          next({
            ...input,
            parent: `${
              input.parent ? `${input.parent} $$ ` : ''
            }@media (max-width: ${size})`,
            parentOrder: order,
          }),
      }
    }
  },
  multiPass: true,
  autocomplete: '(at-|lt-|)$breakpoints:',
}
