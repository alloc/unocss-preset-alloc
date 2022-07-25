import type { CSSValues, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../../theme'
import { varEmpty } from '../../rules'
import {
  colorResolver,
  colorableShadows,
  globalKeywords,
  handler as h,
} from '../../utils'

export const filterBase = {
  '--un-blur': varEmpty,
  '--un-brightness': varEmpty,
  '--un-contrast': varEmpty,
  '--un-drop-shadow': varEmpty,
  '--un-grayscale': varEmpty,
  '--un-hue-rotate': varEmpty,
  '--un-invert': varEmpty,
  '--un-saturate': varEmpty,
  '--un-sepia': varEmpty,
}
const filterProperty =
  'var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)'

export const backdropFilterBase = {
  '--un-backdrop-blur': varEmpty,
  '--un-backdrop-brightness': varEmpty,
  '--un-backdrop-contrast': varEmpty,
  '--un-backdrop-grayscale': varEmpty,
  '--un-backdrop-hue-rotate': varEmpty,
  '--un-backdrop-invert': varEmpty,
  '--un-backdrop-opacity': varEmpty,
  '--un-backdrop-saturate': varEmpty,
  '--un-backdrop-sepia': varEmpty,
}
const backdropFilterProperty =
  'var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)'

const percentWithDefault = (str?: string) => {
  let v = h.bracket.cssvar(str || '')
  if (v != null) return v

  v = str ? h.percent(str) : '1'
  if (v != null && parseFloat(v) <= 1) return v
}

const toFilter =
  (
    varName: string,
    resolver: (str: string, theme: Theme) => string | undefined
  ) =>
  (
    [, b, s]: string[],
    { theme }: RuleContext<Theme>
  ): CSSValues | undefined => {
    const value = resolver(s, theme) ?? (s === 'none' ? '0' : '')
    if (value !== '') {
      if (b) {
        return {
          [`--un-${b}${varName}`]: `${varName}(${value})`,
          '-webkit-backdrop-filter': backdropFilterProperty,
          'backdrop-filter': backdropFilterProperty,
        }
      } else {
        return {
          [`--un-${varName}`]: `${varName}(${value})`,
          filter: filterProperty,
        }
      }
    }
  }

const dropShadowResolver = ([, s]: string[], { theme }: RuleContext<Theme>) => {
  let v = theme.dropShadow?.[s || 'DEFAULT']
  if (v != null) {
    const shadows = colorableShadows(v, '--un-drop-shadow-color')
    return {
      '--un-drop-shadow': `drop-shadow(${shadows.join(') drop-shadow(')})`,
      filter: filterProperty,
    }
  }

  v = h.bracket.cssvar(s)
  if (v != null) {
    return {
      '--un-drop-shadow': `drop-shadow(${v})`,
      filter: filterProperty,
    }
  }
}

export const filters: Rule<Theme>[] = [
  // filters
  [
    /^(?:(backdrop-)|filter-)?blur(?:-(.+))?$/,
    toFilter(
      'blur',
      (s, theme) => theme.blur?.[s || 'DEFAULT'] || h.bracket.cssvar.px(s)
    ),
  ],
  [
    /^(?:(backdrop-)|filter-)?brightness-(.+)$/,
    toFilter('brightness', s => h.bracket.cssvar.percent(s)),
  ],
  [
    /^(?:(backdrop-)|filter-)?contrast-(.+)$/,
    toFilter('contrast', s => h.bracket.cssvar.percent(s)),
  ],
  // drop-shadow only on filter
  [/^(?:filter-)?drop-shadow(?:-(.+))?$/, dropShadowResolver],
  [
    /^(?:filter-)?drop-shadow-color-(.+)$/,
    colorResolver('--un-drop-shadow-color', 'drop-shadow'),
  ],
  [
    /^(?:filter-)?drop-shadow-color-op(?:acity)?-?(.+)$/,
    ([, opacity]) => ({
      '--un-drop-shadow-opacity': h.bracket.percent(opacity),
    }),
  ],
  [
    /^(?:(backdrop-)|filter-)?grayscale(?:-(.+))?$/,
    toFilter('grayscale', percentWithDefault),
  ],
  [
    /^(?:(backdrop-)|filter-)?hue-rotate-(.+)$/,
    toFilter('hue-rotate', s => h.bracket.cssvar.degree(s)),
  ],
  [
    /^(?:(backdrop-)|filter-)?invert(?:-(.+))?$/,
    toFilter('invert', percentWithDefault),
  ],
  // opacity only on backdrop-filter
  [
    /^(backdrop-)op(?:acity)-(.+)$/,
    toFilter('opacity', s => h.bracket.cssvar.percent(s)),
  ],
  [
    /^(?:(backdrop-)|filter-)?saturate-(.+)$/,
    toFilter('saturate', s => h.bracket.cssvar.percent(s)),
  ],
  [
    /^(?:(backdrop-)|filter-)?sepia(?:-(.+))?$/,
    toFilter('sepia', percentWithDefault),
  ],

  // base
  ['filter', { filter: filterProperty }],
  [
    'backdrop-filter',
    {
      '-webkit-backdrop-filter': backdropFilterProperty,
      'backdrop-filter': backdropFilterProperty,
    },
  ],

  // nones
  ['filter-none', { filter: 'none' }],
  [
    'backdrop-filter-none',
    {
      '-webkit-backdrop-filter': 'none',
      'backdrop-filter': 'none',
    },
  ],

  ...globalKeywords.map(
    keyword => [`filter-${keyword}`, { filter: keyword }] as Rule
  ),
  ...globalKeywords.map(
    keyword =>
      [
        `backdrop-filter-${keyword}`,
        {
          '-webkit-backdrop-filter': keyword,
          'backdrop-filter': keyword,
        },
      ] as Rule
  ),
]
