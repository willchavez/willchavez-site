# Blue & Gold preview

Blue & Gold remains the site palette in this preview. A Card colors picker appears above About’s top blocks and beside Enjoying’s Grid/List control. It changes only those top blocks and Enjoying Grid cards; navigation, page colors, tags, experience cards, Notes, Projects, and Enjoying List retain Blue & Gold. Old global `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

| Complementary card fill | Light | Dark |
| --- | --- | --- |
| Ocean | `#e2e7de` | `#2e586b` |
| Aqua | `#d9e6df` | `#315f61` |
| Butter | `#e9e5cc` | `#4a503e` |

The default is a softer Blue & Gold; the picker also includes Vivid, Forest and four Forest studies, Plum, Clay, and Parchment. Choices persist for the tab and survive page navigation. Every choice has paired light/dark colors controlled by the avatar, with text contrast at least 4.5:1. The picker is hidden in Enjoying List and on mobile Enjoying.

About uses ocean for learning, butter for music, and aqua for community. Enjoying's cascading Grid uses a stable eight-item pattern across these three colors, independent of media type and tag labels. List keeps its simpler background. Colored cards use dedicated secondary-text and accent tokens so text, ratings, and links retain readable contrast.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Notes, Projects List, Enjoying List/Grid, About’s top cards, and Projects Grid thumbnails share a 1px border. Fine-pointer hover and keyboard focus darken it in light mode and lighten it in dark mode, without a border around Projects Grid captions.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `card-colors.browser.mjs`, `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
