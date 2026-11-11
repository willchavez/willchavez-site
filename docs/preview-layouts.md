# Portfolio layouts

Enjoying defaults to the cascading Grid on desktop and offers the shared Grid/List switch beside its filters. At 640px and below it always shows List and hides the switch, matching Projects; a saved desktop Grid preference or `?view=grid` cannot override the mobile layout. Returning to desktop restores that preference. Notes uses a regular list of rounded cards. All pages retain the shared site width.

Enjoying's media labels are plain, borderless spans across the index, Home, and detail metadata. Notes topics and project chips use the current theme’s accent pairing. Tags share the active navigation's `--fill` and `--fill-ink` tokens; category/topic no longer determines color. Text contrast is checked at >=4.5:1 with no borders or shadows. Labels do not act as filters. Post cards remain clickable, with audio controls independent of the main link.

Projects uses the same card-motion controller for desktop filtering, while retaining its existing standard grid and list geometry. The motion controller never chooses columns or row spans. Cards slide to their new positions, outgoing copies shrink/fade, and incoming cards have a short stagger. Rapid changes start from currently painted positions. Temporary copies are inert and removed on completion or navigation. Reduced motion applies filters immediately; mobile Projects filters instantly.

Projects' List chips follow the size and rounded, borderless shape of Notes topics. Tags are explicitly curated per project and shared with its detail page, with at most two unless Will requests an exception. One is enough when a second adds little. Filter categories are independent of tags. Notes follow the same editorial rule in their Markdown topics, and keep dates at the top right beside the title and place tags in a horizontal, wrapping row below the description. Every tag uses the same accent fill and text color within each theme. The browser check requires at least 4.5:1 text contrast and 1.2:1 separation between each chip fill and its card background.

Enjoying's grid retains row spans while measuring to avoid the Safari scroll-clamping bug. Measurements ignore transforms. Earlier preview links with `?layout=cascade` or `?layout=editorial` open Grid on desktop; `?layout=cards` opens List. The desktop choice persists for the tab. Without JavaScript, Enjoying's ordinary list remains available.

Check a built preview:

- `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/enjoying-layout.browser.mjs http://localhost:4359`
- `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/portfolio-filter.browser.mjs http://localhost:4359`
- `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/notes-layout.browser.mjs http://localhost:4359`

Set `BROWSER_ENGINE=webkit` for Safari's engine. Checks cover motion and interruption, final geometry, scrolling, native links, static labels, adaptive views, category chips and contrast, keyboard use, shared width, reduced motion, and fallback behavior. These layouts, filters, and tag treatments are approved for production.

The site palette remains Blue & Gold. A scoped Card colors picker offers 15 variations on Wada 121 for About’s top blocks and Enjoying Grid only. The studies vary lighter fills, serif/sans/mono typography, corner shapes, grain, linen, dots, notebook lines, and gradients; all preserve the approved dark-mode base colors. Previous/Next controls support comparison. The picker is hidden in Enjoying List and mobile Enjoying. All card surfaces have 1px borders. Linked cards darken on light-mode hover/focus and lighten in dark mode; About’s non-link cards keep static borders. Projects Grid borders stay on the thumbnail frames. In Projects Grid only the preview frame animates on hover; its caption remains still and the title is a separate link. List, Notes, and Enjoying retain full-card hover. These current refinements are preview-only.
