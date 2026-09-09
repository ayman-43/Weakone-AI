/* Local fix: make the Services page navigation work.
 *
 * Two broken link sets on this page:
 *
 *   1. The top tab bar still points at the Framer template's routes —
 *      ./docs/knowledge, ./docs/agents, ./docs/actions, ./docs/inbox — pages
 *      that don't exist here, so Strategy / Front Office / Automation / Growth
 *      all 404'd. They should reach the sections further down the page.
 *   2. The left contents list uses "./services#id", which from /services/
 *      resolves to /services/services#id — also a dead URL.
 *
 * Both are rewritten to same-page hashes, which the section containers already
 * carry (their ids are the template's: overview, workplace, members, …).
 * Clicking scrolls smoothly, and both nav sets track the section in view.
 *
 * The page is React-hydrated, so this re-applies if a re-render restores the
 * original hrefs.
 */
(function () {
  'use strict';

  // Tab label -> id of the section container it should reach.
  var TABS = {
    'Overview': 'overview',
    'Strategy': 'workplace',
    'Front Office': 'members',
    'Automation': 'connections',
    'Growth': 'usage'
  };

  // Section order, top to bottom, for scroll tracking.
  var SECTIONS = ['overview', 'workplace', 'members', 'connections', 'usage', 'plans'];

  var TAB_SELECTOR = 'a.framer-1j0e53j';
  var HEADER_OFFSET = 140;

  function label(el) {
    var h = el.querySelector('h3');
    return h ? h.textContent.trim().replace(/\s+/g, ' ') : '';
  }

  function targetFor(a) {
    if (a.matches(TAB_SELECTOR)) return TABS[label(a)] || null;
    // Contents list: "./services#workplace" -> "workplace"
    var raw = a.getAttribute('href') || '';
    var m = raw.match(/#([A-Za-z0-9_-]+)$/);
    if (m && SECTIONS.indexOf(m[1]) !== -1) return m[1];
    return null;
  }

  function scrollTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduce ? 'auto' : 'smooth' });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + id);
    }
    setActive(id);
  }

  function onClick(event) {
    var id = this.getAttribute('data-w1-target');
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    scrollTo(id);
  }

  function wire() {
    var links = document.querySelectorAll(TAB_SELECTOR + ', a[href*="#"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var id = targetFor(a);
      if (!id || !document.getElementById(id)) continue;
      if (a.getAttribute('href') !== '#' + id) a.setAttribute('href', '#' + id);
      if (a.getAttribute('data-w1-target') === id) continue;
      a.setAttribute('data-w1-target', id);
      // Framer marks the current page link; it no longer means anything here.
      a.removeAttribute('data-framer-page-link-current');
      a.addEventListener('click', onClick);
    }
    document.documentElement.classList.add('w1-nav-ready');
  }

  function setActive(id) {
    var links = document.querySelectorAll('[data-w1-target]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.getAttribute('data-w1-target') === id) a.setAttribute('data-w1-active', 'true');
      else a.removeAttribute('data-w1-active');
    }
  }

  // Whichever section's top has most recently passed the header line.
  function currentSection() {
    var line = window.scrollY + HEADER_OFFSET + 1;
    var current = SECTIONS[0];
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = document.getElementById(SECTIONS[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top + window.scrollY <= line) current = SECTIONS[i];
    }
    return current;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      setActive(currentSection());
    });
  }

  function start() {
    wire();
    setActive(currentSection());

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    var root = document.getElementById('main') || document.body;
    var observer = new MutationObserver(function () { wire(); });
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); wire(); }, 15000);

    // Deep link straight to a section.
    var hash = window.location.hash.replace(/^#/, '');
    if (hash && SECTIONS.indexOf(hash) !== -1) {
      window.setTimeout(function () { scrollTo(hash); }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
