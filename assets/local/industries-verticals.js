/* Local addition: renders all nine verticals on the Industries page.
 *
 * The page template ships only one vertical card (Painting & Trades);
 * the remaining eight are added here. Content below is taken
 * verbatim from https://weekoneai.com/industries (SEC 02 / 03 · verticals).
 *
 * The page is React-hydrated by the Framer bundle, so the block is injected
 * after hydration and re-injected if a re-render drops it.
 */
(function () {
  'use strict';

  var VERTICALS = [
    {
      id: 'painting',
      title: 'Painting & Trades',
      hook: 'Estimates go to whoever answers first — and crews can’t hold a phone.',
      body: 'When the crew is on ladders, the phone rings out and the estimate books elsewhere. AI intake answers every call, qualifies the job, and puts the estimate on the calendar before the caller tries the next name on the list.',
      chips: ['After-hours call capture', 'Estimate scheduling', 'Quote follow-up sequences', 'Local paid campaigns']
    },
    {
      id: 'hvac',
      title: 'HVAC & Home Comfort',
      hook: 'Peak season buries the phone line exactly when every call matters most.',
      body: 'Heat waves and cold snaps create demand spikes no office staff can absorb. Voice AI answers every call, books service windows, and routes emergencies — while automation keeps techs, dispatch, and invoicing in sync.',
      chips: ['24/7 call answering', 'Scheduling & dispatch automation', 'Review & follow-up flows', 'Seasonal ad campaigns']
    },
    {
      id: 'roofing',
      title: 'Roofing & Exteriors',
      hook: 'Storm weeks bring more calls than crews can log.',
      body: 'After weather events, the firms that answer first win the inspections. AI intake captures every storm call, qualifies the property, and schedules estimates — and paid campaigns aimed at affected zip codes run on real conversion data.',
      chips: ['Storm-surge call capture', 'Estimate scheduling', 'CRM orchestration', 'Geo-targeted paid campaigns']
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      hook: 'Leads go cold in minutes. Most agents answer in hours.',
      body: 'Speed-to-lead decides who gets the listing appointment. An AI front office responds the moment an inquiry lands — day or night — qualifies intent, and books the conversation onto the agent’s calendar before a competitor calls back.',
      chips: ['Instant lead response', '24/7 voice & chat intake', 'Follow-up sequences', 'Closed-loop ads']
    },
    {
      id: 'legal',
      title: 'Legal Practices',
      hook: 'Intake decides the caseload — and intake is usually a voicemail.',
      body: 'Prospective clients call several firms and retain the one that answers. AI intake screens matter type and urgency around the clock, books consultations, and keeps every inquiry documented for conflict checks and follow-up.',
      chips: ['24/7 intake & screening', 'Consultation scheduling', 'Matter-aware follow-up', 'Intake analytics']
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Aesthetics',
      hook: 'Unanswered phones and no-shows quietly cap the schedule.',
      body: 'Front desks juggle patients in the room against callers who book elsewhere. AI handles scheduling, reminders, and recall outreach with the discretion clinical settings demand — keeping chairs full without adding headcount.',
      chips: ['Appointment scheduling & reminders', 'Recall & reactivation outreach', 'After-hours answering', 'Reputation flows']
    },
    {
      id: 'ecommerce',
      title: 'E-commerce & DTC',
      hook: 'Support tickets scale faster than headcount.',
      body: 'Order status, returns, sizing, shipping — most tickets follow patterns AI resolves instantly. We deploy support automation that protects margin as volume grows, and feed clean purchase data back into Meta and Google.',
      chips: ['AI support & order-status automation', 'Post-purchase flows', 'Conversion data pipelines', 'Closed-loop paid media']
    },
    {
      id: 'financial',
      title: 'Financial Services',
      hook: 'Advisors spend client hours on admin that software should absorb.',
      body: 'Scheduling, document chasing, meeting prep, CRM notes — the operational layer between advisor and client is heavily automatable. We build it carefully, with the audit trails and human review points the industry requires.',
      chips: ['Client scheduling & prep automation', 'Document workflow automation', 'CRM hygiene', 'Compliance-aware review points']
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Local Services',
      hook: 'Bookings live and die on response time.',
      body: 'Reservations, quotes, availability questions — every unanswered message is a table or job that books elsewhere. AI answers instantly across phone, chat, and social, and keeps calendars accurate without a human in the loop.',
      chips: ['Omni-channel booking AI', 'Availability & quote automation', 'Review generation', 'Local paid campaigns']
    }
  ];

  var SECTION_ID = 'w1-verticals';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildCard(data) {
    var card = el('article', 'w1-vertical');
    card.id = 'industry-' + data.id;
    card.setAttribute('data-open', 'false');

    var panelId = 'w1-panel-' + data.id;

    var heading = el('h3', 'w1-vertical__h');
    var toggle = el('button', 'w1-vertical__toggle', data.title);
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', panelId);
    heading.appendChild(toggle);
    card.appendChild(heading);

    card.appendChild(el('p', 'w1-vertical__hook', data.hook));

    var panel = el('div', 'w1-vertical__panel');
    panel.id = panelId;
    var panelInner = el('div');
    panelInner.appendChild(el('p', 'w1-vertical__body', data.body));

    var chips = el('div', 'w1-vertical__chips');
    data.chips.forEach(function (chip) {
      chips.appendChild(el('span', 'w1-chip', chip));
    });
    panelInner.appendChild(chips);
    panel.appendChild(panelInner);
    card.appendChild(panel);

    card.appendChild(el('p', 'w1-vertical__cta', 'How it applies'));

    function setOpen(open) {
      card.setAttribute('data-open', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    card.addEventListener('click', function (event) {
      // The toggle fires its own handler; ignore it so the state does not flip twice.
      if (event.target === toggle) return;
      setOpen(card.getAttribute('data-open') !== 'true');
    });

    toggle.addEventListener('click', function () {
      setOpen(card.getAttribute('data-open') !== 'true');
    });

    return card;
  }

  function buildSection() {
    var section = el('section', 'w1-verticals');
    section.id = SECTION_ID;
    section.setAttribute('aria-labelledby', SECTION_ID + '-title');

    var inner = el('div', 'w1-verticals__inner');
    inner.appendChild(el('p', 'w1-verticals__eyebrow', 'SEC 02 / 03 · verticals'));

    var title = el('h2', 'w1-verticals__title', 'The verticals we work in');
    title.id = SECTION_ID + '-title';
    inner.appendChild(title);

    // No lede here — the page hero already carries that paragraph.
    var grid = el('div', 'w1-verticals__grid');
    VERTICALS.forEach(function (data) { grid.appendChild(buildCard(data)); });
    inner.appendChild(grid);

    var note = el('p', 'w1-verticals__note');
    note.appendChild(document.createTextNode('Not on the list? The method doesn’t care about the vertical — it starts by mapping where hours and leads leak out of '));
    note.appendChild(el('em', null, 'your'));
    note.appendChild(document.createTextNode(' operation. If your business answers phones, chases leads, or runs on repeatable admin, the map will find something.'));
    inner.appendChild(note);

    section.appendChild(inner);
    return section;
  }

  // `.framer-1bndo69` is the single-vertical card this block replaces. The
  // grid takes its slot in the section, and the old card is dropped.
  var OLD_CARD = '.framer-1bndo69';

  function findAnchor() {
    return document.querySelector(OLD_CARD);
  }

  function dropOldCard() {
    var old = document.querySelector(OLD_CARD);
    if (old && old.parentElement) old.parentElement.removeChild(old);
  }

  function openFromHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var card = document.getElementById(hash.slice(1));
    if (card && card.classList.contains('w1-vertical')) {
      card.setAttribute('data-open', 'true');
      var toggle = card.querySelector('.w1-vertical__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      card.scrollIntoView({ block: 'start' });
    }
  }

  var mountAttempts = 0;

  function mount() {
    if (document.getElementById(SECTION_ID)) return;

    var anchor = findAnchor();
    var section = buildSection();

    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertBefore(section, anchor);
    } else {
      (document.getElementById('main') || document.body).appendChild(section);
    }

    openFromHash();
  }

  function start() {
    mount();

    // Framer hydrates after load; re-insert if a re-render removes the block.
    var root = document.getElementById('main') || document.body;
    var observer = new MutationObserver(function () {
      if (document.getElementById(SECTION_ID)) return;
      if (mountAttempts >= 10) { observer.disconnect(); return; }
      mountAttempts++;
      mount();
    });
    observer.observe(root, { childList: true, subtree: true });

    // Let hydration finish before pulling the old card out of the tree, so
    // React reconciles against the DOM it rendered. Until then the stylesheet
    // keeps it hidden.
    window.setTimeout(dropOldCard, 3000);

    // Stop watching once the page has settled.
    window.setTimeout(function () {
      observer.disconnect();
      dropOldCard();
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('hashchange', openFromHash);
})();
