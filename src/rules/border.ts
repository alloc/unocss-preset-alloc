import type { CSSEntries, CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import {
  colorOpacityToString,
  colorToString,
  cornerMap,
  directionMap,
  globalKeywords,
  handler as h,
  hasParseableColor,
  parseColor,
} from '../utils'

export const borderStyles = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'none',
  'groove',
  'ridge',
  'inset',
  'outset',
  ...globalKeywords,
]

export const borders: Rule[] = [
  // compound
  [
    /^border()-(.+)$/,
    handlerBorder,
    { autocomplete: '(border|b)-<directions>' },
  ],
  [/^border-([xy])-(.+)$/, handlerBorder],
  [/^border-([rltbse])-(.+)$/, handlerBorder],
  [/^border-(block|inline)-(.+)$/, handlerBorder],
  [/^border-([bi][se])-(.+)$/, handlerBorder],

  // size
  [
    /^border-()(?:width|size)-(.+)$/,
    handlerBorderSize,
    { autocomplete: ['(border|b)-<num>', '(border|b)-<directions>-<num>'] },
  ],
  [/^border-([xy])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^border-([rltbse])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^border-(block|inline)-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^border-([bi][se])-(?:width|size)-(.+)$/, handlerBorderSize],

  // colors
  [
    /^border-()(.+)$/,
    handlerBorderColor,
    { autocomplete: ['(border|b)-$colors', '(border|b)-<directions>-$colors'] },
  ],
  [/^border-([xy])-(.+)$/, handlerBorderColor],
  [/^border-([rltbse])-(.+)$/, handlerBorderColor],
  [/^border-(block|inline)-(.+)$/, handlerBorderColor],
  [/^border-([bi][se])-(.+)$/, handlerBorderColor],

  // opacity
  [
    /^border-()opacity-(.+)$/,
    handlerBorderOpacity,
    { autocomplete: '(border|b)-(op|opacity)-<percent>' },
  ],
  [/^border-([xy])-opacity-(.+)$/, handlerBorderOpacity],
  [/^border-([rltbse])-opacity-(.+)$/, handlerBorderOpacity],
  [/^border-(block|inline)-opacity-(.+)$/, handlerBorderOpacity],
  [/^border-([bi][se])-opacity-(.+)$/, handlerBorderOpacity],

  // radius
  [
    /^rounded()-(.+)$/,
    handlerRounded,
    {
      autocomplete: [
        '(border|b)-(rounded|rd)',
        '(border|b)-(rounded|rd)-<num>',
        '(rounded|rd)',
        '(rounded|rd)-<num>',
      ],
    },
  ],
  [/^rounded-([rltb])-(.+)$/, handlerRounded],
  [/^rounded-([rltb]{2})-(.+)$/, handlerRounded],
  [/^rounded-([bi][se])-(.+)$/, handlerRounded],
  [/^rounded-([bi][se]-[bi][se])-(.+)$/, handlerRounded],

  // style
  [
    /^border-(?:style-)?()(.+)$/,
    handlerBorderStyle,
    {
      autocomplete: [
        '(border|b)-style',
        `(border|b)-(${borderStyles.join('|')})`,
        '(border|b)-<directions>-style',
        `(border|b)-<directions>-(${borderStyles.join('|')})`,
        `(border|b)-<directions>-style-(${borderStyles.join('|')})`,
        `(border|b)-style-(${borderStyles.join('|')})`,
      ],
    },
  ],
  [/^border-([xy])-(.+)$/, handlerBorderStyle],
  [/^border-([rltbse])-(.+)$/, handlerBorderStyle],
  [/^border-(block|inline)-(.+)$/, handlerBorderStyle],
  [/^border-([bi][se])-(.+)$/, handlerBorderStyle],
]

const borderColorResolver =
  (direction: string) =>
  ([, body]: string[], theme: Theme): CSSObject | undefined => {
    const data = parseColor(body, theme)

    if (!data) return

    const { alpha, color, cssColor } = data

    if (cssColor) {
      if (alpha != null) {
        return {
          [`border${direction}-color`]: colorToString(cssColor, alpha),
        }
      }
      if (direction === '') {
        return {
          '--un-border-opacity': colorOpacityToString(cssColor),
          'border-color': colorToString(cssColor, 'var(--un-border-opacity)'),
        }
      } else {
        return {
          // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
          '--un-border-opacity': colorOpacityToString(cssColor),
          [`--un-border${direction}-opacity`]: 'var(--un-border-opacity)',
          [`border${direction}-color`]: colorToString(
            cssColor,
            `var(--un-border${direction}-opacity)`
          ),
        }
      }
    } else if (color) {
      return {
        [`border${direction}-color`]: colorToString(color, alpha),
      }
    }
  }

function handlerBorder(m: string[], ctx: RuleContext): CSSEntries | undefined {
  const borderSizes = handlerBorderSize(m, ctx)
  const borderStyle = handlerBorderStyle(['', m[1], 'solid'])
  if (borderSizes && borderStyle) {
    return [...borderSizes, ...borderStyle]
  }
}

function handlerBorderSize(
  [, a = '', b]: string[],
  { theme }: RuleContext<Theme>
): CSSEntries | undefined {
  const v =
    theme.lineWidth?.[b || 'DEFAULT'] ?? h.bracket.cssvar.global.px(b || '1')
  if (a in directionMap && v != null)
    return directionMap[a].map(i => [`border${i}-width`, v])
}

function handlerBorderColor(
  [, a = '', c]: string[],
  { theme }: RuleContext<Theme>
): CSSObject | undefined {
  if (a in directionMap && hasParseableColor(c, theme)) {
    return Object.assign(
      {},
      ...directionMap[a].map(i => borderColorResolver(i)(['', c], theme))
    )
  }
}

function handlerBorderOpacity([, a = '', opacity]: string[]):
  | CSSEntries
  | undefined {
  const v = h.bracket.percent(opacity)
  if (a in directionMap && v != null)
    return directionMap[a].map(i => [`--un-border${i}-opacity`, v])
}

function handlerRounded(
  [, a = '', s]: string[],
  { theme }: RuleContext<Theme>
): CSSEntries | undefined {
  const v =
    theme.borderRadius?.[s || 'DEFAULT'] ||
    h.bracket.cssvar.global.fraction.rem(s || '1')
  if (a in cornerMap && v != null)
    return cornerMap[a].flatMap(i => [[`border${i}-radius`, v], [`--un-border${i}-radius`, v]])
}

export function handlerBorderStyle([, a = '', s]: string[]):
  | CSSEntries
  | undefined {
  if (borderStyles.includes(s) && a in directionMap)
    return directionMap[a].map(i => [`border${i}-style`, s])
}
