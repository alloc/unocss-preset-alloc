import { variantMatcher } from '../utils'
import { Variant } from '@unocss/core'

export const variants: Variant[] = [
  variantMatcher('span', input => ({
    selector: `${input.selector} span`,
  })),
]
