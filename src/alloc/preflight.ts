import { filterBase } from './rules/filters'
import { scrollSnapTypeBase } from './rules/scroll-snap'

export const preflightBase = {
  ...filterBase,
  ...scrollSnapTypeBase,
}
