import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';
import { cardPalettes } from '../data/card-palettes';
const ids = cardPalettes.map(p => p.id as string);
let choice = document.documentElement.dataset.cardPalette || ids[0];
function sync() {
  document.documentElement.dataset.cardPalette = choice;
  document.querySelectorAll<HTMLSelectElement>('[data-card-color-choice]').forEach(el => el.value = choice);
  document.querySelectorAll('[data-card-color-description]').forEach(el => el.textContent = cardPalettes.find(p => p.id === choice)?.description || '');
  document.querySelectorAll<HTMLElement>('[data-card-colors-picker]').forEach(el => el.hidden = false);
}
function select(value: string) {
  if (!ids.includes(value)) return;
  choice = value;
  try { sessionStorage.setItem('will-card-palette', choice); } catch {}
  sync();
  document.querySelectorAll('[data-card-color-status]').forEach(el => el.textContent = `${cardPalettes.find(p => p.id === choice)?.label} card colors`);
}
document.addEventListener('change', event => {
  const el = event.target;
  if (el instanceof HTMLSelectElement && el.matches('[data-card-color-choice]')) select(el.value);
});
document.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('[data-card-color-next]')) select(ids[(ids.indexOf(choice) + 1) % ids.length]);
  if (event.target instanceof Element && event.target.closest('[data-card-color-prev]')) select(ids[(ids.indexOf(choice) - 1 + ids.length) % ids.length]);
  document.querySelectorAll<HTMLDetailsElement>('[data-card-colors-picker]').forEach(el => { if (!el.contains(event.target as Node)) el.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll<HTMLDetailsElement>('[data-card-colors-picker][open]').forEach(el => { el.open = false; el.querySelector('summary')?.focus(); });
});
document.addEventListener('astro:before-swap', (event: TransitionBeforeSwapEvent) => event.newDocument.documentElement.dataset.cardPalette = choice);
document.addEventListener('astro:page-load', sync);
sync();
