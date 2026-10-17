const widths = [480, 960, 1600];

function optimizedPath(src, width) {
  const uploadPath = src.slice("/uploads/".length).replace(/\.[^/.]+$/, "");
  return `/uploads/w/${width}/${uploadPath}.webp`;
}

function optimizeRawImages(html) {
  return html.replace(/<img\b([^>]*?)\bsrc=(["'])(\/uploads\/[^"']+)\2([^>]*)>/gi, (_match, before, quote, src, after) => {
    const selfClosing = /\/\s*$/.test(after);
    const attributes = `${before}src=${quote}${optimizedPath(src, 960)}${quote}${after.replace(/\/\s*$/, "")}`;
    const additions = [
      !/\bsrcset\s*=/.test(attributes) && `srcset="${widths.map((width) => `${optimizedPath(src, width)} ${width}w`).join(", ")}"`,
      !/\bsizes\s*=/.test(attributes) && 'sizes="(max-width: 900px) 100vw, 62rem"',
      !/\bloading\s*=/.test(attributes) && 'loading="lazy"',
      !/\bdecoding\s*=/.test(attributes) && 'decoding="async"',
    ].filter(Boolean).join(" ");
    return `<img${attributes}${additions ? ` ${additions}` : ""}${selfClosing ? " /" : ""}>`;
  });
}

export default function rehypeResponsiveImages() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "raw" && typeof node.value === "string") {
        node.value = optimizeRawImages(node.value);
      }

      if (node.type === "element" && node.tagName === "img") {
        const src = node.properties?.src;
        if (typeof src === "string" && src.startsWith("/uploads/")) {
          node.properties.src = optimizedPath(src, 960);
          node.properties.srcSet = widths.map((width) => `${optimizedPath(src, width)} ${width}w`).join(", ");
          node.properties.sizes = "(max-width: 900px) 100vw, 62rem";
          node.properties.loading ??= "lazy";
          node.properties.decoding ??= "async";
        }
      }

      for (const child of node.children ?? []) visit(child);
    };

    visit(tree);
  };
}
