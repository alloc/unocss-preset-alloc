import { Rule } from '@unocss/core'
import { h } from '../utils'
import { positionMap } from '../utils'
import { filters } from './rules/filters'

export const rules: Rule[] = [
  ...filters,

  // background gradients
  [/^bg-image-(.+)$/, ([, d]) => ({ 'background-image': h.bracket(d) })],

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
]
