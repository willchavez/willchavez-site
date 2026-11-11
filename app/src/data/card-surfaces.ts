/** Static SVG surfaces: turbulence affects the pigment image, never text or media. */
export type PigmentFinish = 'cloud' | 'paper' | 'marble' | 'brushed' | 'contour' | 'velvet';
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
function ramp(id: string, input: string, a: string, b: string, contour = false) {
  const aa = rgb(a), bb = rgb(b);
  const steps = contour ? [0, .15, .65, .65, .25, .8, .8, 1] : [0, 1];
  return `<feColorMatrix in="${input}" type="saturate" values="0" result="mono-${id}"/><feComponentTransfer in="mono-${id}" result="${id}">${['R', 'G', 'B'].map((c, i) => `<feFunc${c} type="${contour ? 'discrete' : 'table'}" tableValues="${steps.map(t => (aa[i] + (bb[i] - aa[i]) * t).toFixed(5)).join(' ')}"/>`).join('')}<feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer>`;
}
export function pigmentImage(kind: PigmentFinish, fill: string, low: string, high: string, bloom: string, seed: number) {
  const frequency = kind === 'brushed' ? '.008 .18' : kind === 'velvet' ? '.003 .005' : '.006 .009';
  const field = `<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="${kind === 'velvet' ? 1 : 2}" seed="${seed}" stitchTiles="stitch" result="field"/>`;
  const grain = `<feTurbulence type="fractalNoise" baseFrequency=".68" numOctaves="3" seed="${seed + 9}" stitchTiles="stitch" result="grain"/>`;
  let filter: string;
  let artwork = '<rect width="600" height="800" filter="url(#pigment)"/>';
  let definitions = '';
  if (kind === 'paper') {
    filter = grain + ramp('ink', 'grain', low, high);
  } else if (kind === 'marble') {
    definitions = `<linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${high}"/><stop offset=".45" stop-color="${fill}"/><stop offset="1" stop-color="${bloom}"/></linearGradient>`;
    filter = field + '<feDisplacementMap in="SourceGraphic" in2="field" scale="110" xChannelSelector="R" yChannelSelector="G"/>';
    artwork = `<g filter="url(#pigment)"><rect x="-140" y="-140" width="880" height="1080" fill="url(#wash)"/><path d="M-120 170C100 20 170 380 360 210S700 80 740 460" fill="none" stroke="${low}" stroke-width="105"/><path d="M-100 650C150 350 320 920 710 530" fill="none" stroke="${high}" stroke-width="135"/></g>`;
  } else {
    filter = field + ramp('dye', 'field', low, bloom, kind === 'contour') + grain + ramp('tooth', 'grain', low, high) + `<feComposite in="dye" in2="tooth" operator="arithmetic" k1="0" k2="${kind === 'brushed' ? '.66' : '.87'}" k3="${kind === 'brushed' ? '.34' : '.13'}" k4="0"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" preserveAspectRatio="none"><defs>${definitions}<filter id="pigment" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">${filter}</filter></defs>${artwork}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
