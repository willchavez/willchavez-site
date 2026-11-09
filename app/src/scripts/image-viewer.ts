import '../styles/image-viewer.css';

let viewer: HTMLDialogElement | null = null;
let opener: HTMLElement | null = null;
let priorOverflow = '';

function closeViewer() {
  if (!viewer?.open) return;
  viewer.close();
  document.documentElement.style.overflow = priorOverflow;
  viewer.querySelector('img')?.removeAttribute('src');
  opener?.focus({ preventScroll: true });
}

function openImage(source: HTMLImageElement) {
  if (!viewer?.isConnected) {
    viewer = document.createElement('dialog');
    viewer.className = 'image-viewer';
    viewer.setAttribute('aria-label', 'Enlarged image');
    viewer.innerHTML = '<button class="image-viewer-close" type="button" aria-label="Close enlarged image">Close ×</button><figure><img alt=""><figcaption id="image-viewer-caption"></figcaption></figure>';
    document.body.append(viewer);
    viewer.addEventListener('click', closeViewer);
    viewer.addEventListener('cancel', event => {
      event.preventDefault();
      closeViewer();
    });
  }
  const image = viewer.querySelector('img')!;
  const caption = source.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || source.alt;
  // Use the largest supplied responsive asset; retain animated originals otherwise.
  const candidates = source.srcset.split(',').map(item => item.trim().split(/\s+/));
  const largest = candidates.filter(([, size]) => /^\d+w$/.test(size || '')).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0];
  image.src = largest?.[0] || source.currentSrc || source.src;
  image.alt = source.alt;
  const captionElement = viewer.querySelector('figcaption')!;
  captionElement.textContent = caption;
  captionElement.hidden = !caption;
  if (caption) viewer.setAttribute('aria-describedby', 'image-viewer-caption');
  else viewer.removeAttribute('aria-describedby');
  opener = source;
  priorOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  viewer.showModal();
}

function enhanceImages() {
  document.querySelectorAll<HTMLImageElement>('.project-figure img, .note-reading img, .prose img, main > .photo-full, .slide-media img').forEach(image => {
    if (image.dataset.zoomReady || image.closest('a, button') || image.matches('.fluent-emoji, .emoji, [data-no-zoom]') || image.src.includes('/emoji/')) return;
    image.dataset.zoomReady = 'true';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');
    image.setAttribute('aria-label', image.alt ? `Enlarge image: ${image.alt}` : 'Enlarge image');
    image.addEventListener('click', () => openImage(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        openImage(image);
      }
    });
  });
}
// Keep slide shortcuts from advancing the deck behind the modal.
document.addEventListener('keydown', event => {
  if (!viewer?.open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeViewer();
  }
  event.stopImmediatePropagation();
}, true);
document.addEventListener('astro:before-swap', closeViewer);
document.addEventListener('astro:page-load', enhanceImages);
enhanceImages();
