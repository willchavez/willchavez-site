# Blue & Gold preview

Blue & Gold remains the site palette in this preview. A Card colors picker appears above About’s top blocks and beside Enjoying’s Grid/List control. It changes only those top blocks and Enjoying Grid cards; navigation, page colors, tags, experience cards, Notes, Projects, and Enjoying List retain Blue & Gold. Old global `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

The picker contains 15 original pigment studies built from Will’s favorites: smoky brass from 167 (`#615a45`), mineral gray from 139 (`#b5d1cc`), fawn from 125 (`#d1b0b3`), sulphur yellow from 160 (`#baa600`), russet from 231 (`#681916`), and olive buff from 200 (`#bcd382`). Amber is burnished toward ochre (`#b48643` / `#bd8a3e`) instead of the sorbet orange. The earth study now pairs brown with mineral and brass, with stronger value differences. These are original combinations of selected Wada pigments and complementary neutrals, rather than reproductions of numbered combinations.

References inspected:
- https://tarng.com/ — broad SVG `feTurbulence` fields plus displacement create organic color flow.
- https://css-tricks.com/grainy-gradients/ — finer fractal noise gives gradients the tooth of printed stock.
- https://sanzo-wada.dmbk.io/assets/colors.json — the digitized Wada pigment reference.

| Study | Palette / surface |
| --- | --- |
| 01 Smoked brass (default) | Brass, mineral, russet / clouded pigment |
| 02 Fawn lithograph | Fawn, sulphur, ink / fine paper tooth |
| 03 Olive ink bath | Olive, russet, chalk / broad color refraction |
| 04 Burnished amber | Antique amber, mineral, walnut / brushed grain |
| 05 Fawn after smoke | Fawn, brass, charcoal / soft pigment pools |
| 06 Sulphur prism | Sulphur, mineral smoke, russet / refracted color fields |
| 07 Mineral velvet | Mineral, olive, deep ink / diffuse fields |
| 08 Russet edition | Russet, fawn, limestone / grained stock |
| 09 Amber stone | Amber, olive, graphite / refracted layers |
| 10 Brass foil | Brass, sulphur, chalk / raked grain |
| 11 Mineral wine | Mineral, fawn, wine / clouded pigment |
| 12 Olive atmosphere | Olive, fawn, smoky green / atmospheric fields |
| 13 Russet gold | Russet, antique amber, porcelain / print grain |
| 14 Fawn mineral swirl | Fawn, sulphur, mineral / flowing color refraction |
| 15 Earth rebalanced | Brown, mineral, brass / diffused light |

Each study has its own light and dark colors, typography, and shape. The corrected effect follows Tarng’s two-stage construction: broad single-octave turbulence at approximately `0.001` in a 2000-unit field, `saturate(4)` amplification, then a separate `0.003` turbulence feeding `feDisplacementMap` across the entire field. Independent RGB channels remain independent instead of being reduced to grayscale. Softening removes harsh bands, and fine grain is secondary.

A document SVG filter also supplies the native `backdrop-filter: url(#card-refraction)` layer, rotated 180 degrees as on Tarng. It sits behind content, ignores pointer events, and is inset to prevent sampling the surrounding page into the corners. The background image contains its own displacement stage so the effect remains visible in engines without SVG backdrop-filter support. Filters never affect the typography or media. Tarng’s source does not animate its filters; the flowing appearance comes from layered color and refraction, not an animation script.

The preview now adds an 18–24 second composited drift of the rendered background through that refraction layer. Cached fields move, turn, and gently scale behind stationary text and artwork; the SVG noise itself is not regenerated per frame. Different phases avoid synchronized movement. IntersectionObserver runs motion only on visible cards, suspends it offscreen or during filters/List mode, and visibility changes pause hidden tabs. The pause/play control in Card colors remembers the choice for the tab. Initial and live Reduce Motion preferences disable the animation. Without JavaScript the original static field remains.

Text colors account for the entire independent RGB range, including minimum/maximum channel combinations between the transfer stops. Browser checks validate at least 4.5:1 contrast in all 15 studies and both modes. `card-field-motion.browser.mjs` compares moving and paused pixels, fixed text/artwork geometry, offscreen suspension, view switching, preference persistence, and reduced-motion changes. `card-refraction.browser.mjs` freezes motion and additionally compares actual rendered screenshots with the native backdrop layer, SVG displacement, and saturation individually disabled. Each must visibly change the image; text geometry must stay fixed and Enjoying’s full-card links must remain clickable. Solid card colors provide a fallback while SVG images load.

The picker shows descriptions and surface-aware swatches, with Previous/Next controls. The avatar switches modes while keeping the study. Choices persist for the tab and page navigation. Removed choices fall back to 01. About assigns the first tone to learning, third to music, and second to community. Enjoying retains its stable tone pattern and recalculates masonry on type changes. Enjoying List and mobile Enjoying have no study picker or study styling.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Notes, Projects List, Enjoying List/Grid, About’s top cards, and Projects Grid thumbnails share a 1px border. Linked cards’ fine-pointer hover and keyboard focus darken it in light mode and lighten it in dark mode, without a border around Projects Grid captions. About’s cards retain static borders on hover and inline-link focus, since the card itself is not a link.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `card-colors.browser.mjs`, `card-refraction.browser.mjs`, `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
