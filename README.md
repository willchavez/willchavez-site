# willchavez.com

The Astro rebuild lives in `app/`. Keep work on branches; production deploys
from `master`.

## Local preview without npm

The **Build local preview** GitHub Actions workflow builds `site-v2` and
`codex/site-v2-local` pushes without deploying anything. Download its
`local-preview` artifact into `app/dist`, then run from the repository root:

```sh
gh run list --workflow preview.yml --branch codex/site-v2-local
gh run download RUN_ID --name local-preview --dir app/dist
python3 app/scripts/preview.py
```

Open http://localhost:4321. Stop with Ctrl+C. This serves the built snapshot,
including fonts, legacy portfolio pages, and extensionless routes.
Source edits require another Actions build and artifact download.
The download destination must be empty; move an older `app/dist` build aside
before downloading a replacement so deleted pages do not linger.

## Build on a machine where npm is allowed

```sh
sh app/build.sh
python3 app/scripts/preview.py
```

Do not bypass workplace package restrictions. The Actions preview path needs
only Python locally. The build also uploads `package-lock` for retrieving the
generated `app/package-lock.json`.

## Editing content

Edit Markdown files in `app/src/content/writing` for Notes and
`app/src/content/enjoying` for Enjoying. Put uploaded media in `app/public/uploads`.
Content changes committed to `master` trigger the site build and deployment.
There is no public admin interface.

## SoundCloud in posts

In a Notes Markdown file, use the optional `soundcloud` frontmatter field for
a track or playlist. In Enjoying, use the `link` field.
The player appears beneath a post and in Enjoying's list.
Readers choose **load soundcloud player** before any embedded SoundCloud
content loads; a **listen on soundcloud** link remains available without JavaScript.
Public tracks must allow embedding on SoundCloud.

Phone links from `on.soundcloud.com` are resolved during the build. If that
fails, the post still builds and keeps the original link. Use a full
`soundcloud.com/artist/track` or `soundcloud.com/artist/sets/playlist` URL to
avoid that extra lookup. No embed HTML or API key is needed.

The Actions `soundcloud-preview` artifact contains isolated test posts for
browser checks. They are never included in the `local-preview` site artifact.

The main tabs are work, notes, enjoying, and about. Work is the landing
page; `/work` redirects there. `/writing` and its posts redirect to `/notes`.
Notes use `app/src/content/writing` so existing content stays intact.

Work-page design studies on this branch share the same experience content:
`/?direction=rounded`, `/?direction=quiet`, and `/?direction=split` (default).
These do not add password protection to the legacy portfolio. That content and
its images remain public until a separate protected hosting/source plan is implemented.

## Production image cache

Production builds cache responsive WebP variants in `app/.cache/responsive-images`.
The image processor keys each result by source contents, transform implementation,
and Sharp/encoder versions. Unchanged images are copied into Astro's fresh output;
edited images are regenerated, and deleted sources are not copied back. GitHub
Actions restores and saves this cache across production builds. The first build
(or a transform/dependency change) still does the full conversion. Removing the
local cache is safe and forces regeneration.

Run `node --test app/scripts/images.test.mjs` to check cache invalidation,
partial-cache recovery, and animation preservation.

The project-led preview is developed on `codex/project-led-preview`; homepage
refinements are on `codex/preview-refinements`. Publish these only through the
separate preview repository workflow until production changes are approved.

Microsoft Fluent 3D emoji are bundled in `app/public/emoji` under their MIT
license. `app/src/middleware.ts` replaces mapped emoji in visible rendered text,
including Markdown and excerpts, while preserving their Unicode text as image
alt text. To support another emoji, add the official asset and its entry to
`app/src/data/fluent-emoji.json`. Other emoji keep their native rendering.
Run `node --test app/scripts/fluent-emoji.test.mjs` to check the renderer.

Enjoying uses `creator` for artists, authors, and film directors. The film
credits were checked against the structured director metadata on each entry’s
linked Letterboxd page. Multiple directors stay together in that field.
`EnjoyingHeading.astro` keeps titles and creator details on the left, with
category tags on the right. On desktop and phones, the Enjoying list keeps
the date and tag together in the right column, with a fixed gap independent
of title wrapping; film detail pages use the same
stored creator credit. Homepage Notes cards use each post’s existing thumbnail
(or cover when available).

The desktop nav follows main’s two-layer text treatment: normal labels stay
in place, and an aria-hidden contrasting copy is clipped to the moving pill.
The pill background and contrasting text are painted in one clipped layer,
so one clip-path animation controls their shared boundary.

To check navigation contrast, build and serve the site, then run
`npm --prefix app run test:nav` (defaults to `http://localhost:4321`). This
browser regression checks intermediate frames, interrupted navigation, history,
resize, both color schemes, reduced motion, mobile, and the no-JavaScript
fallback. On machines where browser dependencies are allowed, install Chromium
with `cd app && npx playwright install chromium`, or set `CHROMIUM_PATH` to an
existing Chromium executable. Pass a deployed base URL after `--` to check a
preview. Set `NAV_SCREENSHOTS_DIR` to save the six sampled frames per color scheme.

`npm --prefix app run test:nav:pixels` captures actual unpaused browser frames
while navigating under 4× CPU throttling. It checks rendered pixels for light
text outside the brown pill and dark text inside it. Pass a base URL after `--`
to verify a deployed preview. Set `NAV_SCREENSHOTS_DIR` to save failing frames.

On portrait phones, Enjoying paper previews hide their thumbnail and show a
single ellipsized author line followed by `publicationShort` and the year.
Desktop/landscape previews and paper detail pages retain the full publication
and author text.
