import type {
  VariantHandler,
  VariantHandlerContext,
  VariantObject,
} from '@unocss/core'
import { escapeRegExp } from '@unocss/core'

export const variantMatcher = (
  name: string,
  handler: (input: VariantHandlerContext) => Partial<VariantHandlerContext>
): VariantObject => {
  const re = new RegExp(`^${escapeRegExp(name)}:`)
  return {
    name,
    match: (input: string): VariantHandler | undefined => {
      const match = input.match(re)
      if (match) {
        return {
          matcher: input.slice(match[0].length),
          handle(input, next) {
            input = next(input)
            return {
              ...input,
              ...onlyDefinedProperties(handler(input)),
            }
          },
        }
      }
    },
    autocomplete: `${name}:`,
  }
}

function onlyDefinedProperties<T extends object>(obj: T): Required<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as any
}

export const variantParentMatcher = (
  name: string,
  parent: string
): VariantObject => {
  const re = new RegExp(`^${escapeRegExp(name)}:`)
  return {
    name,
    match: (input: string): VariantHandler | undefined => {
      const match = input.match(re)
      if (match) {
        return {
          matcher: input.slice(match[0].length),
          handle: (input, next) =>
            next({
              ...input,
              parent: `${input.parent ? `${input.parent} $$ ` : ''}${parent}`,
            }),
        }
      }
    },
    autocomplete: `${name}:`,
  }
}
