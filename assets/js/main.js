(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  const themeToggle = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function updateThemeControl() {
    const label = root.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
    themeColor.content = getComputedStyle(root).getPropertyValue('--paper').trim();
  }

  themeToggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    updateThemeControl();
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The selected theme still applies to the current page.
    }
  });
  updateThemeControl();
  themeToggle.hidden = false;

  const sidebar = document.getElementById('site-sidebar');
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const backdrop = document.getElementById('menu-backdrop');
  const mobile = window.matchMedia('(max-width: 1000px)');
  const links = [...document.querySelectorAll('.index-link')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let menuOpen = false;

  function setMenu(open, restoreFocus = true) {
    menuOpen = open && mobile.matches;
    document.body.classList.toggle('menu-open', menuOpen);
    toggle.setAttribute('aria-expanded', String(menuOpen));
    backdrop.hidden = !menuOpen;
    sidebar.inert = mobile.matches && !menuOpen;
    if (menuOpen) close.focus();
    else if (restoreFocus && mobile.matches) toggle.focus();
  }

  toggle.addEventListener('click', () => setMenu(!menuOpen));
  close.addEventListener('click', () => setMenu(false));
  backdrop.addEventListener('click', () => setMenu(false));
  sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (mobile.matches) {
        setMenu(false, false);
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const hadTabindex = target.hasAttribute('tabindex');
          if (!hadTabindex) target.setAttribute('tabindex', '-1');
          window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
          if (!hadTabindex) {
            target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
          }
        }
      }
    });
  });
  mobile.addEventListener('change', () => setMenu(false, false));
  setMenu(false, false);

  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false);
    }
    if (event.key === 'Tab') {
      const focusable = [...sidebar.querySelectorAll('a[href], button:not([disabled])')]
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  let scheduled = false;
  function updateActiveSection() {
    const offset = mobile.matches ? 150 : 140;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= offset) current = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      // A section near the footer may be visible without reaching the scroll offset.
      const targetIndex = links.findIndex(link => link.hash === window.location.hash);
      const targetTop = sections[targetIndex]?.getBoundingClientRect().top;
      const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop);
      current = targetTop > scrollPadding && targetTop < window.innerHeight ? targetIndex : sections.length - 1;
    }
    links.forEach((link, index) => {
      link.classList.toggle('active', index === current);
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  updateActiveSection();

  const pronounce = document.getElementById('pronounce-name');
  const audio = document.getElementById('name-audio');
  const audioStatus = document.getElementById('audio-status');
  pronounce.addEventListener('click', async () => {
    audioStatus.textContent = '';
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      audioStatus.textContent = 'Pronunciation could not play. Please try again.';
    }
  });
})();
