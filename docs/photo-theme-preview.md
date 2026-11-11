# Blue & Gold preview

Blue & Gold remains the site palette in this preview. A Card colors picker appears above About’s top blocks and beside Enjoying’s Grid/List control. It changes only those top blocks and Enjoying Grid cards; navigation, page colors, tags, experience cards, Notes, Projects, and Enjoying List retain Blue & Gold. Old global `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

The picker contains 15 contrasting combinations from Sanzo Wada, replacing the set limited to 121. The reference is https://sanzo-wada.dmbk.io/assets/colors.json. Light uses the digitized source colors, except the familiar softened 121 reference. Every study has a distinct, explicitly composed dark palette; these are adaptations rather than original Wada swatches.

| Study | Wada combination | Direction |
| --- | --- | --- |
| 01 Coral & forest (default) | 166 | Coral, butter, forest → ember, ochre, pine |
| 02 Aqua & indigo | 167 | Ecru, icy aqua, indigo → brass, lagoon, midnight |
| 03 Pink & plum | 174 | Pink, lavender, plum → mulberry, lilac, aubergine |
| 04 Amber & petrol | 140 | Amber, teal, slate → tobacco, deep teal, blue slate |
| 05 Blue hour | 139 | Blue, indigo, gray → storm, midnight, sea glass |
| 06 Vermilion & pistachio | 137 | Red, cinnamon, pistachio → oxblood, bronze, fern |
| 07 Seafoam & violet | 125 | Fawn, seafoam, violet-blue → rosewood, jade, violet ink |
| 08 Chartreuse atlas | 160 | Yellow, umber, Medici blue → moss gold, walnut, peacock |
| 09 Rose & electric blue | 231 | Cameo pink, russet, blue → mauve, mahogany, cobalt |
| 10 Jade watercolor | 178 | Ivory, glaucous blue, jade → antique gold, malachite, deep jade |
| 11 Vermilion & ink | 190 | Ivory, orange-red, black → old gold, burnt orange, charcoal |
| 12 Apricot & lilac | 180 | Apricot, mauve, gray-green → copper, amethyst, eucalyptus |
| 13 Carmine garden | 200 | Carmine, olive, leaf → wine, olive, woodland |
| 14 Sunlit sorbet | 213 | Salmon, yellow, icy blue → coral, saffron, lagoon |
| 15 Familiar earth | 121 | Previous softened 121 for comparison, including its approved dark colors |

Each combination has its own serif/sans/mono typography, shape, and finish: flat pigment, linen, grain, glow, glass, dot screen, notebook rules, graph paper, or gradients. Typography and surfaces remain scoped to About’s top blocks and Enjoying Grid. No new font downloads or moving textures are introduced. Text color is chosen per swatch against all texture/gradient colors; finishes on mid-value pigments use a narrower range to keep at least 4.5:1 text contrast throughout.

The picker shows a description covering light and dark, texture-aware swatches, and Previous/Next controls. The avatar switches modes while keeping the selected study. Choices persist for the tab and page navigation. Removed choices fall back to 01. About assigns the first tone to learning, third to music, and second to community. Enjoying retains its stable tone pattern and recalculates masonry on type changes. Enjoying List and mobile Enjoying have no study picker or study styling.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Notes, Projects List, Enjoying List/Grid, About’s top cards, and Projects Grid thumbnails share a 1px border. Linked cards’ fine-pointer hover and keyboard focus darken it in light mode and lighten it in dark mode, without a border around Projects Grid captions. About’s cards retain static borders on hover and inline-link focus, since the card itself is not a link.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `card-colors.browser.mjs`, `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
