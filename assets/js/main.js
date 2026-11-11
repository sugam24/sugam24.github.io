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
  const menuBackground = document.querySelectorAll('.skip-link, .mobile-topbar, .main-content');
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
    menuBackground.forEach(element => { element.inert = menuOpen; });
    if (menuOpen) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      close.focus();
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      if (restoreFocus && mobile.matches) toggle.focus();
    }
  }

  toggle.addEventListener('click', () => setMenu(!menuOpen));
  close.addEventListener('click', () => setMenu(false));
  backdrop.addEventListener('click', () => setMenu(false));
  sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      scheduleFragmentUpdate();
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

  const pronounce = document.getElementById('pronounce-name');
  document.addEventListener('keydown', event => {
    if (!menuOpen) {
      if (event.key === 'Escape' && pronounce.matches(':hover, :focus-visible')) {
        pronounce.dataset.tooltipDismissed = '';
      }
      return;
    }
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
  let wasAtEnd = false;
  let followEndFragment = true;
  function updateActiveSection() {
    const offset = mobile.matches ? 150 : 140;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= offset) current = index;
    });
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atEnd) {
      // A section near the footer may be visible without reaching the scroll offset.
      const targetIndex = followEndFragment ? links.findIndex(link => link.hash === window.location.hash) : -1;
      const targetTop = sections[targetIndex]?.getBoundingClientRect().top;
      const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop);
      current = targetTop > scrollPadding && targetTop < window.innerHeight ? targetIndex : sections.length - 1;
    } else if (wasAtEnd) {
      followEndFragment = false;
    }
    wasAtEnd = atEnd;
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
  function scheduleFragmentUpdate() {
    followEndFragment = true;
    scheduleUpdate();
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleFragmentUpdate);
  window.addEventListener('load', scheduleUpdate);
  updateActiveSection();

  const audio = document.getElementById('name-audio');
  const audioStatus = document.getElementById('audio-status');
  function resetPronunciationTooltip() {
    delete pronounce.dataset.tooltipDismissed;
  }
  pronounce.addEventListener('pointerenter', resetPronunciationTooltip);
  pronounce.addEventListener('focus', resetPronunciationTooltip);
  pronounce.addEventListener('click', async () => {
    audioStatus.textContent = '';
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      audioStatus.textContent = 'Pronunciation could not play. Please try again.';
    }
  });

  const clock = document.getElementById('sidebar-clock');
  const clockTime = clock.querySelector('time');
  const kathmanduTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  let clockTimer;

  function stopClock() {
    window.clearTimeout(clockTimer);
  }

  function updateClock() {
    stopClock();
    if (document.hidden || !clock.isConnected) return;

    const minute = Math.floor(Date.now() / 60_000) * 60_000;
    const timestamp = new Date(minute).toISOString();
    if (clockTime.dateTime !== timestamp) {
      clockTime.textContent = kathmanduTime.format(minute);
      clockTime.dateTime = timestamp;
    }
    if (clock.hidden) clock.hidden = false;
    clockTimer = window.setTimeout(updateClock, 60_000 - Date.now() % 60_000);
  }

  document.addEventListener('visibilitychange', updateClock);
  window.addEventListener('focus', updateClock);
  window.addEventListener('pageshow', updateClock);
  window.addEventListener('pagehide', stopClock);
  updateClock();
})();
