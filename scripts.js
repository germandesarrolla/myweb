document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.cards');
  const prev = document.querySelector('.carousel-button.prev');
  const next = document.querySelector('.carousel-button.next');

  if (!container || !prev || !next) return;

  function pageWidth() {
    // scroll by the visible area (wrapper width)
    return container.clientWidth;
  }

  function updateButtons() {
    const maxScroll = container.scrollWidth - container.clientWidth;
    prev.disabled = container.scrollLeft <= 0;
    next.disabled = container.scrollLeft >= Math.max(0, maxScroll - 1);

    if (maxScroll <= 0) {
      prev.style.display = 'none';
      next.style.display = 'none';
    } else {
      prev.style.display = '';
      next.style.display = '';
    }
  }

  prev.addEventListener('click', () => {
    container.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    container.scrollBy({ left: pageWidth(), behavior: 'smooth' });
  });

  container.addEventListener('scroll', () => {
    // throttle not necessary for small pages
    updateButtons();
  });

  window.addEventListener('resize', () => {
    updateButtons();
  });

  // initial state
  updateButtons();

  // allow keyboard arrows when focus is inside the carousel
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });

  // make container focusable for keyboard support
  container.setAttribute('tabindex', '0');
});