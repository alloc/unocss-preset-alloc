import { Rule } from '@unocss/core'
import { Theme } from '../../theme'
import { background } from './rules/background'
import { containment } from './rules/containment'
import { contentVisibility } from './rules/content-visibility'
import { filters } from './rules/filters'
import { noOverScroll, noScrollBars, scrollSnap } from './rules/scroll'
import { lineClamp, tabularNums } from './rules/text'
import { objectFit, objectPosition } from './rules/object-fit'
import { zoom } from './rules/zoom'
import { touchActions } from './rules/touch-actions'

export const rules: Rule<Theme>[] = [
  ...background,
  ...containment,
  ...filters,
  ...objectFit,
  ...scrollSnap,
  ...touchActions,
  contentVisibility,
  lineClamp,
  noOverScroll,
  noScrollBars,
  objectPosition,
  tabularNums,
  zoom,
]
