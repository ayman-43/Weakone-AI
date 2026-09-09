/* Contact routes and the "Book a working session" call to action.
 *
 * The header CTA is a real link to /contact, but the in-page ones are plain
 * containers with no link — clicking them did nothing. This makes every one of
 * them behave like the header's, and adds the voice line alongside the email
 * address on the contact page.
 *
 * The page is hydrated after load, so both jobs re-run if a re-render undoes
 * them.
 */
(function () {
  'use strict';

  var LABEL = 'book a working session';
  var TARGET = '/contact';
  var EMAIL = 'info@weekoneai.com';
  var PHONE_DISPLAY = '+1 614-634-9644';
  var PHONE_HREF = 'tel:+16146349644';
  var NOTE =
    'We take a limited number of engagements at a time — speed requires focus. ' +
    'If the calendar looks tight, email us and we’ll find a slot.';

  // --- 1. make every call to action reach the contact page -----------------

  function wireButtons() {
    var all = document.querySelectorAll('p,span,div,h1,h2,h3,h4');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.children.length > 3) continue;
      var text = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (text.toLowerCase() !== LABEL) continue;
      if (el.closest('a')) continue; // header CTA is already a link
      if (el.closest('[data-w1-book]')) continue;

      // climb to the element that actually looks like the button
      var box = el;
      for (var g = 0; g < 5 && box.parentElement; g++) {
        var r = box.getBoundingClientRect();
        if (r.width > 120 && r.height > 24) break;
        box = box.parentElement;
      }
      if (box.getAttribute('data-w1-book')) continue;

      box.setAttribute('data-w1-book', '');
      box.setAttribute('role', 'link');
      if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '0');
      box.setAttribute('aria-label', 'Book a working session');
      box.addEventListener('click', go);
      box.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        go();
      });
    }
  }

  function go() {
    window.location.href = TARGET;
  }

  // --- 2. contact page: put the voice line next to the email ---------------

  function svgPhone() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', '14');
    s.setAttribute('height', '14');
    s.setAttribute('viewBox', '0 0 14 14');
    s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute(
      'd',
      'M 4.6 1.2 C 4.9 0.9 5.4 0.9 5.7 1.3 L 6.9 3 C 7.1 3.3 7.1 3.7 6.8 4 L 5.9 4.9 ' +
        'C 6.5 6.1 7.9 7.5 9.1 8.1 L 10 7.2 C 10.3 6.9 10.7 6.9 11 7.1 L 12.7 8.3 ' +
        'C 13.1 8.6 13.1 9.1 12.8 9.4 L 11.8 10.4 C 11.2 11 10.3 11.2 9.5 10.9 ' +
        'C 6.6 9.9 4.1 7.4 3.1 4.5 C 2.8 3.7 3 2.8 3.6 2.2 Z'
    );
    p.setAttribute('fill', 'rgb(255, 74, 167)');
    s.appendChild(p);
    return s;
  }

  function addPhone() {
    var mail = document.querySelector('a[href^="mailto:' + EMAIL + '"]');
    if (!mail) return;

    // The email pill sits alone in a row inside a 40px-gap flex column, so the
    // phone goes in beside it rather than a row of its own.
    var pill = mail.parentElement;
    if (!pill || pill.querySelector('.w1-phone')) return;

    pill.classList.add('w1-contact-row');

    var tel = document.createElement('a');
    tel.className = 'w1-phone';
    tel.href = PHONE_HREF;
    tel.appendChild(svgPhone());
    var label = document.createElement('span');
    label.textContent = PHONE_DISPLAY;
    tel.appendChild(label);
    pill.appendChild(tel);

    if (!document.querySelector('.w1-contact-note')) {
      var note = document.createElement('p');
      note.className = 'w1-contact-note';
      note.textContent = NOTE;
      pill.parentElement.insertBefore(note, pill.nextSibling);
    }
  }

  function run() {
    wireButtons();
    if (/\/contact\/?$/.test(window.location.pathname)) addPhone();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.addEventListener('load', function () {
    run();
    var root = document.getElementById('main') || document.body;
    var observer = new MutationObserver(run);
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); run(); }, 15000);
  });
})();
