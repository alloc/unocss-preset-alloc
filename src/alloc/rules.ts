import { Rule } from '@unocss/core'
import { Theme } from '../../theme'
import { background } from './rules/background'
import { containment, isolation } from './rules/containment'
import { contentVisibility } from './rules/content-visibility'
import { filters } from './rules/filters'
import { noOverScroll, noScrollBars, scrollSnap } from './rules/scroll'
import { lineClamp, tabularNums, textReset } from './rules/text'
import { objectFit, objectPosition } from './rules/object-fit'
import { touchActions } from './rules/touch-actions'

export const rules: Rule<Theme>[] = [
  ...background,
  ...containment,
  ...filters,
  ...objectFit,
  ...scrollSnap,
  ...touchActions,
  isolation,
  contentVisibility,
  lineClamp,
  noOverScroll,
  noScrollBars,
  objectPosition,
  tabularNums,
  textReset,
]
