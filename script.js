/* ============================================================
   L&A Amplificadores Valvulares — script.js
   ------------------------------------------------------------
   - Carrousel automático con flechas, indicadores, teclado
     y respeto por prefers-reduced-motion.
   - Menú móvil (hamburguesa).
   - Año dinámico en el footer.
   ============================================================ */

(function () {
  'use strict';

  /* ------- Carrousel ------- */
  const carousel = document.querySelector('.carousel');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        indicatorsContainer.innerHTML = '';
        const indicators = slides.map((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Ir al slide ${i + 1}`);
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        if (i === 0) btn.classList.add('is-active');
        indicatorsContainer.appendChild(btn);
        return btn;
        });

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 10000;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      indicators.forEach((ind, i) => {
        const isActive = i === currentIndex;
        ind.classList.toggle('is-active', isActive);
        ind.setAttribute('aria-selected', String(isActive));
      });
    }

    function next() { goToSlide(currentIndex + 1); }
    function prev() { goToSlide(currentIndex - 1); }

    function startAutoplay() {
      if (reducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });

    // Pausar autoplay al pasar el mouse o tocar el carrousel
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Navegación con teclado (cuando el carrousel está enfocado)
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); resetAutoplay(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); resetAutoplay(); }
    });

    // Pausar cuando la pestaña pierde el foco (ahorra recursos)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Swipe en mobile (mínimo, opcional)
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta < 0) next();
        else prev();
        resetAutoplay();
      }
    }, { passive: true });

    goToSlide(0);
    startAutoplay();
  }

  /* ------- Menú móvil ------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
      mainNav.classList.toggle('is-open');
    });

    // Cerrar el menú al hacer click en un link
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        mainNav.classList.remove('is-open');
      });
    });
  }

  /* ------- Año dinámico en el footer ------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
