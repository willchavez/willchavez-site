# Enjoying preview layouts

Enjoying offers Cascade, Editorial, and the previous Cards layout. Share a view with `?layout=cascade`, `?layout=editorial`, or `?layout=cards`. Cascade is the default; an explicit choice is retained for the tab. Notes and Projects keep their regular layouts. Production remains unchanged.

Cascade varies full-media, compact-thumbnail, visual-only, and text-led tiles. Editorial adds wider feature cards. CSS Grid preserves document order; measured row spans let cards retain their natural heights. Resize, image/font loading, and filtering recalculate spans. Existing spans stay in place during measurement so the document does not temporarily collapse while someone is scrolling. Measurements ignore hover transforms, and grid height changes do not trigger another measurement by themselves. Hidden filtered entries never occupy cells. Phones use one column.

The title's native link stretches over each card, so the padding and excerpt open the post and support normal link actions. Filter tags and audio controls stay independently clickable. Hover slightly expands a card and adds a soft shadow. Keyboard focus outlines the card; reduced motion removes the scale effect.

The controls and styling are scoped to Enjoying's index. All layouts use the site's shared page width, keeping the header and outer content edges aligned when navigating between pages. Unavailable cover images fall back to text; responsive image selection follows each tile's displayed width. Articles keep their reading layout, and without JavaScript the prior cards remain available.

Check a built preview with `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/enjoying-layout.browser.mjs http://localhost:4359`. Set `BROWSER_ENGINE=webkit` to test Safari's engine when Playwright WebKit is installed. The check covers filters, wheel scrolling and late-media remeasurement, card navigation, independent tags, hover and keyboard focus, reduced motion, and the regular Notes/Projects layouts.
