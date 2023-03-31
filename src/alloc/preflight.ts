import { filterBase, backdropFilterBase } from './rules/filters'
import { scrollSnapTypeBase } from './rules/scroll'
import { touchActionBase } from './rules/touch-actions'

export const preflightBase = {
  ...filterBase,
  ...backdropFilterBase,
  ...scrollSnapTypeBase,
  ...touchActionBase,
}
