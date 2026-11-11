export type CardSwatch = { fill: string; ink: string; muted: string; accent: string; image: string; size: string };
export type CardColors = readonly [CardSwatch, CardSwatch, CardSwatch];
export type CardPalette = { id: string; label: string; description: string; bodyFont: string; titleFont: string; titleStyle: string; titleWeight: number; radius: string; combination: number; light: CardColors; dark: CardColors };
type Finish = 'flat' | 'grain' | 'glass' | 'linen' | 'wash' | 'diagonal' | 'rules' | 'dots' | 'glow' | 'speckle' | 'grid' | 'sunset';
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
  let high = mix(fill, '#fffaf0', dark ? .965 : .91);
  let low = mix(fill, '#171b1c', dark ? .98 : .96);
  let bloom = mix(fill, ['#de967c', '#e8be63', '#80b5a2'][tone], dark ? .94 : .83);
  const candidates = ['#101513', '#fffdf3'];
  const score = (ink: string) => Math.min(...[fill, high, low, bloom].map(bg => contrast(ink, bg)));
  let ink = candidates.reduce((a, b) => score(a) > score(b) ? a : b);
  // Mid-value pigments need a narrower finish range to keep type readable everywhere.
  if (score(ink) < 4.8) {
    high = mix(fill, '#fffaf0', .985); low = mix(fill, '#171b1c', .985); bloom = mix(fill, high, .5);
    ink = candidates.reduce((a, b) => score(a) > score(b) ? a : b);
  }
  if (score(ink) < 4.5) ink = ['#000000', '#ffffff'].reduce((a, b) => score(a) > score(b) ? a : b);
  const mutedCandidate = mix(ink, fill, .9);
  const muted = score(mutedCandidate) >= 4.6 ? mutedCandidate : ink;
  const images: Record<Finish, string> = {
    flat: 'none',
    grain: `repeating-radial-gradient(ellipse at 17% 31%,${low} 0 .55px,transparent .75px 3.5px),linear-gradient(125deg,${high},${fill})`,
    glass: `radial-gradient(ellipse at 8% 0%,${high},transparent 65%),linear-gradient(145deg,${fill},${low})`,
    linen: `repeating-linear-gradient(0deg,${low} 0 .6px,transparent .6px 4px),repeating-linear-gradient(90deg,${high} 0 .6px,transparent .6px 5px)`,
    wash: `radial-gradient(ellipse at 100% 0%,${bloom},transparent 65%),radial-gradient(ellipse at 0% 100%,${high},transparent 75%)`,
    diagonal: `linear-gradient(135deg,${high} 0%,${fill} 50%,${bloom} 100%)`,
    rules: `repeating-linear-gradient(0deg,transparent 0 31px,${low} 31px 32px)`,
    dots: `radial-gradient(circle,${low} .7px,transparent .9px)`,
    glow: `radial-gradient(ellipse at 0% 0%,${high},transparent 80%),linear-gradient(160deg,${fill},${bloom})`,
    speckle: `radial-gradient(circle at 20% 30%,${low} .8px,transparent 1px),radial-gradient(circle at 70% 80%,${high} .7px,transparent 1px)`,
    grid: `repeating-linear-gradient(0deg,transparent 0 23px,${low} 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,${low} 23px 24px)`,
    sunset: `linear-gradient(155deg,${high} 0%,${fill} 48%,${bloom} 100%)`,
  };
  const size = finish === 'grain' ? '7px 9px, auto' : finish === 'dots' ? '4px 4px' : finish === 'speckle' ? '11px 13px, 17px 19px' : 'auto';
  return { fill, ink, muted, accent: ink, image: images[finish], size };
}
function study(id: string, label: string, description: string, fills: readonly [string, string, string], night: readonly [string, string, string], finish: Finish, body: Font, title: Font, radius: string): CardPalette {
  const colors = (values: readonly [string, string, string], dark: boolean): CardColors => [swatch(values[0], 0, dark, finish), swatch(values[1], 1, dark, finish), swatch(values[2], 2, dark, finish)];
  return {
    id, label, description, combination: Number(id.match(/\d+/)?.[0]), bodyFont: fonts[body], titleFont: fonts[title], radius,
    titleStyle: finish === 'wash' || finish === 'sunset' ? 'italic' : 'normal',
    titleWeight: title === 'sans' || title === 'book' ? 600 : 500,
    light: colors(fills, false),
    dark: colors(night, true),
  };
}
/** Fifteen contrasting Wada combinations, digitized at https://sanzo-wada.dmbk.io/assets/colors.json.
 * Light uses the source colors except the retained softened 121 reference.
 * Each has an individually composed dark palette, finish, typography, and shape.
 * Only About’s top blocks and Enjoying Grid consume these tokens. */
