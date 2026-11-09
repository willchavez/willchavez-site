# Enlarged animation playback

The shared image viewer offers Pause animation / Resume animation for GIFs and animated WebP/PNG files. The control sits beneath the caption, next to the enlarged media. It changes the playback state of an H.264 video copy, so resuming continues at the paused frame. Space toggles playback; Escape closes the viewer, stops playback, and restores focus. Enlarged animations start paused when reduced motion is preferred. Inline images and thumbnail behavior are unchanged.

`app/scripts/animations.mjs` runs after the responsive image build. It detects multiple frames using Sharp, decodes the original frames with their timing, and encodes a muted, looping MP4 with FFmpeg. Odd dimensions are padded to even dimensions; transparent pixels use a white background. The largest edge is constrained by a 1600px width, without enlargement. GIF originals remain available.

The build emits `/animation-media.json`, mapping original URLs and responsive image URLs to content-hashed videos. The browser requests this map on the first viewer opening and loads a video only for the enlarged image. Static images retain the image viewer; an unavailable video falls back to its animated image.

FFmpeg (including libx264) is required to build. The Pages workflow ensures it is installed. Video encodings are cached in the existing responsive-image cache, keyed by source bytes and the encoder script; same-name source edits produce new video URLs. Only current source animations are included in a fresh build.

Checks:

- `node --test app/scripts/animations.test.mjs` verifies frames, timing, playable format, cache reuse, source invalidation, and deletion.
- `CHROMIUM_PATH=/usr/bin/chromium node app/scripts/animation-viewer.browser.mjs <preview-url>` verifies real playback state, mobile, presentations, keyboard, focus, reduced motion, failure fallback, static images, and thumbnail exclusion.
