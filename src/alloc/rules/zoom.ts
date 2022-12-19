import { Rule, toArray } from '@unocss/core'
import { Theme } from '../../../theme'
import { h } from '../../utils'

export const zoom: Rule<Theme> = [
  /^zoom-(.+)$/,
  ([, s = 'base'], { theme }) => {
    const themed = toArray(theme.fontSize?.[s])
    if (themed?.[0]) {
      const [size, height = '1'] = themed
      return {
        'font-size': size,
        'line-height': height,
      }
    }

    return { 'font-size': h.bracketOfLength.rem(s) }
  },
  { autocomplete: 'zoom-$fontSize' },
]
