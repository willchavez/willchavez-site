type Bounds = { left: number; top: number; width: number; height: number; opacity: number };

/** Keep natural-height grid cards and animate changes without moving DOM order. */
export function initEnjoyingLayout(results: HTMLElement) {
  const container = results.querySelector<HTMLElement>('#list')!;
  const control = document.querySelector<HTMLElement>('.enjoying-view-toggle')!;
  const cards = Array.from(container.children) as HTMLElement[];
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  const ghosts = new Set<HTMLElement>();
  let frame = 0;
  let active = true;
  let revision = 0;
  let view = 'grid';
  const params = new URL(location.href).searchParams;
  const requested = params.get('view') || params.get('layout');
  try { view = requested || sessionStorage.getItem('enjoying-view') || view; } catch { view = requested || view; }
  // Preserve previously shared preview links while retiring the experiment UI.
  view = view === 'list' || view === 'cards' ? 'list' : 'grid';

  const measure = () => {
    frame = 0;
    if (!active) return;
    container.querySelectorAll<HTMLImageElement>('img[srcset]').forEach(image => {
      if (image.clientWidth) image.sizes = `${image.clientWidth}px`;
    });
    if (view === 'list' || innerWidth < 700) {
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
  const bounds = (element: HTMLElement): Bounds => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left + scrollX, top: rect.top + scrollY, width: rect.width, height: rect.height, opacity: Number(getComputedStyle(element).opacity) };
  };
  const nearViewport = (rect: Bounds) => rect.top + rect.height >= scrollY - 100 && rect.top <= scrollY + innerHeight + 100;
  const cancelMotion = (releaseHeight = true) => {
    ++revision;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    ghosts.forEach(ghost => ghost.remove());
    ghosts.clear();
    if (releaseHeight) {
      results.style.removeProperty('min-height');
      delete results.dataset.rearranging;
    }
  };
  const play = (element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = element.animate(frames, { fill: 'both', ...options });
    animations.add(animation);
    return animation.finished;
  };
  const change = async (update: () => void, animate = true) => {
    if (!active) return;
    cancelAnimationFrame(frame);
    measure();
    if (!animate || reduced.matches) {
      cancelMotion(); update(); measure(); return;
    }
    // Capture painted positions before cancelling a rapid, unfinished shuffle.
    const before = new Map(cards.filter(card => !card.hidden).map(card => [card, bounds(card)]));
    const oldHeight = results.offsetHeight;
    cancelMotion(false);
    const current = revision;
    results.style.minHeight = `${oldHeight}px`;
    results.dataset.rearranging = '';
    update();
    measure();
    const origin = bounds(container);
    const pending: Promise<Animation>[] = [];
    // Exiting copies are inert, short-lived, and outside normal grid flow.
    before.forEach((rect, card) => {
      if (!card.hidden || !nearViewport(rect)) return;
      const ghost = card.cloneNode(true) as HTMLElement;
      ghost.hidden = false;
      ghost.inert = true;
      ghost.setAttribute('aria-hidden', 'true');
      ghost.dataset.layoutExit = '';
      ghost.style.removeProperty('grid-row-end');
      ghost.removeAttribute('id');
      ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      ghost.querySelectorAll('iframe, video, audio').forEach(node => node.remove());
      Object.assign(ghost.style, {
        left: `${rect.left - origin.left}px`, top: `${rect.top - origin.top}px`,
        width: `${rect.width}px`, height: `${rect.height}px`,
      });
      container.append(ghost); ghosts.add(ghost);
      pending.push(play(ghost, [
        { opacity: rect.opacity, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(.9)' },
      ], { duration: 180, easing: 'ease-out' }));
    });
    let entering = 0;
    cards.filter(card => !card.hidden).forEach(card => {
      const next = bounds(card);
      const previous = before.get(card);
      if (!nearViewport(next) && (!previous || !nearViewport(previous))) return;
      if (previous && nearViewport(previous)) {
        const dx = previous.left - next.left;
        const dy = previous.top - next.top;
        const sx = previous.width / next.width;
        const sy = previous.height / next.height;
        if (Math.abs(dx) + Math.abs(dy) < 1 && Math.abs(sx - 1) + Math.abs(sy - 1) < .01) return;
        pending.push(play(card, [
          { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: previous.opacity },
          { transformOrigin: 'top left', transform: 'none', opacity: 1 },
        ], { duration: 460, easing: 'cubic-bezier(.22, .7, .16, 1)' }));
      } else {
        pending.push(play(card, [
          { transform: 'translateY(12px) scale(.94)', opacity: 0 },
          { transform: 'none', opacity: 1 },
        ], { duration: 320, delay: Math.min(entering++ * 22, 132), easing: 'cubic-bezier(.22, .7, .16, 1)' }));
      }
    });
    await Promise.allSettled(pending);
    if (current === revision && active) cancelMotion();
  };
  const applyView = () => {
    results.dataset.view = view;
    control.querySelectorAll<HTMLButtonElement>('[data-layout-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.layoutChoice === view));
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
  addEventListener('resize', () => { cancelMotion(); schedule(); }, { signal: controller.signal });
  reduced.addEventListener('change', () => { cancelMotion(); schedule(); }, { signal: controller.signal });
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
      active = false; cancelMotion(); cancelAnimationFrame(frame);
      controller.abort(); resize.disconnect(); mutations.disconnect();
    },
  };
}
