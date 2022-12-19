import { Rule } from '@unocss/core'
import { h } from '../../utils'

export const background: Rule[] = [
  [/^bg-image-(.+)$/, ([, d]) => ({ 'background-image': h.bracket(d) })],
  ['bg-repeat-x', { 'background-repeat': 'repeat-x' }],
  ['bg-bottom', { 'background-position': 'bottom' }],
]
