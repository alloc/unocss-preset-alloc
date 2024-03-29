import type { Postprocessor, Preset, PresetOptions } from '@unocss/core'
import * as alloc from './alloc'
import { preflights } from './preflights'
import { rules } from './rules'
import type { Theme, ThemeAnimation } from './theme'
import { theme } from './theme'
import { variants } from './variants'
import { variantMatcher } from './utils'

export { preflights } from './preflights'
export { theme, colors } from './theme'
export { parseColor } from './utils'

export type { ThemeAnimation, Theme }

export interface DarkModeSelectors {
  /**
   * Selector for light variant.
   *
   * @default '.light'
   */
  light?: string

  /**
   * Selector for dark variant.
   *
   * @default '.dark'
   */
  dark?: string
}

export interface Options extends PresetOptions {
  /**
   * Dark mode options
   *
   * @default 'class'
   */
  dark?: 'class' | 'media' | DarkModeSelectors
  /**
   * Generate pesudo selector as `[group=""]` instead of `.group`
   *
   * @default false
   */
  attributifyPseudo?: Boolean
  /**
   * Prefix for CSS variables.
   *
   * @default 'un-'
   */
  variablePrefix?: string
  /**
   * Utils prefix
   *
   * @default undefined
   */
  prefix?: string
  /**
   * An array of class names attached to the `html` element which may be used as
   * UnoCSS variant prefixes for userAgent-specific layout.
   */
  userAgentClasses?: string[]
}

export const unocssPreset = (options: Options = {}): Preset<Theme> => {
  options.dark = options.dark ?? 'class'
  options.attributifyPseudo = options.attributifyPseudo ?? false

  const userAgentVariants = options.userAgentClasses
    ? options.userAgentClasses.map(name =>
        variantMatcher(name, input => ({
          selector: `html.${name} ${input.selector}`,
        }))
      )
    : []

  return {
    name: 'unocss-preset-alloc',
    theme,
    rules: [...alloc.rules, ...rules],
    variants: [...alloc.variants, ...variants(options), ...userAgentVariants],
    options,
    postprocess:
      options.variablePrefix && options.variablePrefix !== 'un-'
        ? VarPrefixPostprocessor(options.variablePrefix)
        : undefined,
    preflights,
    prefix: options.prefix,
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
