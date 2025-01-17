import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, globalKeywords, handler as h } from '../utils'

export const outlineBase = {
  '--un-border-radius': '0',
  '--un-outline-color': 'transparent',
  '--un-outline-width': '0px',
  '--un-outline-style': 'solid',
  '--un-outline-position': '0',
}

export const outlinePreflight = /* css */ `
.outline-center, .outline-inside, .outline-outside {
  position: relative;
}
.outline-center::before, .outline-inside::before, .outline-outside::before {
  content: '';
  position: absolute;
  pointer-events: none;
  border: var(--un-outline-width) var(--un-outline-style) var(--un-outline-color);
  border-radius: calc(var(--un-border-radius) + (var(--un-outline-position) * var(--un-outline-width)));
  inset: calc(var(--un-outline-position) * var(--un-outline-width));
}
`

export const outline: Rule<Theme>[] = [
  // size
  [
    /^outline-(?:width-|size-)?(.+)$/,
    ([, d], { theme, symbols }) => ([{
      '--un-outline-width': theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d),
    }, {
      [symbols.parent]: '.outline::before'
    }]),
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
      '--un-outline-position': d,
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
