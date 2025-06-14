import { Rule } from '@unocss/core'

export const tabularNums: Rule = ['tabnum', { 'font-feature-settings': '"tnum"' }]

export const lineClamp: Rule = [
  /^line-clamp-(\d+)$/,
  ([, lines]) => ({
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': lines,
  }),
]

export const textReset: Rule = [
  'text-reset',
  {
    'font-size': 'var(--root-font-size)',
  },
]
