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

Notes keeps the date beside the title and places tags below the description in a horizontal, wrapping row. Individual pills retain their full wording on one line.

Base text contrast is 7.6:1 in light mode and 8.4:1 in dark mode; secondary text is 5.3:1 and 6.0:1. Accent labels are 5.6:1 and 5.9:1. Check rendered cards as well as token pairs before publishing, since mixed surfaces can change contrast.

## Palette comparison

This preview builds on the theme toggle in `codex/theme-options` (`e076f91`). The header's **Themes** panel offers Blue & gold, the original Forest plus four Forest studies, Plum, Clay, and Parchment, each in light and dark mode. Choose directly or use **Next palette** to cycle. The mode button and original avatar stay synchronized. Escape and outside clicks close the panel.

Palette choice is stored in tab-scoped `will-palette` session storage, survives internal navigation and refreshes, and falls back to memory when storage is blocked. The light/dark visit rules are unchanged. Without JavaScript the original blue/gold OS-responsive palette remains available and the comparison panel is hidden. Shared palette tokens also apply to standalone presentations.

Run `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/palettes.browser.mjs BASE_URL` to verify all eighteen combinations, text and accent contrast, actual card surfaces, desktop and 320/375px phones, cycling, mode switching, navigation, refresh, keyboard dismissal, and blocked storage. The existing `test:theme` covers avatar behavior and OS/no-JavaScript fallbacks. Publish only through the separate preview repository workflow.

## Forest variations

The original Forest palette remains available beside four new paired studies:

| Study | Light treatment | Dark treatment |
| --- | --- | --- |
| Moss | Warm cream, olive ink, moss accent | Charcoal olive with pale moss highlights |
| Fern | Airy pale green, fresh fern accent | Rich green with soft mint highlights |
| Pine | Cool mist, deep evergreen accent | Deep blue-green with silver-green highlights |
| Lichen | Ivory, olive ink, golden-green accent | Warm dark olive with yellow-green highlights |

All nine palettes have light and dark modes (18 combinations). The comparison strip now shows three labeled roles: Paper, Text, and Accent. The removed fourth swatch was secondary text, not an extra accent. Secondary text remains independently checked at 4.5:1 or better against page and card backgrounds; adjacent swatches are not used as text/background pairs.

Notes, Projects, and Enjoying use `card-hover.css` for the same 1.015 scale and soft shadow. Filtering temporarily owns card transforms, and reduced motion disables hover scaling. These updates remain preview-only.
