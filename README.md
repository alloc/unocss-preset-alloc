# unocss-preset-alloc

A fork of `@unocss/preset-mini`

## Features

- Use `em` units by default
- Fallback values for CSS variables
  - i.e. `color-$red|#ff0000` for `color: var(--red, #ff0000)` property

### Rules

- Background images
  - `bg-image-[…]` for `background-image` property
  - `bg-repeat-x` for `background-repeat: repeat-x` property
  - `bg-bottom` for `background-position: bottom` property
- Containment
  - `contain-layout`
  - `contain-paint`
  - `contain-content`
- Content visibility
  - `content-visibility-auto`
- Object fit
  - `object-cover`
  - `object-contain`
  - `object-fill`
  - `object-scale-down`
  - `object-none`
- Object position
  - `object-top`, `object-top-left`, etc
- Scroll snap
  - `snap-x`, `snap-y`, `snap-both`, or `snap-none` for direction
  - `snap-mandatory` or `snap-proximity` for strictness
  - `snap-start`, `snap-end`, `snap-center`, or `snap-align-none` for alignment
  - `snap-normal` or `snap-always` for “snap stops”
  - `scroll-m-…` and `scroll-p-…` for margin/padding
- Overscroll behavior
  - `no-overscroll` for `overscroll-behavior: contain` property
- Scrollbar appearance
  - `no-scrollbars` for `scrollbar-width: none` and `-ms-overflow-style: none` properties
- Tabular numbers
  - `tabnum` for `font-feature-settings: tnum` property
- Line clamping
  - i.e. `line-clamp-2` to use `-webkit-line-clamp` to limit number of wraps to 2 lines
- Touch actions
  - `touch-pan-*` for `touch-action: pan-*` property
  - `touch-pinch-zoom` for `touch-action: pinch-zoom` property
  - `touch-auto` for `touch-action: auto` property
  - `touch-manipulation` for `touch-action: manipulation` property
  - `touch-none` for `touch-action: none` property

### Variants

- Targeting `<span>` and `<a>` descendants
  - i.e. `span:color-red` for `color: red` property on all span and anchor tags within the element
  - When using `em` as the default, this is most useful when you want to set a default font size for text within an element.
- Element-level zooming
  - `zoom-5` applies `font-size: 5em` to all direct children of the element
  - `zoom-0.5` applies `font-size: 0.5em` to all direct children of the element
  - This is great for scaling elements on-the-fly without having to update every `em` value of every descendant.
- Targeting attribute values
  - i.e. `[data-selected]:color-red` for `color: red` property if the element has a `data-selected` attribute
  - or `[data-selected="true"]:color-red` for `color: red` property if the element has a `data-selected` attribute with a value of `true`

_And probably some other stuff I forgot to list!_