export const cardPalettes: readonly CardPalette[] = [
  study("wada-166", "01 · 166 / Coral & forest", "Coral, butter yellow, and deep forest; ember, ochre, and pine after dark.", ["#ff616b", "#faed8f", "#0f261f"], ["#8a4a46", "#746735", "#203c31"], "flat", "serif", "book", "1.2rem"),
  study("wada-167", "02 · 167 / Aqua & indigo", "Ecru and icy aqua meet indigo; smoky brass, lagoon, and midnight at night.", ["#c0b490", "#abf5ed", "#003e83"], ["#615a45", "#3d6e69", "#1e355c"], "linen", "serif", "serif", ".7rem"),
  study("wada-174", "03 · 174 / Pink & plum", "Pink and lavender against plum; mulberry, dusty lilac, and aubergine at night.", ["#ffa6d9", "#bfabcc", "#6b2e63"], ["#75516b", "#62546e", "#49263f"], "glow", "sans", "book", "1.7rem"),
  study("wada-140", "04 · 140 / Amber & petrol", "Amber, petrol teal, and slate; tobacco, deep teal, and blue slate after dark.", ["#fa9442", "#008aa1", "#1b3644"], ["#885a35", "#255765", "#243b48"], "diagonal", "sans", "sans", "1rem"),
  study("wada-139", "05 · 139 / Blue hour", "Clear blue, near-black indigo, and mineral gray; storm, midnight, and sea glass at night.", ["#96bfe6", "#000831", "#b5d1cc"], ["#365d7e", "#101c37", "#4b6863"], "flat", "sans", "sans", "1.6rem"),
  study("wada-137", "06 · 137 / Vermilion & pistachio", "Red, cinnamon buff, and pistachio on grainy stock; oxblood, bronze, and fern at night.", ["#c9303e", "#ffbf6e", "#56aa69"], ["#772f3d", "#886239", "#3d664b"], "grain", "serif", "book", ".35rem"),
  study("wada-125", "07 · 125 / Seafoam & violet", "Fawn, seafoam, and violet-blue glass; rosewood, jade, and violet ink after dark.", ["#d1b0b3", "#29bdad", "#202d85"], ["#6f5056", "#286863", "#292f5c"], "glass", "sans", "sans", "1.9rem"),
  study("wada-160", "08 · 160 / Chartreuse atlas", "Sulphur yellow, umber, and Medici blue on a fine grid; moss gold, walnut, and peacock at night.", ["#baa600", "#5e4017", "#417777"], ["#756c29", "#493923", "#31595b"], "grid", "sans", "mono", ".4rem"),
  study("wada-231", "09 · 231 / Rose & electric blue", "Cameo pink, russet, and Olympic blue in a dot screen; mauve, mahogany, and cobalt at night.", ["#e6adcf", "#681916", "#4f8fe6"], ["#785769", "#482a2a", "#365580"], "dots", "sans", "sans", "1.1rem"),
  study("wada-178", "10 · 178 / Jade watercolor", "Ivory, glaucous blue, and jade pigment blooms; antique gold, malachite, and deep jade at night.", ["#ebd999", "#a6e6db", "#2dbc94"], ["#71633e", "#3b6866", "#2b5a4b"], "wash", "serif", "serif", "1.5rem"),
  study("wada-190", "11 · 190 / Vermilion & ink", "Ivory buff, orange-red, and black letterpress; old gold, burnt orange, and charcoal at night.", ["#ebd999", "#de4500", "#000000"], ["#726240", "#803c26", "#1d2220"], "grain", "serif", "book", ".25rem"),
  study("wada-180", "12 · 180 / Apricot & lilac", "Apricot, mauve, and gray-green in slanted light; copper, amethyst, and eucalyptus after dark.", ["#ffbf6e", "#9161f2", "#b5d1cc"], ["#85613d", "#58467f", "#50655f"], "diagonal", "sans", "sans", "1.4rem"),
  study("wada-200", "13 · 200 / Carmine garden", "Carmine, olive buff, and leaf green on notebook rules; wine, olive, and woodland at night.", ["#a10b2b", "#bcd382", "#66ab56"], ["#662b42", "#667147", "#35523a"], "rules", "serif", "serif", ".6rem"),
  study("wada-213", "14 · 213 / Sunlit sorbet", "Salmon, vivid yellow, and icy blue; dusty coral, saffron, and lagoon at night.", ["#f59994", "#ffe600", "#abf5ed"], ["#83534f", "#7c6d30", "#34676a"], "sunset", "sans", "book", "1.8rem"),
  study("wada-121-soft", "15 · 121 / Familiar earth", "The softened clay, peach, and sage reference; your earlier brown, salmon, and olive at night.", ["#cfb3a3", "#e7c4a6", "#b8c39d"], ["#4b3830", "#73543f", "#424c32"], "flat", "serif", "serif", "1.3rem"),
];
