import { boxShadowsBase, outlineBase, ringBase, transformBase } from '../rules'

export const preflightBase = {
  ...outlineBase,
  ...transformBase,
  ...boxShadowsBase,
  ...ringBase,
}
