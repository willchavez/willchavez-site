# Blue and gold photo theme

Preview experiment based on production commit `a793ec1cbdeb6550dd3cea5d05eb0cba04b41cc4`, including the latest curated tags and Notes metadata placement. Publish only to the separate preview site. This branch is for comparison, not production deployment.

The reference photo combines smoky ocean blue, faded yellow-gold, and icy aqua. These are visual approximations of its palette, adapted for readable text rather than measured pixel samples. The photo itself is not included in the site.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f1efdc` | `#244e63` |
| Text | `#264f63` | `#dcfff6` |
| Secondary text | `#4f666b` | `#bdd9d4` |
| Accent / tags / active navigation | `#356984` | `#dad39a` |
| Text on accent | `#dcfff6` | `#244e63` |
| Raised surfaces | `#f7f5e7` | `#2e586b` |
| Golden card tint | `#b9b47e` | `#b9b47e` |

Light mode uses gold-tinted paper with blue ink. Dark mode comes closer to the reference's blue field, aqua lettering, and faded gold highlights. Existing card variation mixes these colors with the page. Layouts, content, and original media keep their current treatment. The avatar still follows the OS on a new visit and toggles manually during the visit.

On phones, Notes reserves the intrinsic width of its longest tag instead of limiting the metadata column to 40%. Tags stack as individual single-line pills at the top right, preserving their full wording without squeezing text into two lines.

Base text contrast is 7.6:1 in light mode and 8.4:1 in dark mode; secondary text is 5.3:1 and 6.0:1. Accent labels are 5.6:1 and 5.9:1. Check rendered cards as well as token pairs before publishing, since mixed surfaces can change contrast.

## Palette comparison

`codex/theme-options` builds on the latest photo preview (`a172b1c`). The header's **Themes** panel offers Blue & gold, Forest, Plum, Clay, and Parchment, each in light and dark mode. Choose directly or use **Next palette** to cycle. The mode button and original avatar stay synchronized. Escape and outside clicks close the panel.

Palette choice is stored in tab-scoped `will-palette` session storage, survives internal navigation and refreshes, and falls back to memory when storage is blocked. The light/dark visit rules are unchanged. Without JavaScript the original blue/gold OS-responsive palette remains available and the comparison panel is hidden. Shared palette tokens also apply to standalone presentations.

Run `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/palettes.browser.mjs BASE_URL` to verify all ten combinations, text and accent contrast, actual card surfaces, desktop and 320/375px phones, cycling, mode switching, navigation, refresh, keyboard dismissal, and blocked storage. The existing `test:theme` covers avatar behavior and OS/no-JavaScript fallbacks. Publish only through the separate preview repository workflow.
