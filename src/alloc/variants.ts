import { variantMatcher } from '../utils'
import { Variant } from '@unocss/core'

export const variants: Variant[] = [
  zoomVariant(),
  attributeVariant(),
  variantMatcher('span', input => ({
    selector: `${input.selector} span, ${input.selector} a`,
  })),
  variantMatcher('loading', input => ({
    parent: `${input.parent ?? ''}.loading`,
  })),
  variantMatcher('scrollbar-thumb', input => ({
    selector: `${input.selector}::-webkit-scrollbar-thumb`,
  })),
  variantMatcher('slider-thumb', input => ({
    selector: `${input.selector}::-webkit-slider-thumb`,
  })),
]

function zoomVariant(): Variant {
  return {
    name: 'zoom',
    match(input: string) {
      const match = /^zoom-(-?\d+(?:\.\d+)?)$/.exec(input)
      if (match) {
        return {
          matcher: 'text-' + match[1],
          selector(input) {
            return `${input} > *`
          },
        }
      }
    },
  }
}

function attributeVariant(): Variant {
  return {
    name: 'attribute',
    match(input) {
      const match = input.match(/^\[([\w-]+)=?(.*)\]:(.*)$/)
      if (!match) {
        return
      }
      const attributeName = match[1]
      const attributeValue = match[2] ? `="${match[2]}"` : ''
      return {
        matcher: match[3],
        selector: s => `[${attributeName}${attributeValue}]${s}`,
      }
    },
  }
}
