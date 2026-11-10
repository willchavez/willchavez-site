let cleanup = () => {};
function init() {
  cleanup();
  const control = document.querySelector<HTMLElement>('[data-layout-playground]');
  const root = document.documentElement;
  if (!control) { delete root.dataset.layoutExperiment; return; }
  const container = document.querySelector<HTMLElement>('.note-list, #enjoying-results #list, #portfolio-results .portfolio-grid');
  if (!container) return;
  const cards = Array.from(container.children) as HTMLElement[];
  const controller = new AbortController();
  let frame = 0;
  let active = true;
  let mode = 'cascade';
  const valid = ['cascade', 'editorial', 'cards'];
  const fromURL = new URL(location.href).searchParams.get('layout');
  try { mode = fromURL || sessionStorage.getItem('preview-layout') || mode; } catch { mode = fromURL || mode; }
  if (!valid.includes(mode)) mode = 'cascade';
  const measure = () => {
    frame = 0;
    if (!active) return;
    container.querySelectorAll<HTMLImageElement>('img[srcset]').forEach(image => {
      const width = Math.ceil(image.getBoundingClientRect().width);
      if (width) image.sizes = `${width}px`;
    });
    const visible = cards.filter(card => !card.hidden);
    const pattern = ['lead', 'compact', 'visual', 'text', 'compact', 'visual', 'lead', 'compact'];
    visible.forEach((card, index) => {
      card.dataset.tile = pattern[index % pattern.length];
      card.style.removeProperty('grid-row-end');
    });
    if (mode === 'cards' || innerWidth < 700) { delete container.dataset.cascadeReady; return; }
    container.dataset.cascadeReady = '';
    const style = getComputedStyle(container);
    const unit = parseFloat(style.gridAutoRows) + parseFloat(style.rowGap);
    if (!Number.isFinite(unit)) return;
    // Start-aligned cards retain their natural height, independent of the span.
    const spans = visible.map(card => Math.ceil((card.getBoundingClientRect().height + parseFloat(style.rowGap)) / unit));
    visible.forEach((card, index) => card.style.gridRowEnd = `span ${Math.max(1, spans[index])}`);
  };
  const schedule = () => { if (!frame && active) frame = requestAnimationFrame(measure); };
  const apply = (next: string, updateURL = false) => {
    mode = next;
    root.dataset.layoutExperiment = mode;
    control.querySelectorAll<HTMLButtonElement>('[data-layout-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layoutMode === mode)));
    control.querySelector('[data-layout-description]')!.textContent = mode === 'cascade' ? 'Different sizes, one flowing grid.' : mode === 'editorial' ? 'Big features mixed with smaller discoveries.' : 'The original, quieter cards.';
    if (updateURL) {
      const url = new URL(location.href); url.searchParams.set('layout', mode);
      history.replaceState(history.state, '', url);
      try { sessionStorage.setItem('preview-layout', mode); } catch {}
    }
    schedule();
  };
  const resize = new ResizeObserver(schedule);
  resize.observe(container);
  cards.forEach(card => resize.observe(card));
  const mutations = new MutationObserver(schedule);
  // Filters keep their original behavior. Reflow only the remaining cards.
  mutations.observe(container, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  control.querySelectorAll<HTMLButtonElement>('[data-layout-mode]').forEach(button => button.addEventListener('click', () => apply(button.dataset.layoutMode!), { signal: controller.signal }));
  addEventListener('resize', schedule, { signal: controller.signal });
  container.addEventListener('load', schedule, { capture: true, signal: controller.signal });
  container.querySelectorAll<HTMLImageElement>('img').forEach(image => {
    const missing = () => {
      const card = cards.find(card => card.contains(image));
      if (card) card.dataset.mediaMissing = '';
      schedule();
    };
    image.addEventListener('error', missing, { signal: controller.signal });
    if (image.complete && !image.naturalWidth) missing();
  });
  document.fonts.ready.then(schedule);
  control.hidden = false;
  apply(mode);
  cleanup = () => { active = false; cancelAnimationFrame(frame); controller.abort(); resize.disconnect(); mutations.disconnect(); };
}
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => cleanup());
init();
