import { Rule } from '@unocss/core'

export const containment: Rule[] = [
  ['contain-layout', { contain: 'layout' }],
  ['contain-paint', { contain: 'paint' }],
  ['contain-content', { contain: 'content' }],
]
