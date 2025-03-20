import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, handler as h } from '../utils'
import { varEmpty } from './static'

export const boxShadowsBase = {
  '--un-shadow-color': varEmpty,
  '--un-shadow-inset': varEmpty,
}

export const boxShadows: Rule<Theme>[] = [
  [
    /^shadow-\[(.+)\]$/,
    ([, shadow], { theme }) => {
      return {
        'box-shadow': `var(--un-shadow-inset) ${shadow.replace(/_/g, ' ')} var(--un-shadow-color)`,
      }
    },
    { autocomplete: 'shadow-$boxShadow' },
  ],

  // color
  [
    /^shadow-color-(.+)$/,
    colorResolver('--un-shadow-color', 'shadow'),
    { autocomplete: 'shadow-$colors' },
  ],
  [
    /^shadow-opacity-(.+)$/,
    ([, opacity]) => ({ '--un-shadow-opacity': h.bracket.percent(opacity) }),
    { autocomplete: 'shadow-(op|opacity)-<percent>' },
  ],

  // inset
  ['shadow-inset', { '--un-shadow-inset': 'inset' }],
]
