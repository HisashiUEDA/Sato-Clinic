(() => {
  const gallery = document.querySelector('.clinic-gallery');
  const dots = document.querySelector('.gallery-dots');
  if (!gallery || !dots) return;

  const mobile = window.matchMedia('(max-width: 767px)');
  const slides = Array.from(gallery.children);
  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-dot';
    button.setAttribute('aria-label', `写真${index + 1}を表示：${slide.alt}`);
    button.setAttribute('aria-controls', gallery.id);
    button.addEventListener('click', () => {
      gallery.scrollTo({
        left: slide.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft,
        behavior: 'instant'
      });
      updatePosition();
    });
    dots.appendChild(button);
    return button;
  });

  const updatePosition = () => {
    const left = gallery.getBoundingClientRect().left;
    let current = 0;
    slides.forEach((slide, index) => {
      if (Math.abs(slide.getBoundingClientRect().left - left) <
          Math.abs(slides[current].getBoundingClientRect().left - left)) current = index;
    });
    buttons.forEach((button, index) => {
      if (index === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };

  const updateMode = () => {
    dots.hidden = !mobile.matches;
    if (mobile.matches) {
      gallery.tabIndex = 0;
      gallery.setAttribute('aria-label', '院内写真（横にスワイプできます）');
    } else {
      gallery.removeAttribute('tabindex');
      gallery.removeAttribute('aria-label');
      gallery.scrollLeft = 0;
    }
    updatePosition();
  };

  gallery.addEventListener('scroll', updatePosition, { passive: true });
  gallery.addEventListener('keydown', (event) => {
    if (!mobile.matches || event.target !== gallery) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const current = buttons.findIndex((button) => button.hasAttribute('aria-current'));
    const next = Math.max(0, Math.min(slides.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)));
    buttons[next].click();
  });
  mobile.addEventListener('change', updateMode);
  window.addEventListener('resize', updatePosition);
  updateMode();
})();
