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
including fonts, legacy portfolio pages, extensionless routes, and `/admin/`.
Source edits require another Actions build and artifact download.
The download destination must be empty; move an older `app/dist` build aside
before downloading a replacement so deleted pages do not linger.
The editor still targets the real `site-v2` branch when you save content.

## Build on a machine where npm is allowed

```sh
sh app/build.sh
python3 app/scripts/preview.py
```

Do not bypass workplace package restrictions. The Actions preview path needs
only Python locally. The build also uploads `package-lock` for retrieving the
generated `app/package-lock.json`.

## SoundCloud in posts

In the CMS Notes collection, use the optional **SoundCloud link** field for
a track or playlist. In Enjoying, paste it into the existing **Link** field.
The player appears beneath a post and in Enjoying's list, including Up Next.
Readers choose **load soundcloud player** before any embedded SoundCloud
content loads; a **listen on soundcloud** link remains available without JavaScript.
Public tracks must allow embedding on SoundCloud.

Phone links from `on.soundcloud.com` are resolved during the build. If that
fails, the post still builds and keeps the original link. Use a full
`soundcloud.com/artist/track` or `soundcloud.com/artist/sets/playlist` URL to
avoid that extra lookup. No embed HTML or API key is needed.

The Actions `soundcloud-preview` artifact contains isolated test posts for
browser checks. They are never included in the `local-preview` site artifact.

The main tabs are work, notes, photos, enjoying, and about. Work is the landing
page; `/work` redirects there. `/writing` and its posts redirect to `/notes`.
Notes still use `app/src/content/writing` so existing CMS content stays intact.

Work-page design studies on this branch share the same experience content:
`/?direction=rounded`, `/?direction=quiet`, and `/?direction=split` (default).
These do not add password protection to the legacy portfolio. That content and
its images remain public until a separate protected hosting/source plan is implemented.
