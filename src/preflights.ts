import type { Preflight, PreflightContext } from '@unocss/core'
import { entriesToCss } from '@unocss/core'
import * as alloc from './alloc'
import type { Theme } from './theme'
import { outlinePreflight } from './rules'

export const preflights: Preflight[] = [
  {
    layer: 'preflights',
    getCSS(ctx: PreflightContext<Theme>) {
      if (ctx.theme.preflightBase) {
        const css = entriesToCss(
          Object.entries({
            ...ctx.theme.preflightBase,
            ...alloc.preflightBase,
          })
        )
        return `*,::before,::after{${css}}::backdrop{${css}}${outlinePreflight}`
      }
    },
  },
]
