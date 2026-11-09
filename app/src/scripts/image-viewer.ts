import '../styles/image-viewer.css';

let viewer: HTMLDialogElement | null = null;
let opener: HTMLElement | null = null;
let priorOverflow = '';
let generation = 0;
let animationManifest: Promise<Record<string, string>> | undefined;

function togglePlayback() {
  const video = viewer?.querySelector('video');
  if (!video || video.hidden) return;
  if (video.paused) void video.play().catch(() => {});
  else video.pause();
}

function updatePlayback() {
  const video = viewer?.querySelector('video');
  const button = viewer?.querySelector<HTMLButtonElement>('.image-viewer-playback');
  if (video && button) {
    button.textContent = video.paused ? 'Resume animation' : 'Pause animation';
    button.setAttribute('aria-label', button.textContent);
  }
}

async function loadAnimation(url: string, request: number) {
  // Revalidate on the first opening so a newly deployed animation map is used.
  animationManifest ??= fetch('/animation-media.json', { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : {}).catch(() => ({}));
  const manifest = await animationManifest;
  if (!viewer?.open || request !== generation) return;
  const src = manifest[decodeURIComponent(new URL(url, location.href).pathname)];
  if (!src) return;
  const video = viewer.querySelector('video')!;
  const image = viewer.querySelector('img')!;
  video.setAttribute('aria-label', image.alt ? `Enlarged animation: ${image.alt}` : 'Enlarged animation');
  const button = viewer.querySelector<HTMLButtonElement>('.image-viewer-playback')!;
  video.onloadeddata = () => {
    if (!viewer?.open || request !== generation) return;
    image.hidden = true;
    video.hidden = false;
    button.hidden = false;
    updatePlayback();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) void video.play().catch(() => {});
  };
  video.onerror = () => {
    image.hidden = false;
    video.hidden = true;
    button.hidden = true;
  };
  video.src = src;
  video.load();
}

function closeViewer() {
  if (!viewer?.open) return;
  generation++;
  const video = viewer.querySelector('video')!;
  video.onloadeddata = null;
  video.onerror = null;
  video.pause();
  video.removeAttribute('src');
  video.load();
  video.hidden = true;
  viewer.querySelector<HTMLButtonElement>('.image-viewer-playback')!.hidden = true;
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
    viewer.innerHTML = '<button class="image-viewer-close" type="button" aria-label="Close enlarged image">Close ×</button><figure><img alt=""><video muted loop playsinline preload="metadata" hidden aria-label="Enlarged animation"></video><figcaption id="image-viewer-caption"></figcaption><button class="image-viewer-playback" type="button" hidden>Pause animation</button></figure>';
    document.body.append(viewer);
    viewer.addEventListener('click', closeViewer);
    viewer.querySelector('.image-viewer-playback')!.addEventListener('click', event => {
      event.stopPropagation();
      togglePlayback();
    });
    const video = viewer.querySelector('video')!;
    video.muted = true;
    video.addEventListener('play', updatePlayback);
    video.addEventListener('pause', updatePlayback);
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
  image.hidden = false;
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
  void loadAnimation(image.src, ++generation);
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
  if (event.key === ' ' && !viewer.querySelector('video')!.hidden && event.target !== viewer.querySelector('.image-viewer-close')) {
    event.preventDefault();
    togglePlayback();
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    closeViewer();
  }
  event.stopImmediatePropagation();
}, true);
document.addEventListener('astro:before-swap', closeViewer);
document.addEventListener('astro:page-load', enhanceImages);
enhanceImages();
