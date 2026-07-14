document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

  const galleryImages = Array.from(document.querySelectorAll('.img-grid img'));
  let currentIndex = -1;

  function showImage(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryImages.forEach((img, i) => {
    img.addEventListener('click', () => {
      showImage(i);
      lightbox.classList.add('open');
    });
  });

  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  let touchStartX = 0;
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showImage(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });
});
