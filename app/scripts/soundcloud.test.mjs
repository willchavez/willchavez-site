import test from "node:test";
import assert from "node:assert/strict";
import { soundCloudURL, soundCloudPlayer } from "../src/lib/soundcloud.mjs";

test("only HTTPS SoundCloud links can become players", async () => {
  for (const value of [undefined, "", "javascript:alert(1)", "http://soundcloud.com/a/b", "https://soundcloud.com.evil.test/a/b", "https://soundcloud.com@evil.test/a/b", "https://user:pass@soundcloud.com/a/b", "https://soundcloud.com:123/a/b", "https://example.com/a/b"]) {
    assert.equal(soundCloudURL(value), null);
    assert.equal(await soundCloudPlayer(value), null);
  }
});

test("track and playlist URLs use the official player without autoplay", async () => {
  const track = await soundCloudPlayer(" https://www.soundcloud.com/artist/track?secret_token=s-example ");
  const src = new URL(track.src);
  assert.equal(src.origin, "https://w.soundcloud.com");
  assert.equal(src.searchParams.get("url"), "https://soundcloud.com/artist/track?secret_token=s-example");
  assert.equal(src.searchParams.get("auto_play"), "false");
  assert.equal(track.height, 166);
  assert.equal((await soundCloudPlayer("https://soundcloud.com/artist/sets/album")).height, 450);
  assert.equal((await soundCloudPlayer("https://soundcloud.com/artist")).src, null);
});

test("phone links resolve at build time with a direct-link fallback", async () => {
  const short = "https://on.soundcloud.com/example";
  const resolved = await soundCloudPlayer(short, async () => new Response(null, {
    status: 302, headers: { location: "https://soundcloud.com/artist/sets/album" },
  }));
  assert.equal(resolved.height, 450);
  assert.ok(resolved.src);
  const failed = await soundCloudPlayer(short, async () => { throw new Error("offline"); });
  assert.equal(failed.url, short);
  assert.equal(failed.src, null);
  let calls = 0;
  const unsafe = await soundCloudPlayer(short, async () => {
    calls++;
    return new Response(null, { status: 302, headers: { location: "https://example.com/" } });
  });
  assert.equal(unsafe.src, null);
  assert.equal(calls, 1);
  calls = 0;
  await soundCloudPlayer(short, async () => {
    calls++;
    return new Response(null, { status: 302, headers: { location: short } });
  });
  assert.equal(calls, 4);
});
