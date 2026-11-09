// Show the author's own first paragraph as plain text, never rendered HTML.
export function contentExcerpt(body = "") {
  return body.trim().split(/\n\s*\n/).find(p => !/^(?:!\[|<|#|\|)/.test(p.trim()))
    ?.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ").trim() ?? "";
}
