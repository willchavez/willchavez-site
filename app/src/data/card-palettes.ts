export type CardSwatch = { fill: string; ink: string; muted: string; accent: string };
export type CardColors = readonly [CardSwatch, CardSwatch, CardSwatch];
export type CardPalette = { id: string; label: string; combination: number; colorNames: readonly string[]; light: CardColors; dark: CardColors };
/** Wada triads from A Dictionary of Color Combinations, digitized at https://sanzo-wada.dmbk.io/assets/colors.json.
 * Light uses the reference hex values except the softened 121 study; dark adapts their hues for lower-light surfaces.
 * Per-swatch text preserves readable contrast without flattening the original combinations.
 * Only About’s top blocks and Enjoying Grid consume these tokens. */
export const cardPalettes = [
  {
    id: "wada-203", label: "203 · Lemon, cinnamon & moss", combination: 203,
    colorNames: ["Pale Lemon Yellow", "Vinaceous Cinnamon", "Lincoln Green"],
    light: [
      {"fill": "#fff59e", "ink": "#17201f", "muted": "#3c4233", "accent": "#17201f"},
      {"fill": "#f59994", "ink": "#17201f", "muted": "#3b3332", "accent": "#17201f"},
      {"fill": "#405416", "ink": "#fcf8eb", "muted": "#dedec9", "accent": "#fcf8eb"},
    ],
    dark: [
      {"fill": "#6a6325", "ink": "#fcf8eb", "muted": "#e5e0cb", "accent": "#fcf8eb"},
      {"fill": "#6a2925", "ink": "#fcf8eb", "muted": "#e5d7cb", "accent": "#fcf8eb"},
      {"fill": "#2d3914", "ink": "#fcf8eb", "muted": "#dbd9c9", "accent": "#fcf8eb"},
    ],
  },
  {
    id: "wada-167", label: "167 · Ecru, pale blue & indigo", combination: 167,
    colorNames: ["Ecru", "Pale King's Blue", "Vandar Poel's Blue"],
    light: [
      {"fill": "#c0b490", "ink": "#17201f", "muted": "#323831", "accent": "#17201f"},
      {"fill": "#abf5ed", "ink": "#17201f", "muted": "#2f4240", "accent": "#17201f"},
      {"fill": "#003e83", "ink": "#fcf8eb", "muted": "#d4dada", "accent": "#fcf8eb"},
    ],
    dark: [
      {"fill": "#5b5134", "ink": "#fcf8eb", "muted": "#e2ddce", "accent": "#fcf8eb"},
      {"fill": "#256a62", "ink": "#fcf8eb", "muted": "#dae1d5", "accent": "#fcf8eb"},
      {"fill": "#142539", "ink": "#fcf8eb", "muted": "#d7d6cf", "accent": "#fcf8eb"},
    ],
  },
  {
    id: "wada-174", label: "174 · Pink, lavender & taupe", combination: 174,
    colorNames: ["Corinthian Pink", "Grayish Lavender - B", "Taupe Brown"],
    light: [
      {"fill": "#ffa6d9", "ink": "#17201f", "muted": "#3c353d", "accent": "#17201f"},
      {"fill": "#bfabcc", "ink": "#17201f", "muted": "#32363b", "accent": "#17201f"},
      {"fill": "#6b2e63", "ink": "#fcf8eb", "muted": "#e5d8d5", "accent": "#fcf8eb"},
    ],
    dark: [
      {"fill": "#6a254c", "ink": "#fcf8eb", "muted": "#e5d6d2", "accent": "#fcf8eb"},
      {"fill": "#4b3659", "ink": "#fcf8eb", "muted": "#e0d9d4", "accent": "#fcf8eb"},
      {"fill": "#351731", "ink": "#fcf8eb", "muted": "#dcd4cd", "accent": "#fcf8eb"},
    ],
  },
  {
    id: "wada-121", label: "121 · Brown, salmon & olive", combination: 121,
    colorNames: ["Brown", "Ochraceous Salmon", "Lincoln Green"],
    light: [
      {"fill": "#cfb3a3", "ink": "#3d342d", "muted": "#514338", "accent": "#3d342d"},
      {"fill": "#e7c4a6", "ink": "#3d342d", "muted": "#584a3f", "accent": "#3d342d"},
      {"fill": "#b8c39d", "ink": "#30382b", "muted": "#454e3a", "accent": "#30382b"},
    ],
    dark: [
      {"fill": "#4b3830", "ink": "#fcf8eb", "muted": "#ddd5c9", "accent": "#fcf8eb"},
      {"fill": "#73543f", "ink": "#fcf8eb", "muted": "#e5dbcb", "accent": "#fcf8eb"},
      {"fill": "#424c32", "ink": "#fcf8eb", "muted": "#dbd9c9", "accent": "#fcf8eb"},
    ],
  },
  {
    id: "wada-140", label: "140 · Gold, teal & slate", combination: 140,
    colorNames: ["Golden Yellow", "Antwarp Blue", "Slate Color"],
    light: [
      {"fill": "#fa9442", "ink": "#17201f", "muted": "#3b3325", "accent": "#17201f"},
      {"fill": "#008aa1", "ink": "#0d1413", "muted": "#0d1413", "accent": "#0d1413"},
      {"fill": "#1b3644", "ink": "#fcf8eb", "muted": "#d8d9d0", "accent": "#fcf8eb"},
    ],
    dark: [
      {"fill": "#694325", "ink": "#fcf8eb", "muted": "#e4dbcb", "accent": "#fcf8eb"},
      {"fill": "#143339", "ink": "#fcf8eb", "muted": "#d7d8cf", "accent": "#fcf8eb"},
      {"fill": "#162b37", "ink": "#fcf8eb", "muted": "#d7d7ce", "accent": "#fcf8eb"},
    ],
  },
  {
    id: "wada-235", label: "235 · Ivory, orange & lavender", combination: 235,
    colorNames: ["Ivory Buff", "Yellow Orange", "Grayish Lavender - B"],
    light: [
      {"fill": "#ebd999", "ink": "#17201f", "muted": "#393e33", "accent": "#17201f"},
      {"fill": "#ff8c00", "ink": "#17201f", "muted": "#3c311a", "accent": "#17201f"},
      {"fill": "#bfabcc", "ink": "#17201f", "muted": "#32363b", "accent": "#17201f"},
    ],
    dark: [
      {"fill": "#6a5b25", "ink": "#fcf8eb", "muted": "#e5dfcb", "accent": "#fcf8eb"},
      {"fill": "#553c1e", "ink": "#fcf8eb", "muted": "#e1daca", "accent": "#fcf8eb"},
      {"fill": "#4b3659", "ink": "#fcf8eb", "muted": "#e0d9d4", "accent": "#fcf8eb"},
    ],
  },
] as const satisfies readonly CardPalette[];
