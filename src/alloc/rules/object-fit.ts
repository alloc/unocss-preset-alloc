import { Rule } from '@unocss/core'
import { positionMap } from '../../utils'

export const objectFit: Rule[] = [
  ['object-cover', { 'object-fit': 'cover' }],
  ['object-contain', { 'object-fit': 'contain' }],
  ['object-fill', { 'object-fit': 'fill' }],
  ['object-scale-down', { 'object-fit': 'scale-down' }],
  ['object-none', { 'object-fit': 'none' }],
]

export const objectPosition: Rule = [
  /^object-([-\w]+)$/,
  ([, s]) => ({ 'object-position': positionMap[s] }),
]
