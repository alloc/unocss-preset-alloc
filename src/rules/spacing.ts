import type { Rule } from '@unocss/core'
import { directionSize } from '../utils'

export const paddings: Rule[] = [
  [
    /^p()-(-?.+)$/,
    directionSize('padding'),
    { autocomplete: ['(m|p)<num>', '(m|p)-<num>'] },
  ],
  [/^p([xy])-(-?.+)$/, directionSize('padding')],
  [
    /^p([rltbse])-(-?.+)$/,
    directionSize('padding'),
    { autocomplete: '(m|p)<directions>-<num>' },
  ],
  [
    /^p-(block|inline)-(-?.+)/,
    directionSize('padding'),
    { autocomplete: '(m|p)-(block|inline)-<num>' },
  ],
  [
    /^p([bi][se])-(-?.+)$/,
    directionSize('padding'),
    { autocomplete: '(m|p)-(bs|be|is|ie)-<num>' },
  ],
]

export const margins: Rule[] = [
  [/^m()-(-?.+)$/, directionSize('margin')],
  [/^m([xy])-(-?.+)$/, directionSize('margin')],
  [/^m([rltbse])-(-?.+)$/, directionSize('margin')],
  [/^m-(block|inline)-(-?.+)$/, directionSize('margin')],
  [/^m([bi][se])-(-?.+)$/, directionSize('margin')],
]
