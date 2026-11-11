/** Drift cached color fields through the refraction layer; never animate content or noise generation. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const speeds = { slow: 1, medium: 2, fast: 4, 'extra-fast': 8 } as const;
type Speed = keyof typeof speeds;
let enabled = true;
let speed: Speed = 'slow';
try { enabled = sessionStorage.getItem('will-card-motion') !== 'paused'; } catch {}
try {
  const saved = sessionStorage.getItem('will-card-speed');
  if (saved && Object.hasOwn(speeds, saved)) speed = saved as Speed;
} catch {}
const appliedRates = new WeakMap<Animation, number>();
let cards: HTMLElement[] = [];
const visible = new Set<Element>();
let intersection: IntersectionObserver | undefined;
let layout: MutationObserver | undefined;
function update() {
  const state = reduced.matches ? 'reduced' : enabled ? 'running' : 'paused';
  document.documentElement.dataset.cardMotion = state;
  document.documentElement.dataset.cardSpeed = speed;
  document.querySelectorAll<HTMLSelectElement>('[data-card-motion-speed]').forEach(select => {
    select.value = speed;
    select.disabled = reduced.matches;
    select.title = reduced.matches ? 'Your device’s Reduce Motion preference is on.' : '';
  });
  document.querySelectorAll<HTMLButtonElement>('[data-card-motion-toggle]').forEach(button => {
    button.textContent = reduced.matches ? 'Reduced motion' : enabled ? 'Pause motion' : 'Play motion';
    button.disabled = reduced.matches;
    button.title = reduced.matches ? 'Your device’s Reduce Motion preference is on.' : '';
  });
  cards.forEach(card => {
    const results = card.closest<HTMLElement>('#enjoying-results');
    const active = state === 'running' && !document.hidden && visible.has(card) && !card.hidden && (!results || results.dataset.view === 'grid' && !results.hasAttribute('data-rearranging'));
    if (active) card.dataset.fieldReady = '';
    card.toggleAttribute('data-field-moving', active);
    if (card.hasAttribute('data-field-ready')) {
      card.getAnimations({ subtree: true }).forEach(animation => {
        if (!(animation instanceof CSSAnimation) || animation.animationName !== 'pigment-drift' || appliedRates.get(animation) === speeds[speed]) return;
        // Preserve the current phase instead of restarting when the speed changes.
        animation.updatePlaybackRate(speeds[speed]);
        appliedRates.set(animation, speeds[speed]);
      });
    }
  });
}
function cleanup() {
  intersection?.disconnect(); layout?.disconnect();
  cards.forEach(card => card.removeAttribute('data-field-moving'));
  cards = []; visible.clear();
}
function init() {
  cleanup();
  cards = Array.from(document.querySelectorAll<HTMLElement>('.about-cards .about-card, #enjoying-results #list .ent:not([data-layout-exit])'));
  cards.forEach((card, i) => {
    card.style.setProperty('--field-duration', `${18 + i % 4 * 2}s`);
    card.style.setProperty('--field-delay', `${-(i % 7) * 2.7}s`);
  });
  intersection = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    update();
  });
  cards.forEach(card => intersection!.observe(card));
  const results = document.querySelector('#enjoying-results');
  if (results) {
    layout = new MutationObserver(update);
    layout.observe(results, { attributes: true, attributeFilter: ['data-view', 'data-rearranging'] });
  }
  update();
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element) || !event.target.closest('[data-card-motion-toggle]') || reduced.matches) return;
  enabled = !enabled;
  try { sessionStorage.setItem('will-card-motion', enabled ? 'running' : 'paused'); } catch {}
  update();
});
document.addEventListener('change', event => {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement) || !select.matches('[data-card-motion-speed]') || reduced.matches || !Object.hasOwn(speeds, select.value)) return;
  speed = select.value as Speed;
  try { sessionStorage.setItem('will-card-speed', speed); } catch {}
  update();
});
reduced.addEventListener('change', update);
document.addEventListener('visibilitychange', update);
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);
init();
