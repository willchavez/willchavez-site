// Keep hover intent separate from animation so interrupted transitions do not stall.
export function createHoverNav(onChange, clock = {
  now: () => performance.now(),
  set: (callback, delay) => setTimeout(callback, delay),
  clear: (timer) => clearTimeout(timer),
}) {
  let hovered = false, focused = false, expanded = false;
  let openedAt = 0, closedAt = -Infinity;
  let openTimer, closeTimer;
  const clearOpen = () => { clock.clear(openTimer); openTimer = undefined; };
  const clearClose = () => { clock.clear(closeTimer); closeTimer = undefined; };
  const show = () => {
    clearOpen();
    clearClose();
    if (expanded) return;
    expanded = true;
    openedAt = clock.now();
    onChange(true);
  };
  const scheduleClose = () => {
    clearClose();
    if (!expanded || focused || hovered) return;
    // The width animation takes 320ms. Hold long enough for it to finish.
    closeTimer = clock.set(() => {
      expanded = false;
      closedAt = clock.now();
      onChange(false);
    }, Math.max(300, 400 - (clock.now() - openedAt)));
  };
  return {
    enter() {
      hovered = true;
      clearClose();
      clearOpen();
      if (expanded) return;
      // Re-entering during the closing animation reverses it immediately.
      if (clock.now() - closedAt < 320) show();
      else openTimer = clock.set(show, 120);
    },
    leave() { hovered = false; clearOpen(); scheduleClose(); },
    focus() { focused = true; show(); },
    blur() { focused = false; scheduleClose(); },
    reset() {
      clearOpen(); clearClose();
      hovered = false; focused = false; expanded = false;
      closedAt = -Infinity;
      onChange(false);
    },
  };
}
