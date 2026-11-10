# Preview layout playground

The preview branch offers Cascade, Editorial, and the previous Cards layout on Notes, Enjoying, and Projects. Share a view with `?layout=cascade`, `?layout=editorial`, or `?layout=cards`. Cascade is the default; an explicit choice is retained for the tab. Production remains unchanged.

Cascade varies full-media, compact-thumbnail, visual-only, and text-led tiles. Editorial adds wider feature cards. A normal CSS Grid preserves document order; measured row spans let cards retain their natural heights. Resize, image/font loading, and filtering recalculate spans. Hidden filtered entries never occupy cells. Phones use one column. Articles keep their reading layout, and without JavaScript the prior cards remain available.

The comparison control and styling are scoped to index pages. Unavailable Enjoying cover images fall back to text, and responsive image selection follows each tile’s displayed width.
