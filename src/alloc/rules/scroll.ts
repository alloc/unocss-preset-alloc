import { directionSize } from '../../utils'
import { Rule } from '@unocss/core'

export const scrollSnapTypeBase = {
  '--un-scroll-snap-strictness': 'proximity',
}

export const scrollSnap: Rule[] = [
  // snap type
  [
    /^snap-(x|y)$/,
    ([, d]) => ({
      'scroll-snap-type': `${d} var(--un-scroll-snap-strictness)`,
      '-webkit-overflow-scrolling': 'touch',
    }),
    { autocomplete: 'snap-(x|y|both)' },
  ],
  [
    /^snap-both$/,
    () => ({
      'scroll-snap-type': 'both var(--un-scroll-snap-strictness)',
    }),
  ],
  ['snap-mandatory', { '--un-scroll-snap-strictness': 'mandatory' }],
  ['snap-proximity', { '--un-scroll-snap-strictness': 'proximity' }],
  ['snap-none', { 'scroll-snap-type': 'none' }],

  // snap align
  ['snap-start', { 'scroll-snap-align': 'start' }],
  ['snap-end', { 'scroll-snap-align': 'end' }],
  ['snap-center', { 'scroll-snap-align': 'center' }],
  ['snap-align-none', { 'scroll-snap-align': 'none' }],

  // snap stop
  ['snap-normal', { 'scroll-snap-stop': 'normal' }],
  ['snap-always', { 'scroll-snap-stop': 'always' }],

  // scroll margin
  [
    /^scroll-ma?()-?(-?.+)$/,
    directionSize('scroll-margin'),
    {
      autocomplete: [
        'scroll-(m|p|ma|pa|block|inline)',
        'scroll-(m|p|ma|pa|block|inline)-$spacing',
        'scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)',
        'scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)-$spacing',
      ],
    },
  ],
  [/^scroll-m-?([xy])-?(-?.+)$/, directionSize('scroll-margin')],
  [/^scroll-m-?([rltb])-?(-?.+)$/, directionSize('scroll-margin')],
  [/^scroll-m-(block|inline)-(-?.+)$/, directionSize('scroll-margin')],
  [/^scroll-m-?([bi][se])-?(-?.+)$/, directionSize('scroll-margin')],

  // scroll padding
  [/^scroll-pa?()-?(-?.+)$/, directionSize('scroll-padding')],
  [/^scroll-p-?([xy])-?(-?.+)$/, directionSize('scroll-padding')],
  [/^scroll-p-?([rltb])-?(-?.+)$/, directionSize('scroll-padding')],
  [/^scroll-p-(block|inline)-(-?.+)$/, directionSize('scroll-padding')],
  [/^scroll-p-?([bi][se])-?(-?.+)$/, directionSize('scroll-padding')],
]

export const noOverScroll: Rule = [
  'no-overscroll',
  { 'overscroll-behavior': 'contain' },
]

export const noScrollBars: Rule = [
  'no-scrollbars',
  {
    'scrollbar-width': 'none', // Firefox
    '-ms-overflow-style': 'none', // Edge
  },
]
