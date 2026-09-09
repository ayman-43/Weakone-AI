/* Local cleanup for the Approach page.
 *
 * Framer template residue: 15 image tiles linking to strangers' X profiles and
 * 3 inline phrases linked the same way. The source files no longer carry the
 * handles — every such href now points at the marker below. This removes the
 * tiles (images and all) and turns the inline phrases back into plain text,
 * which is how they read on the live site.
 *
 * The page is React-hydrated by the Framer bundle, so the work is redone if a
 * re-render puts the nodes back.
 */
(function () {
  'use strict';

  var MARKER = 'w1-removed';
  var TILES = 'a[href*="' + MARKER + '"]:not(.framer-text)';
  var INLINE = 'a[href*="' + MARKER + '"].framer-text';

  function clean() {
    var removed = 0;

    var tiles = document.querySelectorAll(TILES);
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      if (tile.parentElement) {
        tile.parentElement.removeChild(tile);
        removed++;
      }
    }

    // Swap each linked phrase for a span carrying the same text styling, so the
    // sentence keeps its shape without the link.
    var inline = document.querySelectorAll(INLINE);
    for (var j = 0; j < inline.length; j++) {
      var link = inline[j];
      if (!link.parentElement) continue;
      var span = document.createElement('span');
      span.className = 'framer-text';
      span.textContent = link.textContent;
      link.parentElement.replaceChild(span, link);
      removed++;
    }

    return removed;
  }

  function start() {
    clean();

    var root = document.getElementById('main') || document.body;
    var observer = new MutationObserver(function () {
      if (document.querySelector(TILES) || document.querySelector(INLINE)) clean();
    });
    observer.observe(root, { childList: true, subtree: true });

    // Hydration re-renders land in the first seconds; stop watching after that.
    window.setTimeout(function () {
      observer.disconnect();
      clean();
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
