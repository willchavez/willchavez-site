import '../styles/card-motion.css';
type Bounds = { left: number; top: number; width: number; height: number; opacity: number };
type Options = { measure?: () => void; enabled?: () => boolean };

/** Animate filters over an existing layout; this does not choose grid geometry. */
export function createCardMotion(results: HTMLElement, container: HTMLElement, cards: HTMLElement[], {
  measure = () => {}, enabled = () => true,
}: Options = {}) {
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  const ghosts = new Set<HTMLElement>();
  let active = true;
  let revision = 0;
  results.dataset.cardMotion = '';
  container.dataset.motionGrid = '';
  cards.forEach(card => card.dataset.motionCard = '');
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
    measure();
    if (!animate || reduced.matches || !enabled()) {
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
        position: 'absolute', margin: '0', gridArea: 'auto', pointerEvents: 'none', zIndex: '4',
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
  reduced.addEventListener('change', () => cancelMotion(), { signal: controller.signal });
  return {
    change, cancel: () => cancelMotion(),
    destroy: () => { active = false; cancelMotion(); controller.abort(); },
  };
}
