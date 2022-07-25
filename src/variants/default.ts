import type { Variant } from '@unocss/core'
import type { Options } from '..'
import type { Theme } from '../theme'
import { variantBreakpoints } from './breakpoints'
import { variantCombinators } from './combinators'
import { variantColorsMediaOrClass } from './dark'
import { variantLanguageDirections } from './directions'
import { variantImportant, variantLayer, variantNegative } from './misc'
import { variantMotions, variantOrientations, variantPrint } from './media'
import { partClasses, variantPseudoClassFunctions, variantPseudoClasses, variantPseudoElements, variantTaggedPseudoClasses } from './pseudo'

export const variants = (options: Options): Variant<Theme>[] => [
  variantLayer,
  variantNegative,
  variantImportant,
  variantPrint,
  ...variantOrientations,
  ...variantMotions,
  variantBreakpoints,
  ...variantCombinators,
  variantPseudoClasses,
  variantPseudoClassFunctions,
  ...variantTaggedPseudoClasses(options),
  variantPseudoElements,
  partClasses,
  ...variantColorsMediaOrClass(options),
  ...variantLanguageDirections,
]
