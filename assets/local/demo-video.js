/* Local addition: wire the hero's "Watch the demo" button to the explainer.
 *
 * The button is a template element with no handler wired — clicking it did
 * nothing. This opens the video in an overlay instead of sending the visitor
 * off the page.
 *
 * The click is caught on the document in the capture phase, so it keeps working
 * across Framer re-renders without holding a reference to the button.
 */
(function () {
  'use strict';

  var VIDEO = '/assets/weekoneai.com/media/weekone-explainer-720p-v2.mp4';
  var POSTER = '/assets/weekoneai.com/media/weekone-explainer-poster.jpg';
  var LABEL = 'watch the demo';

  var modal = null;
  var player = null;
  var lastTrigger = null;

  function build() {
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'w1-video';
    modal.setAttribute('data-open', 'false');

    var backdrop = document.createElement('div');
    backdrop.className = 'w1-video__backdrop';
    modal.appendChild(backdrop);

    var frame = document.createElement('div');
    frame.className = 'w1-video__frame';
    frame.setAttribute('role', 'dialog');
    frame.setAttribute('aria-modal', 'true');
    frame.setAttribute('aria-label', 'Week One AI explainer');

    player = document.createElement('video');
    player.className = 'w1-video__player';
    player.controls = true;
    player.playsInline = true;
    player.preload = 'none';
    player.setAttribute('poster', POSTER);
    var source = document.createElement('source');
    source.src = VIDEO;
    source.type = 'video/mp4';
    player.appendChild(source);
    frame.appendChild(player);

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'w1-video__close';
    close.setAttribute('aria-label', 'Close video');
    close.textContent = '×';
    close.addEventListener('click', hide);
    frame.appendChild(close);

    modal.appendChild(frame);
    backdrop.addEventListener('click', hide);
    document.body.appendChild(modal);
    return modal;
  }

  function show(trigger) {
    lastTrigger = trigger || null;
    build();
    modal.setAttribute('data-open', 'true');
    document.documentElement.classList.add('w1-video-open');
    var play = player.play();
    if (play && play.catch) play.catch(function () { /* autoplay blocked; controls are there */ });
    modal.querySelector('.w1-video__close').focus();
  }

  function hide() {
    if (!modal) return;
    modal.setAttribute('data-open', 'false');
    document.documentElement.classList.remove('w1-video-open');
    try {
      player.pause();
      player.currentTime = 0;
    } catch (e) { /* nothing playing */ }
    silenceOthers();
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  // The hero background loop is muted and meant to run; anything else with
  // sound belongs to a player we didn't open, so stop it.
  function silenceOthers() {
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      var v = vids[i];
      if (v === player || v.muted) continue;
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) { /* not ours to control */ }
    }
  }

  // The label sits in a <p> inside the button; match on the button's own text.
  function triggerFor(node) {
    for (var i = 0, n = node; i < 6 && n && n.nodeType === 1; i++, n = n.parentElement) {
      var text = (n.textContent || '').trim().toLowerCase();
      if (text === LABEL) return n.closest('[tabindex], a, button') || n;
    }
    return null;
  }

  // Framer opens its own lightbox from pointer events, not click — so a click
  // handler alone let its player open behind this one. Swallow the whole
  // pointer sequence on the button and open only this overlay.
  ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(
    function (type) {
      document.addEventListener(
        type,
        function (event) {
          if (!triggerFor(event.target)) return;
          event.preventDefault();
          event.stopPropagation();
        },
        true
      );
    }
  );

  document.addEventListener(
    'click',
    function (event) {
      var trigger = triggerFor(event.target);
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      show(trigger);
    },
    true
  );

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.getAttribute('data-open') === 'true') {
      hide();
      return;
    }
    // The button carries tabindex but no key handling of its own.
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var trigger = triggerFor(event.target);
    if (!trigger) return;
    event.preventDefault();
    show(trigger);
  });
})();
