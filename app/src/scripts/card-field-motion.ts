/** Drift cached color fields through the refraction layer; never animate content or noise generation. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let enabled = true;
try { enabled = sessionStorage.getItem('will-card-motion') !== 'paused'; } catch {}
let cards: HTMLElement[] = [];
const visible = new Set<Element>();
let intersection: IntersectionObserver | undefined;
let layout: MutationObserver | undefined;
function update() {
  const state = reduced.matches ? 'reduced' : enabled ? 'running' : 'paused';
  document.documentElement.dataset.cardMotion = state;
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
reduced.addEventListener('change', update);
document.addEventListener('visibilitychange', update);
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);
init();
