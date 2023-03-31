import { variantMatcher } from '../utils'
import { Variant } from '@unocss/core'

export const variants: Variant[] = [
  ...deviceVariants(),
  zoomVariant(),
  variantMatcher('span', input => ({
    selector: `${input.selector} span, ${input.selector} a`,
  })),
  variantMatcher('loading', input => ({
    selector: `.loading ${input.selector}`,
  })),
  variantMatcher('scrollbar-thumb', input => ({
    selector: `${input.selector}::-webkit-scrollbar-thumb`,
  })),
]

function deviceVariants(): Variant[] {
  return ['xl', 'tablet', 'phone', 'xs'].map(name =>
    variantMatcher(name, input => ({
      selector: `html.${name} ${input.selector}`,
    }))
  )
}

function zoomVariant(): Variant {
  return {
    name: 'zoom',
    match(input: string) {
      if (input.startsWith('zoom-')) {
        return {
          matcher: input,
          selector(input) {
            return `${input} > *`
          },
        }
      }
    },
  }
}
