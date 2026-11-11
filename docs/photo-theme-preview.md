# Blue & Gold preview

Blue & Gold remains the site palette in this preview. A Card colors picker appears above About’s top blocks and beside Enjoying’s Grid/List control. It changes only those top blocks and Enjoying Grid cards; navigation, page colors, tags, experience cards, Notes, Projects, and Enjoying List retain Blue & Gold. Old global `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

The previous ten card palettes are removed. The picker now contains six numbered triads from Sanzo Wada’s *A Dictionary of Color Combinations*, using the digital reference at https://sanzo-wada.dmbk.io/assets/colors.json:

| Combination | Colors |
| --- | --- |
| 203 (default) | Pale Lemon Yellow, Vinaceous Cinnamon, Lincoln Green |
| 167 | Ecru, Pale King’s Blue, Vandar Poel’s Blue |
| 174 | Corinthian Pink, Grayish Lavender B, Taupe Brown |
| 121 | Brown, Ochraceous Salmon, Lincoln Green |
| 140 | Golden Yellow, Antwarp Blue, Slate Color |
| 235 | Ivory Buff, Yellow Orange, Grayish Lavender B |

Light mode uses the reference’s hex values. Dark mode adapts those hues to lower-light, less saturated surfaces; these adaptations are not presented as original Wada swatches. Each card tone has its own primary, secondary, and accent text colors with at least 4.5:1 contrast. This allows combinations with both pale and deep colors instead of turning every card into a pastel. The source numbers and original color names are retained in `card-palettes.ts`.

Choices persist for the tab and survive page navigation. Removed choices fall back to combination 203. The picker is hidden in Enjoying List and on mobile Enjoying. About assigns the first tone to learning, third to music, and second to community. Enjoying keeps its stable tone pattern, independent of media type and tag labels.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Notes, Projects List, Enjoying List/Grid, About’s top cards, and Projects Grid thumbnails share a 1px border. Linked cards’ fine-pointer hover and keyboard focus darken it in light mode and lighten it in dark mode, without a border around Projects Grid captions. About’s cards retain static borders on hover and inline-link focus, since the card itself is not a link.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `card-colors.browser.mjs`, `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
