import { variantMatcher } from '../utils'
import { Variant } from '@unocss/core'

export const variants: Variant[] = [
  zoomVariant(),
  variantMatcher('span', input => ({
    selector: `${input.selector} span`,
  })),
]

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
