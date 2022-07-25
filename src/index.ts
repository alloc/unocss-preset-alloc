import type { Postprocessor, Preset, PresetOptions } from '@unocss/core'
import * as alloc from './alloc'
import { rules } from './rules'
import type { Theme, ThemeAnimation } from './theme'
import { theme } from './theme'
import { variants } from './variants'

export { theme, colors } from './theme'
export { parseColor } from './utils'

export type { ThemeAnimation, Theme }

export interface Options extends PresetOptions {
  /**
   * @default 'class'
   */
  dark?: 'class' | 'media'
  /**
   * @default false
   */
  attributifyPseudo?: Boolean
  /**
   * @default 'un-'
   */
  variablePrefix?: string
}

export const unocssPreset = (options: Options = {}): Preset<Theme> => {
  options.dark = options.dark ?? 'class'
  options.attributifyPseudo = options.attributifyPseudo ?? false

  theme.preflightBase = {
    ...theme.preflightBase,
    ...alloc.preflightBase,
  }

  return {
    name: 'unocss-preset-alloc',
    theme,
    rules: [...alloc.rules, ...rules],
    variants: [...alloc.variants, ...variants(options)],
    options,
    postprocess:
      options.variablePrefix && options.variablePrefix !== 'un-'
        ? VarPrefixPostprocessor(options.variablePrefix)
        : undefined,
  }
}

export default unocssPreset

function VarPrefixPostprocessor(prefix: string): Postprocessor {
  return obj => {
    obj.entries.forEach(i => {
      i[0] = i[0].replace(/^--un-/, `--${prefix}`)
      if (typeof i[1] === 'string')
        i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`)
    })
  }
}
