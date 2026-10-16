// Isolated rendering fixtures for browser QA. Never adds posts to the real site.
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const app = fileURLToPath(new URL("../", import.meta.url));
const scratch = await mkdtemp(path.join(tmpdir(), "soundcloud-preview-"));
const output = path.join(app, ".soundcloud-preview");
try {
  await cp(app, scratch, { recursive: true, filter: (source) => !["node_modules", "dist", ".astro", ".soundcloud-preview"].includes(path.basename(source)) });
  // Astro's built-in .astro components must compile inside the same project root.
  // A dependency symlink outside this fixture root breaks their virtual CSS modules.
  await cp(path.join(app, "node_modules"), path.join(scratch, "node_modules"), { recursive: true });
  const fixtures = [
    ["writing/player-check.md", 'title: SoundCloud player check\nsoundcloud: https://soundcloud.com/william-chavez-salinas/sets/2026-ep', "Isolated preview of the optional player beneath a note. This is not a published post."],
    ["photos/layout-check.md", 'title: Photo layout check\nimage: /img/will.png\nalt: Will Chavez’s illustrated portrait\ncaption: Isolated photo layout preview.', ""],
    ["writing/plain-check.md", 'title: Note without music', "No player should appear on this page."],
    ["enjoying/player-check.md", 'title: Playlist player check\nkind: music\nstatus: enjoyed\nlink: https://soundcloud.com/william-chavez-salinas/sets/2026-ep', "Isolated review preview."],
    ["enjoying/queue-check.md", 'title: Track player check\nkind: music\nstatus: up next\nlink: https://soundcloud.com/forss/flickermood', ""],
    ["enjoying/link-check.md", 'title: Ordinary link check\nkind: book\nstatus: enjoyed\nlink: https://example.com', "Ordinary links still work."],
  ];
  for (const [name, fields, body] of fixtures) {
    const target = path.join(scratch, "src/content", name);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `---\n${fields}\ndate: 2026-10-15\n---\n${body}\n`);
  }
  execFileSync("npm", ["run", "build"], { cwd: scratch, stdio: "inherit" });
  const html = await readFile(path.join(scratch, "dist/notes/player-check.html"), "utf8");
  assert.ok(html.includes("data-soundcloud-src="));
  assert.ok(html.includes("Listen on SoundCloud"));
  assert.ok(!html.includes("<iframe"), "No third-party frame before the reader clicks");
  const plain = await readFile(path.join(scratch, "dist/notes/plain-check.html"), "utf8");
  assert.ok(!plain.includes("data-soundcloud-src="));
  const ordinary = await readFile(path.join(scratch, "dist/enjoying/link-check.html"), "utf8");
  assert.ok(ordinary.includes('href="https://example.com"'));
  assert.ok(!ordinary.includes("data-soundcloud-src="));
  for (const [file, destination] of [["work.html", "/"], ["writing.html", "/notes"], ["writing/player-check.html", "/notes/player-check"]]) {
    const redirect = await readFile(path.join(scratch, "dist", file), "utf8");
    assert.ok(redirect.includes('http-equiv="refresh"'));
    assert.ok(redirect.includes(`url=${destination}`));
  }
  const home = await readFile(path.join(scratch, "dist/index.html"), "utf8");
  assert.ok(home.includes("My experience"));
  assert.ok(!home.includes('href="/portfolio/'));
  assert.ok(!home.includes("currently, i'm"));
  await rm(output, { recursive: true, force: true });
  await cp(path.join(scratch, "dist"), output, { recursive: true });
  for (const asset of ["fonts", "img", "favicon.ico"]) {
    await cp(path.join(app, "..", asset), path.join(output, asset), { recursive: true });
  }
} finally {
  await rm(scratch, { recursive: true, force: true });
}
