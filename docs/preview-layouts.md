# Enjoying Grid and List preview

Enjoying defaults to Grid: the cascading layout with varied media sizes and occasional text cards. The Grid/List switch sits on the right of the filter toolbar and shares its component, icons, and styles with Projects. List uses the regular rounded rows. Notes keeps its existing layout. All pages keep the site's shared width.

Share a view with `?view=grid` or `?view=list`; the selection also persists for the tab. Earlier preview links with `?layout=cascade` or `?layout=editorial` open Grid, and `?layout=cards` opens List. Each item's visual treatment stays consistent across filters.

Filtering captures the current card positions, updates the natural grid, then animates cards to their new positions with the Web Animations API. Outgoing cards shrink and fade through inert, temporary copies; incoming cards appear with a short stagger. Rapid changes cancel earlier motion and start from the currently painted positions. Temporary copies and height protection are removed after motion finishes or navigation interrupts it. Reduced motion applies filters and view changes immediately.

The grid retains row spans while measuring to avoid the Safari scroll-clamping bug. Measurements ignore animation/hover transforms. Full-card post links, independent filter tags/audio controls, keyboard focus, and the small hover expansion/shadow remain. Without JavaScript, the regular list is available and the view switch stays hidden.

Check a built preview with `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/enjoying-layout.browser.mjs http://localhost:4359`. Set `BROWSER_ENGINE=webkit` for Safari's engine. The browser checks cover actual in-flight motion, interrupted filters, final grid geometry, scrolling, view persistence, native links, tags, keyboard access, reduced motion, no-JavaScript fallback, shared page width, and Projects' existing view switch. Production remains unchanged.
