# Blue & Gold preview

Blue & Gold is the fixed palette in this preview. The experimental Themes picker and other palettes are removed; old `will-palette` selections are cleared before paint. The avatar retains the existing light/dark behavior: OS preference on a new visit, manual choice during the visit.

The palette pairs warm paper and blue ink in light mode with a blue field, aqua text, and gold accents in dark mode. Standalone presentations use the same colors.

| Complementary card fill | Light | Dark |
| --- | --- | --- |
| Ocean | `#d0e2ed` | `#315d78` |
| Aqua | `#c8e2d4` | `#2d615c` |
| Butter | `#eee0a8` | `#5a5036` |

About uses ocean for learning, butter for music, and aqua for community. Enjoying's cascading Grid uses a stable eight-item pattern across these three colors, independent of media type and tag labels. List keeps its simpler background. Colored cards use dedicated secondary-text and accent tokens so text, ratings, and links retain readable contrast.

In Projects Grid, the preview frame and title are separate native links. Only the preview frame scales and receives a shadow on hover; captions stay still. Both links preserve category/view/scroll return context. List keeps its full-card link and hover treatment. CSS explicitly respects filtered cards' hidden state after the List layout uses a grid.

Notes tags remain in a horizontal, wrapping row below the description. Each tag stays on one line, and dates remain at the top right.

Keep this iteration on the separate preview site until production is explicitly requested. Validate with `theme.browser.mjs`, `notes-layout.browser.mjs`, and `portfolio-filter.browser.mjs` against the built preview; the Projects check covers stationary captions, preview-only shadows, native title links, filtering, and reduced motion. Check actual text contrast on all three card fills in both modes.
