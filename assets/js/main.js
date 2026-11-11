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
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuBackground = document.querySelectorAll('.skip-link, .mobile-topbar, .main-content');
  const mobileViewport = window.matchMedia('(max-width: 1000px)');
  const sectionLinks = [...document.querySelectorAll('.index-link')];
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
  let menuOpen = false;

  function setMenu(open, restoreFocus = true) {
    menuOpen = open && mobileViewport.matches;
    document.body.classList.toggle('menu-open', menuOpen);
    menuToggle.setAttribute('aria-expanded', String(menuOpen));
    menuBackdrop.hidden = !menuOpen;
    sidebar.inert = mobileViewport.matches && !menuOpen;
    // Keep the background out of the focus order and accessibility tree while the drawer is modal.
    menuBackground.forEach(element => { element.inert = menuOpen; });
    if (menuOpen) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      menuClose.focus();
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      if (restoreFocus && mobileViewport.matches) menuToggle.focus();
    }
  }

  menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  menuClose.addEventListener('click', () => setMenu(false));
  menuBackdrop.addEventListener('click', () => setMenu(false));
  sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      scheduleFragmentUpdate();
      if (!mobileViewport.matches) return;

      setMenu(false, false);
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      // Let the fragment scroll natively and move focus once the drawer has closed.
      const hadTabindex = target.hasAttribute('tabindex');
      if (!hadTabindex) target.setAttribute('tabindex', '-1');
      window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
      if (!hadTabindex) {
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    });
  });
  mobileViewport.addEventListener('change', () => setMenu(false, false));
  setMenu(false, false);

  const pronunciationButton = document.getElementById('pronounce-name');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (menuOpen) {
        event.preventDefault();
        setMenu(false);
      } else if (pronunciationButton.matches(':hover, :focus-visible')) {
        pronunciationButton.dataset.tooltipDismissed = '';
      }
      return;
    }
    if (!menuOpen || event.key !== 'Tab') return;

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
  });

  let sectionUpdateQueued = false;
  let wasAtPageEnd = false;
  let preferFragmentAtPageEnd = true;

  function updateActiveSection() {
    const offset = mobileViewport.matches ? 150 : 140;
    let activeSectionIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= offset) activeSectionIndex = index;
    });
    const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atPageEnd) {
      // Honor a visible fragment if the footer prevents it from reaching the scroll offset.
      const targetIndex = preferFragmentAtPageEnd
        ? sectionLinks.findIndex(link => link.hash === window.location.hash)
        : -1;
      const targetTop = sections[targetIndex]?.getBoundingClientRect().top;
      const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop);
      activeSectionIndex = targetTop > scrollPadding && targetTop < window.innerHeight
        ? targetIndex
        : sections.length - 1;
    } else if (wasAtPageEnd) {
      // After scrolling away, the viewport determines the active item again.
      preferFragmentAtPageEnd = false;
    }
    wasAtPageEnd = atPageEnd;
    sectionLinks.forEach((link, index) => {
      link.classList.toggle('active', index === activeSectionIndex);
      if (index === activeSectionIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    sectionUpdateQueued = false;
  }

  function scheduleActiveSectionUpdate() {
    if (sectionUpdateQueued) return;
    sectionUpdateQueued = true;
    window.requestAnimationFrame(updateActiveSection);
  }

  function scheduleFragmentUpdate() {
    preferFragmentAtPageEnd = true;
    scheduleActiveSectionUpdate();
  }

  window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveSectionUpdate);
  window.addEventListener('hashchange', scheduleFragmentUpdate);
  window.addEventListener('load', scheduleActiveSectionUpdate);
  updateActiveSection();

  const audio = document.getElementById('name-audio');
  const audioStatus = document.getElementById('audio-status');
  function resetPronunciationTooltip() {
    delete pronunciationButton.dataset.tooltipDismissed;
  }
  pronunciationButton.addEventListener('pointerenter', resetPronunciationTooltip);
  pronunciationButton.addEventListener('focus', resetPronunciationTooltip);
  pronunciationButton.addEventListener('click', async () => {
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
  const minuteMs = 60_000;
  // Format for Kathmandu even when the visitor's device is in another time zone.
  const kathmanduTimeFormatter = new Intl.DateTimeFormat('en-US', {
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

    const minuteStart = Math.floor(Date.now() / minuteMs) * minuteMs;
    const timestamp = new Date(minuteStart).toISOString();
    if (clockTime.dateTime !== timestamp) {
      clockTime.textContent = kathmanduTimeFormatter.format(minuteStart);
      clockTime.dateTime = timestamp;
    }
    if (clock.hidden) clock.hidden = false;
    // Schedule from the wall clock so delayed callbacks do not shift future updates.
    clockTimer = window.setTimeout(updateClock, minuteMs - Date.now() % minuteMs);
  }

  document.addEventListener('visibilitychange', updateClock);
  window.addEventListener('focus', updateClock);
  window.addEventListener('pageshow', updateClock);
  window.addEventListener('pagehide', stopClock);
  updateClock();
})();
