export type CardSwatch = { fill: string; ink: string; muted: string; accent: string; image: string; size: string };
export type CardColors = readonly [CardSwatch, CardSwatch, CardSwatch];
export type CardPalette = { id: string; label: string; description: string; bodyFont: string; titleFont: string; titleStyle: string; titleWeight: number; radius: string; light: CardColors; dark: CardColors };
type Finish = 'flat' | 'grain' | 'glass' | 'linen' | 'wash' | 'diagonal' | 'rules' | 'dots' | 'glow' | 'speckle' | 'grid' | 'sunset';
type Font = keyof typeof fonts;
const fonts = {
  serif: '"Source Serif 4", Georgia, serif',
  book: 'Georgia, "Times New Roman", serif',
  sans: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
};
const darkFills = ['#4b3830', '#73543f', '#424c32'] as const;
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => '#' + rgb(a).map((v, i) => Math.round(v * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
function swatch(fill: string, tone: number, dark: boolean, finish: Finish): CardSwatch {
  const ink = dark ? '#fcf8eb' : tone === 2 ? '#303c2b' : '#3d342d';
  const high = mix(fill, '#fffaf0', dark ? .965 : .91);
  const low = mix(fill, '#30271e', dark ? .98 : .96);
  const bloom = mix(fill, ['#bc9276', '#dca47b', '#9eaf7e'][tone], dark ? .965 : .83);
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
  return { fill, ink, muted: mix(ink, fill, .9), accent: ink, image: images[finish], size };
}
function study(id: string, label: string, description: string, fills: readonly [string, string, string], finish: Finish, body: Font, title: Font, radius: string): CardPalette {
  const colors = (values: readonly [string, string, string], dark: boolean): CardColors => [swatch(values[0], 0, dark, finish), swatch(values[1], 1, dark, finish), swatch(values[2], 2, dark, finish)];
  return {
    id, label, description, bodyFont: fonts[body], titleFont: fonts[title], radius,
    titleStyle: finish === 'wash' || finish === 'sunset' ? 'italic' : 'normal',
    titleWeight: title === 'sans' || title === 'book' ? 600 : 500,
    light: colors(fills, false),
    dark: colors(darkFills, true),
  };
}
/** Original studies of Wada 121: Brown, Ochraceous Salmon, Lincoln Green.
 * Reference: https://sanzo-wada.dmbk.io/assets/colors.json. These are adaptations, not original swatches.
 * The approved dark fills stay unchanged; only finishes and typography vary.
 * Only About’s top blocks and Enjoying Grid consume these tokens. */
export const cardPalettes: readonly CardPalette[] = [
  study('wada-121', '01 · Porcelain', 'Ivory paper, peach mist, and pale sage. Spacious serif type.', ['#eee6dd', '#f5e9dd', '#e7ebdc'], 'flat', 'serif', 'serif', '1.3rem'),
  study('121-rice', '02 · Rice paper', 'Warm fibers and mineral inks, like a small printed book.', ['#e8dfd1', '#efddc8', '#dde3cc'], 'grain', 'serif', 'serif', '1rem'),
  study('121-chalk', '03 · Chalk pastels', 'Powdery clay, apricot, and sage with clean sans-serif type.', ['#e5d7d0', '#f1dfcd', '#d9e2d1'], 'flat', 'sans', 'sans', '1.5rem'),
  study('121-glass', '04 · Milk glass', 'Soft light over pale colored glass. Clean type and generous corners.', ['#e8dfd7', '#f0e2d4', '#dfe7d7'], 'glass', 'sans', 'sans', '1.8rem'),
  study('121-linen', '05 · Natural linen', 'Fine woven lines on oat, flax, and eucalyptus.', ['#e7dece', '#efe0cd', '#dce1cb'], 'linen', 'serif', 'serif', '.8rem'),
  study('121-wash', '06 · Watercolor', 'Diffuse pigment blooms and flowing italic headings.', ['#efe7df', '#f5e7db', '#e9eddf'], 'wash', 'serif', 'serif', '1.5rem'),
  study('121-dune', '07 · Dune', 'Diagonal light across sandy clay and sage, with modern type.', ['#e5d4c3', '#f0dcc2', '#dae1c6'], 'diagonal', 'sans', 'sans', '1.2rem'),
  study('121-herbarium', '08 · Herbarium', 'Faint notebook rules and botanical green ink on paper.', ['#eee9dc', '#f3e8d8', '#e2e8d5'], 'rules', 'serif', 'serif', '.6rem'),
  study('121-press', '09 · Letterpress', 'Dense warm inks, grainy stock, and sturdy bookish headings.', ['#d9c5b2', '#edcfb2', '#c8d1b4'], 'grain', 'serif', 'book', '.4rem'),
  study('121-riso', '10 · Risograph', 'A fine dot screen on faded terracotta, peach, and olive.', ['#e2c9bc', '#efcfb3', '#cbd6b5'], 'dots', 'sans', 'sans', '1rem'),
  study('121-atelier', '11 · Atelier', 'Nearly white surfaces and an expressive, high-contrast serif.', ['#f4efea', '#f8efe5', '#edf0e4'], 'glow', 'serif', 'book', '1.5rem'),
  study('121-stone', '12 · Mineral', 'Cool stone and dusty sage with tiny flecks and crisp sans headings.', ['#ddd8d0', '#e8ded2', '#d5ddd0'], 'speckle', 'serif', 'sans', '1.1rem'),
  study('121-index', '13 · Field index', 'Fine graph-paper lines and monospaced headings for a collected feel.', ['#ede7dc', '#f3e5d2', '#e3e8d7'], 'grid', 'sans', 'mono', '.5rem'),
  study('121-sunset', '14 · Faded sunset', 'Peach-to-paper gradients and gently slanted literary headings.', ['#ead9cf', '#f3deca', '#e0e5cc'], 'sunset', 'serif', 'book', '1.7rem'),
  study('121-soft', '15 · Soft 121 — original', 'The previous softened clay, peach, and sage, for comparison.', ['#cfb3a3', '#e7c4a6', '#b8c39d'], 'flat', 'serif', 'serif', '1.3rem'),
];
