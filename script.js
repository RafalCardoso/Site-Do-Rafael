(() => {
  'use strict';

  // Menu mobile acessível.
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  const header = document.querySelector('.site-header');
  const setMenu = (isOpen) => {
    if (!toggle || !menu) return;
    toggle.classList.toggle('is-open', isOpen);
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menu.inert = !isOpen;
    document.body.classList.toggle('menu-open', isOpen);
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (menu?.classList.contains('is-open') && !header?.contains(event.target)) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setMenu(false);
  });

  // Barra de progresso e aparência do cabeçalho.
  const progress = document.querySelector('.scroll-progress');
  let ticking = false;
  const updateScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  // Revela elementos no scroll; sem JavaScript, todo o conteúdo continua visível.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('has-js-reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // Profundidade sutil com movimento do mouse, desabilitada em dispositivos touch.
  const tilt = document.getElementById('tilt-display');
  const tiltArea = document.querySelector('.hero-visual');
  if (tilt && tiltArea && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltArea.addEventListener('pointermove', (event) => {
      const rect = tiltArea.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.setProperty('--rotate-y', `${x * 5}deg`);
      tilt.style.setProperty('--rotate-x', `${-y * 5}deg`);
    });
    tiltArea.addEventListener('pointerleave', () => {
      tilt.style.setProperty('--rotate-y', '0deg');
      tilt.style.setProperty('--rotate-x', '0deg');
    });
  }

  // FAQ: uma pergunta aberta por vez.
  const details = document.querySelectorAll('.faq-list details');
  details.forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) details.forEach((other) => { if (other !== item) other.open = false; });
  }));

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
