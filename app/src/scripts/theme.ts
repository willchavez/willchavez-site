import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';
declare global { interface Window { willThemePreference?: 'light' | 'dark' | null } }
const system = matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const buttons = new WeakSet<HTMLButtonElement>();
const angles = new WeakMap<HTMLButtonElement, number>();
const theme = () => window.willThemePreference || (system.matches ? 'dark' : 'light');
function sync(animate = false) {
  const selected = theme();
  document.documentElement.dataset.theme = selected;
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(button => {
    const nextLabel = `Switch to ${selected === 'dark' ? 'light' : 'dark'} mode`;
    button.setAttribute('aria-label', nextLabel);
    button.title = nextLabel;
    button.setAttribute('aria-pressed', String(selected === 'dark'));
    if (animate && angles.has(button)) {
      const angle = angles.get(button)!;
      // Keep rotating forward through each half turn, including rapid clicks.
      const next = angle + (Math.round(angle / 180) % 2 === (selected === 'dark' ? 1 : 0) ? 0 : 180);
      angles.set(button, next);
      button.style.setProperty('--orbit-angle', `${next}deg`);
    }
  });
}
function init() {
  sync();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(button => {
    if (buttons.has(button)) return;
    buttons.add(button);
    button.hidden = false;
    document.querySelectorAll<HTMLElement>('[data-theme-fallback]').forEach(fallback => fallback.hidden = true);
    const angle = theme() === 'dark' ? 180 : 0;
    angles.set(button, angle);
    button.style.setProperty('--orbit-angle', `${reducedMotion.matches ? angle : angle - 110}deg`);
    button.addEventListener('click', () => {
      window.willThemePreference = theme() === 'dark' ? 'light' : 'dark';
      try { sessionStorage.setItem('will-theme', window.willThemePreference); } catch {}
      sync(true);
    });
    const image = button.querySelector('img');
    void (image?.decode().catch(() => {}) || Promise.resolve()).then(() => {
      // Two frames establish the below-horizon start before the first rise.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        button.dataset.orbitReady = '';
        button.style.setProperty('--orbit-angle', `${angles.get(button)}deg`);
      }));
    });
  });
}
system.addEventListener('change', () => { if (!window.willThemePreference) sync(true); });
addEventListener('storage', event => {
  try { if (event.storageArea !== sessionStorage) return; } catch { return; }
  if (event.key !== 'will-theme' && event.key !== null) return;
  window.willThemePreference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
  sync(true);
});
document.addEventListener('astro:before-swap', (event: TransitionBeforeSwapEvent) => {
  event.newDocument.documentElement.dataset.theme = theme();
});
document.addEventListener('astro:page-load', init);
init();
