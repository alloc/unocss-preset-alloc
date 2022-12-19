import { Rule, toArray } from '@unocss/core'
import { Theme } from '../../theme'
import { h } from '../utils'
import { positionMap } from '../utils'
import { filters } from './rules/filters'
import { scrollSnap } from './rules/scroll-snap'

export const rules: Rule<Theme>[] = [
  ...filters,
  ...scrollSnap,

  // font styles
  ['tabnum', { 'font-feature-settings': 'tnum' }],
  [
    /^line-clamp-(\d+)$/,
    ([, lines]) => ({
      display: '-webkit-box',
      overflow: 'hidden',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': lines,
    }),
  ],

  // scrolling
  ['no-overscroll', { 'overscroll-behavior': 'contain' }],
  [
    'no-scrollbars',
    {
      'scrollbar-width': 'none', // Firefox
      '-ms-overflow-style': 'none', // Edge
    },
  ],

  // content visibility
  ['content-visibility-auto', { 'content-visibility': 'auto' }],

  // background gradients
  [/^bg-image-(.+)$/, ([, d]) => ({ 'background-image': h.bracket(d) })],
  ['bg-repeat-x', { 'background-repeat': 'repeat-x' }],
  ['bg-bottom', { 'background-position': 'bottom' }],

  // containment
  ['contain-layout', { contain: 'layout' }],
  ['contain-paint', { contain: 'paint' }],
  ['contain-content', { contain: 'content' }],

  // object fit
  ['object-cover', { 'object-fit': 'cover' }],
  ['object-contain', { 'object-fit': 'contain' }],
  ['object-fill', { 'object-fit': 'fill' }],
  ['object-scale-down', { 'object-fit': 'scale-down' }],
  ['object-none', { 'object-fit': 'none' }],

  // object position
  [/^object-([-\w]+)$/, ([, s]) => ({ 'object-position': positionMap[s] })],

  // em-based scaling
  [
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
  ],
]
