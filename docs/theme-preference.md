# Theme preferences

A visit starts with `prefers-color-scheme`. OS changes update the site automatically until the visitor makes a manual choice with the avatar. That choice remains in effect for the current visit, including internal navigation, standalone project presentations, and refreshes.

The override uses tab-scoped session storage rather than permanent local storage. Closing the tab clears it. A fresh document navigation into the site without a same-origin referrer also starts with the OS preference; full internal navigations and reloads retain the choice. Existing permanent `will-theme` local-storage values are ignored, so earlier avatar clicks cannot indefinitely pin the theme.

When storage is unavailable, the avatar still works in memory. The pre-paint theme script and the runtime share the same preference, keeping navigation and the sun/moon animation synchronized. Without JavaScript, CSS follows the OS.

`app/scripts/theme.browser.mjs` checks OS updates, manual overrides, session persistence, new visits, legacy overrides, mobile, reduced motion, standalone presentations, blocked storage, and the no-JavaScript fallback.
