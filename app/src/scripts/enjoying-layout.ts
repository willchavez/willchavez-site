import { createCardMotion } from './card-motion';

/** Keep natural-height grid cards and animate changes without moving DOM order. */
export function initEnjoyingLayout(results: HTMLElement) {
  const container = results.querySelector<HTMLElement>('#list')!;
  const control = document.querySelector<HTMLElement>('.enjoying-view-toggle')!;
  const cards = Array.from(container.children) as HTMLElement[];
  const controller = new AbortController();
  let frame = 0;
  let active = true;
  const mobile = matchMedia('(max-width: 640px)');
  let view = 'grid';
  const params = new URL(location.href).searchParams;
  const requested = params.get('view') || params.get('layout');
  try { view = requested || sessionStorage.getItem('enjoying-view') || view; } catch { view = requested || view; }
  // Preserve previously shared preview links while retiring the experiment UI.
  view = view === 'list' || view === 'cards' ? 'list' : 'grid';

  const measure = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!active) return;
    container.querySelectorAll<HTMLImageElement>('img[srcset]').forEach(image => {
      if (image.clientWidth) image.sizes = `${image.clientWidth}px`;
    });
    if (results.dataset.view === 'list' || innerWidth < 700) {
      delete container.dataset.cascadeReady;
      cards.forEach(card => card.style.removeProperty('grid-row-end'));
      return;
    }
    container.dataset.cascadeReady = '';
    const style = getComputedStyle(container);
    const gap = parseFloat(style.rowGap);
    const unit = parseFloat(style.gridAutoRows) + gap;
    if (!Number.isFinite(unit)) return;
    // Retain spans while measuring so Safari never sees a collapsed document.
    // offsetHeight ignores hover and animation transforms.
    const spans = cards.filter(card => !card.hidden).map(card => [card, Math.ceil((card.offsetHeight + gap) / unit)] as const);
    spans.forEach(([card, rows]) => {
      const span = `span ${Math.max(1, rows)}`;
      if (card.style.gridRowEnd !== span) card.style.gridRowEnd = span;
    });
  };
  const schedule = () => { if (active && !frame) frame = requestAnimationFrame(measure); };
  const motion = createCardMotion(results, container, cards, { measure });
  const { change } = motion;
  const applyView = () => {
    const activeView = mobile.matches ? 'list' : view;
    results.dataset.view = activeView;
    control.querySelectorAll<HTMLButtonElement>('[data-layout-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.layoutChoice === activeView));
    });
  };
  control.querySelectorAll<HTMLButtonElement>('[data-layout-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const next = button.dataset.layoutChoice!;
      if (next === view) return;
      void change(() => { view = next; applyView(); });
      const url = new URL(location.href);
      url.searchParams.delete('layout'); url.searchParams.set('view', view);
      history.replaceState(history.state, '', url);
      try { sessionStorage.setItem('enjoying-view', view); } catch {}
    }, { signal: controller.signal });
  });
  let containerWidth = 0;
  const resize = new ResizeObserver(entries => {
    if (entries.some(entry => {
      if (entry.target !== container) return true;
      if (entry.contentRect.width === containerWidth) return false;
      containerWidth = entry.contentRect.width; return true;
    })) schedule();
  });
  resize.observe(container); cards.forEach(card => resize.observe(card));
  const mutations = new MutationObserver(schedule);
  mutations.observe(container, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  mobile.addEventListener('change', () => { motion.cancel(); applyView(); schedule(); }, { signal: controller.signal });
  addEventListener('resize', () => { motion.cancel(); applyView(); schedule(); }, { signal: controller.signal });
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
  control.hidden = false; applyView(); measure();
  return {
    change,
    destroy: () => {
      active = false; motion.destroy(); cancelAnimationFrame(frame);
      controller.abort(); resize.disconnect(); mutations.disconnect();
    },
  };
}
