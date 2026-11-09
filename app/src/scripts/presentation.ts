export function initPresentation() {
  const slides = [...document.querySelectorAll<HTMLElement>('[data-slide]')];
  if (!slides.length) return;
  const deck = document.querySelector<HTMLElement>('.deck')!;
  const previous = document.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-next]')!;
  const current = document.querySelector<HTMLElement>('[data-current]')!;
  const progress = document.querySelector<HTMLElement>('.deck-progress')!;
  const announcement = document.querySelector<HTMLElement>('[data-slide-announcement]')!;
  const outline = document.querySelector<HTMLDetailsElement>('.deck-outline')!;
  const exit = document.querySelector<HTMLAnchorElement>('.deck-exit')!;
  let index = 0;
  const fromHash = () => {
    const match = /^#slide-(\d+)$/.exec(location.hash);
    return match ? Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1)) : 0;
  };
  const show = (requested: number, announce = true) => {
    index = Math.min(slides.length - 1, Math.max(0, requested));
    slides.forEach((slide, position) => {
      slide.hidden = position !== index;
      slide.classList.remove('is-entering');
    });
    const active = slides[index];
    active.classList.add('is-entering');
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    current.textContent = String(index + 1);
    progress.setAttribute('aria-valuenow', String(index + 1));
    progress.style.setProperty('--progress', `${(index + 1) / slides.length * 100}%`);
    document.querySelectorAll<HTMLAnchorElement>('[data-slide-choice]').forEach(link => {
      if (Number(link.dataset.slideChoice) === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    for (const slide of slides.slice(index, index + 2)) {
      slide.querySelectorAll<HTMLImageElement>('img').forEach(image => { image.loading = 'eager'; });
    }
    deck.scrollTop = 0;
    outline.open = false;
    history.replaceState(history.state, '', `#slide-${index + 1}`);
    if (announce) announcement.textContent = `Slide ${index + 1} of ${slides.length}: ${active.querySelector('h1, h2')!.textContent}`;
  };
  // Preserve the article's list/filter return context, accepting only its own URL.
  const article = new URLSearchParams(location.search).get('article');
  if (article) {
    try {
      const target = new URL(article, location.origin), expected = new URL(exit.href);
      const normalize = (path: string) => path.replace(/\.html$/, '').replace(/\/+$/, '');
      if (target.origin === expected.origin && normalize(target.pathname) === normalize(expected.pathname)) {
        exit.href = target.href;
      }
    } catch { /* Retain the safe article URL. */ }
  }
  // Match the mobile presentation-link breakpoint, including phones in landscape.
  const mobile = matchMedia('(max-width: 800px), (pointer: coarse) and (max-height: 500px)');
  const returnOnMobile = () => {
    if (mobile.matches) location.replace(exit.href);
  };
  if (mobile.matches) {
    returnOnMobile();
    return;
  }
  mobile.addEventListener('change', returnOnMobile);
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  outline.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-slide-choice]');
    if (!link) return;
    event.preventDefault();
    show(Number(link.dataset.slideChoice));
    outline.querySelector('summary')?.focus();
  });
  document.addEventListener('click', event => { if (!outline.contains(event.target as Node)) outline.open = false; });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'Escape') {
      if (outline.open) { outline.open = false; outline.querySelector('summary')?.focus(); }
      else location.assign(exit.href);
      return;
    }
    if (outline.open) return;
    if (event.key === ' ' && target?.closest('a, button, summary')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(index + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(index - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(0); }
    else if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
  });
  window.addEventListener('hashchange', () => show(fromHash()));
  const loadPrintImages = async () => {
    await Promise.all([...document.images].map(async image => {
      image.loading = 'eager';
      try { await image.decode(); } catch { /* The caption remains if an asset cannot load. */ }
    }));
  };
  window.addEventListener('beforeprint', () => { void loadPrintImages(); });
  document.documentElement.dataset.presentation = '';
  show(fromHash(), false);
}
