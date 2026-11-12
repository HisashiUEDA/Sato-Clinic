(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;

  // Include article-based sections on the medical and news detail pages.
  const sections = document.querySelectorAll(
    'main section, .clinic-gallery, .detail-medical-list > article, .news-detail-list > article'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    // A small inset triggers the effect just after the section enters the screen.
    rootMargin: '0px 0px -40px 0px',
    threshold: 0
  });

  sections.forEach((section) => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });

  // Reveal content immediately when keyboard navigation moves focus into it.
  document.addEventListener('focusin', (event) => {
    const section = event.target.closest('.scroll-reveal');
    if (!section) return;
    section.classList.add('is-visible');
    observer.unobserve(section);
  });

  motionPreference.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    sections.forEach((section) => section.classList.add('is-visible'));
  });
})();
