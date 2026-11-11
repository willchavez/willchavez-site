import { pigmentImage, type PigmentFinish } from './card-surfaces';
export type CardSwatch = { fill: string; ink: string; muted: string; accent: string; image: string; size: string };
export type CardColors = readonly [CardSwatch, CardSwatch, CardSwatch];
export type CardPalette = { id: string; label: string; description: string; bodyFont: string; titleFont: string; titleStyle: string; titleWeight: number; radius: string; light: CardColors; dark: CardColors };
type Finish = PigmentFinish;
type Font = keyof typeof fonts;
const fonts = {
  serif: '"Source Serif 4", Georgia, serif',
  book: 'Georgia, "Times New Roman", serif',
  sans: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
};
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => '#' + rgb(a).map((v, i) => Math.round(v * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
function luminance(hex: string) {
  return rgb(hex).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
}
function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
function swatch(fill: string, tone: number, dark: boolean, finish: Finish): CardSwatch {
  const candidates = ['#101513', '#fffdf3', '#000000', '#ffffff'];
  let ink = candidates.slice(0, 2).reduce((a, b) => contrast(a, fill) > contrast(b, fill) ? a : b);
  if (contrast(ink, fill) < 5) ink = candidates.reduce((a, b) => contrast(a, fill) > contrast(b, fill) ? a : b);
  const floor = Math.min(4.9, contrast(ink, fill) - .01);
  const safe = (color: string) => {
    for (let i = 0; i < 16 && contrast(ink, color) < floor; i++) color = mix(color, fill, .7);
    return color;
  };
  let high = safe(mix(fill, '#f7efdd', dark ? .65 : .55));
  let low = safe(mix(fill, '#182322', dark ? .55 : .65));
  let bloom = safe(mix(fill, ['#b89b66', '#a6c0af', '#a76b5c'][tone], dark ? .4 : .4));
  const corner = (maximum: boolean) => '#' + [0, 1, 2].map(i => (maximum ? Math.max : Math.min)(...[fill, high, low, bloom].map(color => rgb(color)[i])).toString(16).padStart(2, '0')).join('');
  const score = (text: string) => Math.min(...[fill, high, low, bloom, corner(false), corner(true)].map(bg => contrast(text, bg)));
  for (let i = 0; i < 16 && score(ink) < floor; i++) {
    high = mix(high, fill, .8); low = mix(low, fill, .8); bloom = mix(bloom, fill, .8);
  }
  const candidate = mix(ink, fill, .9);
  const muted = score(candidate) >= 4.6 ? candidate : ink;
  return { fill, ink, muted, accent: ink, image: pigmentImage(finish, fill, low, high, bloom, 17 + tone * 29), size: '100% 100%' };
}

function study(id: string, label: string, description: string, fills: readonly [string, string, string], night: readonly [string, string, string], finish: Finish, body: Font, title: Font, radius: string): CardPalette {
  const colors = (values: readonly [string, string, string], dark: boolean): CardColors => [swatch(values[0], 0, dark, finish), swatch(values[1], 1, dark, finish), swatch(values[2], 2, dark, finish)];
  return {
    id, label, description, bodyFont: fonts[body], titleFont: fonts[title], radius,
    titleStyle: finish === 'velvet' ? 'italic' : 'normal',
    titleWeight: title === 'sans' || title === 'book' ? 600 : 500,
    light: colors(fills, false),
    dark: colors(night, true),
  };
}
/** New combinations built from Will’s favorite Wada pigments (125, 139, 140, 160, 167, 200, 231).
 * These are original pairings, not numbered Wada reproductions. Burnished amber replaces the sorbet orange.
 * Surface references: tarng.com (broad turbulence and displacement), CSS-Tricks “Grainy Gradients” (paper tooth).
 * Only About’s top blocks and Enjoying Grid consume these tokens. */
export const cardPalettes: readonly CardPalette[] = [
  study("pigment-01", "01 \u00b7 Smoked brass", "Smoky brass, mineral gray, and deep russet in clouded pigment.", ["#615a45", "#b5d1cc", "#681916"], ["#534e3c", "#425b56", "#4f2427"], "cloud", "serif", "book", "1.2rem"),
  study("pigment-02", "02 \u00b7 Fawn lithograph", "Fawn and sulphur yellow, anchored by blue-black ink. Fine paper tooth.", ["#d1b0b3", "#baa600", "#293e40"], ["#6f5056", "#756c29", "#233b3e"], "paper", "sans", "sans", ".6rem"),
  study("pigment-03", "03 \u00b7 Olive ink bath", "Olive buff, russet, and chalk with broad, refracted color fields.", ["#bcd382", "#681916", "#e7e2d4"], ["#667147", "#482a2a", "#524e44"], "marble", "serif", "serif", "1.5rem"),
  study("pigment-04", "04 \u00b7 Burnished amber", "Antique amber, mineral gray, and walnut with a brushed finish.", ["#b48643", "#b5d1cc", "#49382d"], ["#795c36", "#4b6863", "#3f3029"], "brushed", "sans", "sans", "1rem"),
  study("pigment-05", "05 \u00b7 Fawn after smoke", "Fawn, smoky brass, and charcoal with soft pools of pigment.", ["#d1b0b3", "#615a45", "#263237"], ["#71585e", "#57513c", "#26353a"], "cloud", "serif", "book", "1.7rem"),
  study("pigment-06", "06 \u00b7 Sulphur prism", "Sulphur yellow, mineral smoke, and russet. Broad color fields with refracted edges.", ["#baa600", "#b6beb5", "#681916"], ["#776d2b", "#4d5b55", "#51282c"], "contour", "sans", "mono", ".4rem"),
  study("pigment-07", "07 \u00b7 Mineral velvet", "Mineral gray, olive buff, and deep ink with diffuse, velvety light.", ["#b5d1cc", "#bcd382", "#263d40"], ["#405f5b", "#65704a", "#243e42"], "velvet", "serif", "serif", "1.6rem"),
  study("pigment-08", "08 \u00b7 Russet edition", "Russet, fawn, and limestone on softly grained stock.", ["#681916", "#d1b0b3", "#d9d6c8"], ["#572b2b", "#725762", "#514e44"], "paper", "serif", "book", ".3rem"),
  study("pigment-09", "09 \u00b7 Amber stone", "Burnished amber, olive buff, and graphite in flowing, refracted layers.", ["#bd8a3e", "#bcd382", "#303c3b"], ["#805f37", "#596344", "#293b3a"], "marble", "sans", "sans", "1.3rem"),
  study("pigment-10", "10 \u00b7 Brass foil", "Smoky brass, sulphur yellow, and chalk with fine raked grain.", ["#615a45", "#baa600", "#e9e3d4"], ["#615a45", "#746b2d", "#514b3e"], "brushed", "serif", "book", ".7rem"),
  study("pigment-11", "11 \u00b7 Mineral wine", "Mineral gray, fawn, and wine. Clouded color with clean editorial type.", ["#b5d1cc", "#d1b0b3", "#5c2632"], ["#4b6863", "#6f5056", "#4b2732"], "cloud", "sans", "book", "1.4rem"),
  study("pigment-12", "12 \u00b7 Olive atmosphere", "Olive buff and fawn, grounded by smoky green. Soft atmospheric fields.", ["#bcd382", "#d1b0b3", "#454e42"], ["#667147", "#6e5258", "#364739"], "velvet", "serif", "serif", "1.8rem"),
  study("pigment-13", "13 \u00b7 Russet gold", "Deep russet, antique amber, and porcelain, with fine print grain.", ["#681916", "#b48643", "#e9e5da"], ["#562b2a", "#7b603b", "#514c40"], "paper", "serif", "book", ".5rem"),
  study("pigment-14", "14 \u00b7 Fawn mineral swirl", "Fawn, sulphur, and mineral gray with broad color refraction.", ["#d1b0b3", "#baa600", "#b5d1cc"], ["#70505c", "#736c30", "#416260"], "marble", "sans", "sans", "1.9rem"),
  study("pigment-15", "15 \u00b7 Earth rebalanced", "Earthy brown, mineral gray, and smoky brass; deeper anchors and diffused light.", ["#8b664c", "#b5d1cc", "#615a45"], ["#604636", "#4c6259", "#615a45"], "velvet", "serif", "book", "1.1rem"),
];
