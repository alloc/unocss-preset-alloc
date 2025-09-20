import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, globalKeywords, handler as h, makeGlobalStaticRules } from '../utils'

export const outlinePreflight = /* css */ `
.outline-center,
.outline-inside,
.outline-outside {
  position: relative;
}
.outline-center::before,
.outline-inside::before,
.outline-outside::before {
  content: '';
  position: absolute;
  pointer-events: none;
  border: var(--un-outline-width) var(--un-outline-style, solid) var(--un-outline-color);
  border-top-left-radius: calc(var(--un-border-top-left-radius, 0px) - (var(--un-outline-position) * var(--un-outline-width)));
  border-top-right-radius: calc(var(--un-border-top-right-radius, 0px) - (var(--un-outline-position) * var(--un-outline-width)));
  border-bottom-left-radius: calc(var(--un-border-bottom-left-radius, 0px) - (var(--un-outline-position) * var(--un-outline-width)));
  border-bottom-right-radius: calc(var(--un-border-bottom-right-radius, 0px) - (var(--un-outline-position) * var(--un-outline-width)));
  inset: calc(var(--un-outline-position) * var(--un-outline-width));
}
`

export const outline: Rule<Theme>[] = [
  // size
  [
    /^outline-(?:width-|size-)?(.+)$/,
    ([, d], { theme }) => ({
      '--un-outline-width': theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d),
    }),
    { autocomplete: 'outline-(width|size)-<num>' },
  ],

  // color
  [
    /^outline-(?:color-)?(.+)$/,
    colorResolver('--un-outline-color', 'outline-color'),
    { autocomplete: 'outline-$colors' },
  ],

  // offset
  [
    /^outline-offset-(.+)$/,
    ([, d], { theme }) => ({
      '--un-outline-offset': theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d),
    }),
    { autocomplete: 'outline-(offset)-<num>' },
  ],

  // position
  [
    /^outline-(center|inside|outside)$/,
    ([, d]) => ({
      '--un-outline-position': d === 'center' ? '-0.5' : d === 'inside' ? '0' : '-1',
    }),
  ],

  // style
  ...[
    'auto',
    'dashed',
    'dotted',
    'double',
    'hidden',
    'solid',
    'groove',
    'ridge',
    'inset',
    'outset',
    ...globalKeywords,
  ].map(v => [`outline-${v}`, { '--un-outline-style': v }] as Rule<Theme>),
]

export const appearance: Rule[] = [
  [
    'appearance-none',
    {
      appearance: 'none',
      '-webkit-appearance': 'none',
    },
  ],
]

const willChangeProperty = (prop: string): string | undefined => {
  return (
    h.properties.auto.global(prop) ??
    {
      contents: 'contents',
      scroll: 'scroll-position',
    }[prop]
  )
}

export const willChange: Rule[] = [
  [/^will-change-(.+)/, ([, p]) => ({ 'will-change': willChangeProperty(p) })],
]

const listStyles: Record<string, string> = {
  'disc': 'disc',
  'circle': 'circle',
  'square': 'square',
  'decimal': 'decimal',
  'zero-decimal': 'decimal-leading-zero',
  'greek': 'lower-greek',
  'roman': 'lower-roman',
  'upper-roman': 'upper-roman',
  'alpha': 'lower-alpha',
  'upper-alpha': 'upper-alpha',
  'latin': 'lower-latin',
  'upper-latin': 'upper-latin',
}

export const listStyle: Rule<Theme>[] = [
  // base
  [/^list-(.+?)(?:-(outside|inside))?$/, ([, alias, position]) => {
    const style = listStyles[alias]
    if (style) {
      if (position) {
        return {
          'list-style-position': position,
          'list-style-type': style,
        }
      }
      return { 'list-style-type': style }
    }
  }, { autocomplete: [`list-(${Object.keys(listStyles).join('|')})`, `list-(${Object.keys(listStyles).join('|')})-(outside|inside)`] }],
  // styles
  ['list-outside', { 'list-style-position': 'outside' }],
  ['list-inside', { 'list-style-position': 'inside' }],
  ['list-none', { 'list-style-type': 'none' }],
  // image
  [/^list-image-(.+)$/, ([, d]) => {
    if (/^\[url\(.+\)\]$/.test(d))
      return { 'list-style-image': h.bracket(d) }
  }],
  ['list-image-none', { 'list-style-image': 'none' }],
  ...makeGlobalStaticRules('list', 'list-style-type'),
]
