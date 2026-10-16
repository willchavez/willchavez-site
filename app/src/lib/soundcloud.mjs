const hosts = new Set(["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com", "on.soundcloud.com"]);

export function soundCloudURL(value) {
  try {
    const url = new URL(value?.trim());
    return url.protocol === "https:" && hosts.has(url.hostname) && !url.username && !url.password && !url.port ? url : null;
  } catch {
    return null;
  }
}

export async function soundCloudPlayer(value, fetchURL = fetch) {
  let url = soundCloudURL(value);
  if (!url) return null;
  const fallback = { url: url.href, src: null, height: 166 };
  try {
    // Phone share links are resolved during the build, never by visitors.
    for (let redirects = 0; url.hostname === "on.soundcloud.com"; redirects++) {
      if (redirects >= 4) return fallback;
      const response = await fetchURL(url.href, { redirect: "manual", signal: AbortSignal.timeout(5000) });
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (response.status < 300 || response.status >= 400 || !location) return fallback;
      url = soundCloudURL(new URL(location, url).href);
      if (!url) return fallback;
    }
  } catch {
    return fallback;
  }
  url.hostname = "soundcloud.com";
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2 || (parts[1] === "sets" && parts.length < 3)) return fallback;
  const src = new URL("https://w.soundcloud.com/player/");
  src.search = new URLSearchParams({
    url: url.href,
    color: "#9c4b2e",
    auto_play: "false",
    show_comments: "false",
    show_artwork: "true",
    show_user: "true",
    visual: "false",
  }).toString();
  return { url: url.href, src: src.href, height: parts[1] === "sets" ? 450 : 166 };
}
