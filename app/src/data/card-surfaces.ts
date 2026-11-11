/** Two-stage color field: broad saturated turbulence, then independent displacement. */
export type PigmentFinish = 'cloud' | 'paper' | 'marble' | 'brushed' | 'contour' | 'velvet';
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
function colorField(input: string, colors: string[], alpha: string, result = "pigment") {
  const values = colors.map(rgb);
  // Preserve independent RGB channels, unlike the old grayscale/duotone texture.
  return `<feComponentTransfer in="${input}" result="${result}">${['R', 'G', 'B'].map((channel, i) => `<feFunc${channel} type="table" tableValues="${values.map(v => v[i].toFixed(5)).join(' ')}"/>`).join('')}<feFuncA type="table" tableValues="${alpha}"/></feComponentTransfer>`;
}
export function pigmentImage(kind: PigmentFinish, fill: string, low: string, high: string, bloom: string, seed: number) {
  const frequency = kind === 'velvet' ? '.0008' : kind === 'brushed' ? '.001 .0015' : '.001';
  const scale = kind === 'marble' || kind === 'contour' ? 100 : kind === 'velvet' ? 45 : 70;
  const broad = `<feTurbulence type="turbulence" baseFrequency="${frequency}" numOctaves="1" seed="${seed + 12007}" result="color-noise"/><feColorMatrix in="color-noise" type="saturate" values="4" result="chroma"/>${colorField('chroma', [low, fill, bloom, high], '.65 .8 .95 1')}<feGaussianBlur in="pigment" stdDeviation="35" result="soft-pigment"/>`;
  const displacement = `<feTurbulence type="turbulence" baseFrequency=".003" numOctaves="1" seed="${seed + 31}" result="refraction"/><feDisplacementMap in="soft-pigment" in2="refraction" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="displaced"/><feGaussianBlur in="displaced" stdDeviation="22" result="bent"/>`;
  // Very light tooth is secondary to the broad field, not the main visual.
  const grainFrequency = kind === 'brushed' ? '.015 .3' : '.55';
  const grainAmount = kind === 'paper' || kind === 'brushed' ? '.025' : '.006';
  const grain = `<feTurbulence type="fractalNoise" baseFrequency="${grainFrequency}" numOctaves="2" seed="${seed + 9}" result="grain"/><feColorMatrix in="grain" type="saturate" values="0" result="grain-mono"/>${colorField('grain-mono', [low, high], '1 1', 'grain-ink')}<feComposite in="bent" in2="grain-ink" operator="arithmetic" k1="0" k2="${1 - Number(grainAmount)}" k3="${grainAmount}" k4="0"/>`;
  // Large viewBox = Tarng's broad spatial scale, with a modest raster size for repeated cards.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 2000 2000" preserveAspectRatio="none"><defs><filter id="pigment" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">${broad}${displacement}${grain}</filter></defs><rect width="2000" height="2000" filter="url(#pigment)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
