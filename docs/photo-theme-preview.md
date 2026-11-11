# Blue & Gold preview

Blue & Gold remains the site palette in this preview. A Card colors picker appears above About’s top blocks and beside Enjoying’s Grid/List control. It changes only those top blocks and Enjoying Grid cards; navigation, page colors, tags, experience cards, Notes, Projects, and Enjoying List retain Blue & Gold. Old global `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

The picker contains 15 original variations on Wada combination 121 (Brown, Ochraceous Salmon, Lincoln Green). The other Wada combinations have been removed. These are adaptations, not reproductions of the original swatches; the reference is https://sanzo-wada.dmbk.io/assets/colors.json.

| Study | Direction |
| --- | --- |
| 01 Porcelain (default) | Ivory, peach mist, pale sage; airy serif |
| 02 Rice paper | Warm stock, fine grain |
| 03 Chalk pastels | Powdery color, clean sans |
| 04 Milk glass | Soft highlights, generous corners |
| 05 Natural linen | Woven lines, classic serif |
| 06 Watercolor | Pigment blooms, italic headings |
| 07 Dune | Diagonal gradients, modern sans |
| 08 Herbarium | Faint notebook rules, botanical ink |
| 09 Letterpress | Grain, richer color, strong Georgia headings |
| 10 Risograph | Fine dot screen, sans |
| 11 Atelier | Nearly white, high-contrast serif |
| 12 Mineral | Cool stone, tiny flecks, sans headings |
| 13 Field index | Graph paper, monospaced headings |
| 14 Faded sunset | Peach gradients, slanted literary headings |
| 15 Soft 121 | Previous softened flat palette for comparison |

All studies retain the approved dark base fills (`#4b3830`, `#73543f`, `#424c32`); finishes and type vary. Light mode explores quieter, lighter tints. Typography, shape, gradients, and textures are scoped to the same two collections as the fills. No font downloads or moving texture effects are introduced. Each swatch has dedicated primary, secondary, and accent text. Contrast is checked against the base fill and every opaque gradient/texture color, not just a nominal background.

The picker shows a description and texture-aware swatches, with Previous/Next controls. Choices persist for the tab and page navigation. Removed choices fall back to 01. About assigns the first tone to learning, third to music, and second to community. Enjoying retains its stable tone pattern; ResizeObserver recalculates masonry when type changes. Enjoying List and mobile Enjoying have no study picker or study styling.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Notes, Projects List, Enjoying List/Grid, About’s top cards, and Projects Grid thumbnails share a 1px border. Linked cards’ fine-pointer hover and keyboard focus darken it in light mode and lighten it in dark mode, without a border around Projects Grid captions. About’s cards retain static borders on hover and inline-link focus, since the card itself is not a link.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `card-colors.browser.mjs`, `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
