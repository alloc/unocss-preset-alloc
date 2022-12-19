import { filterBase } from './rules/filters'
import { scrollSnapTypeBase } from './rules/scroll'

export const preflightBase = {
  ...filterBase,
  ...scrollSnapTypeBase,
}
