/* Booking calendar for the contact page.
 *
 * Same behaviour as the live booking flow: weekdays only, 30-minute slots from
 * 09:00 to 17:30 Eastern, and submitting opens a pre-addressed email carrying
 * the chosen slot and the caller's details. Entirely client-side — no server
 * and no third-party scheduler.
 *
 * Subject and body are built to the same shape the live site uses, so requests
 * arrive looking the same however they were sent.
 */
(function () {
  'use strict';

  var EMAIL = 'info@weekoneai.com';
  var TZ = 'U.S. Eastern Time (ET)';
  var SMS_CONSENT =
    'By submitting, you authorize AURA ENTERPRISES to text/call the number above ' +
    'for informational/transactional messages, possibly using automated means. ' +
    'Msg/data rates apply, msg frequency varies. Consent is not a condition of ' +
    'purchase. See terms and privacy policy. Text HELP for help and STOP to unsubscribe.';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  var DOW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var chosenDate = null;
  var chosenTime = null;

  function iso(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // Weekdays only, nothing in the past.
  function bookable(d) {
    var day = d.getDay();
    if (day === 0 || day === 6) return false;
    return d >= today;
  }

  function slotsFor() {
    var out = [];
    for (var h = 9; h <= 17; h++) {
      out.push(String(h).padStart(2, '0') + ':00');
      out.push(String(h).padStart(2, '0') + ':30');
    }
    return out;
  }

  function mailtoFor(d) {
    var subject = 'Working session request — ' + d.dateISO + ' at ' + d.time + ' ET';
    var body = [
      'Requested slot: ' + d.dateISO + ' at ' + d.time + ' (' + TZ + ')',
      '',
      'Name: ' + d.name,
      'Email: ' + d.email,
      d.company ? 'Company: ' + d.company : '',
      d.note ? '\nWhat we should look at first:\n' + d.note : '',
      d.phone ? '\nPhone: ' + d.phone + '\nSMS consent: ' +
        (d.smsConsent ? 'YES — agreed to: "' + SMS_CONSENT + '"' : 'not given') : ''
    ].filter(Boolean).join('\n');
    return 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function field(labelText, tag, attrs, wide) {
    var wrap = el('div', wide ? 'w1-cal__field--wide' : '');
    var lab = el('label', null, labelText);
    var input = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) { input.setAttribute(k, attrs[k]); });
    lab.setAttribute('for', attrs.id);
    wrap.appendChild(lab);
    wrap.appendChild(input);
    return wrap;
  }

  function build() {
    var root = el('section', 'w1-cal');
    root.setAttribute('aria-label', 'Book a working session');

    var grid = el('div', 'w1-cal__grid');

    // --- left: the month -------------------------------------------------
    var left = el('div');
    var head = el('div', 'w1-cal__head');
    var month = el('div', 'w1-cal__month');
    var nav = el('div', 'w1-cal__nav');
    var prev = el('button', null, '←');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous month');
    var next = el('button', null, '→');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next month');
    nav.appendChild(prev);
    nav.appendChild(next);
    head.appendChild(month);
    head.appendChild(nav);
    left.appendChild(head);

    var dow = el('div', 'w1-cal__dow');
    DOW.forEach(function (d) { dow.appendChild(el('span', null, d)); });
    left.appendChild(dow);

    var days = el('div', 'w1-cal__days');
    left.appendChild(days);
    left.appendChild(el('p', 'w1-cal__tz', '30 MIN · U.S. EASTERN TIME (ET)'));

    // --- right: the slots ------------------------------------------------
    var right = el('div');
    right.appendChild(el('p', 'w1-cal__eyebrow', 'Pick a day'));
    var slots = el('div', 'w1-cal__slots');
    slots.appendChild(el('p', 'w1-cal__empty', 'Select a date to see available times.'));
    right.appendChild(slots);

    grid.appendChild(left);
    grid.appendChild(right);
    root.appendChild(grid);

    // --- the form --------------------------------------------------------
    var form = el('form', 'w1-cal__form');
    form.setAttribute('data-open', 'false');
    var chosen = el('p', 'w1-cal__chosen');
    form.appendChild(chosen);

    var fields = el('div', 'w1-cal__fields');
    fields.appendChild(field('Name', 'input', { type: 'text', id: 'w1-name', required: 'required', autocomplete: 'name' }));
    fields.appendChild(field('Email', 'input', { type: 'email', id: 'w1-email', required: 'required', autocomplete: 'email' }));
    fields.appendChild(field('Company (optional)', 'input', { type: 'text', id: 'w1-company', autocomplete: 'organization' }));
    fields.appendChild(field('Phone (optional)', 'input', { type: 'tel', id: 'w1-phone-input', autocomplete: 'tel' }));
    fields.appendChild(field('What should we look at first? (optional)', 'textarea', { id: 'w1-note' }, true));
    form.appendChild(fields);

    var consent = el('label', 'w1-cal__consent');
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.id = 'w1-sms';
    consent.appendChild(box);
    consent.appendChild(el('span', null, SMS_CONSENT));
    form.appendChild(consent);

    var submit = el('button', 'w1-cal__submit', 'Request this slot');
    submit.type = 'submit';
    form.appendChild(submit);
    form.appendChild(el('p', 'w1-cal__hint',
      'This opens your email app with the slot and details filled in — send it and we’ll confirm.'));

    root.appendChild(form);

    // --- rendering -------------------------------------------------------

    function renderMonth() {
      month.textContent = MONTHS[view.getMonth()];
      var yr = el('span', null, String(view.getFullYear()));
      month.appendChild(yr);

      prev.disabled = view.getFullYear() === today.getFullYear() &&
        view.getMonth() === today.getMonth();

      days.textContent = '';
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var b = 0; b < first.getDay(); b++) {
        days.appendChild(el('button', 'w1-cal__blank', ''));
      }
      for (var d = 1; d <= count; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var btn = el('button', null, String(d));
        btn.type = 'button';
        if (!bookable(date)) {
          btn.disabled = true;
        } else {
          btn.setAttribute('aria-pressed', chosenDate && iso(chosenDate) === iso(date) ? 'true' : 'false');
          btn.addEventListener('click', pick(date));
        }
        days.appendChild(btn);
      }
    }

    function pick(date) {
      return function () {
        chosenDate = date;
        chosenTime = null;
        renderMonth();
        renderSlots();
        form.setAttribute('data-open', 'false');
      };
    }

    function renderSlots() {
      slots.textContent = '';
      if (!chosenDate) {
        slots.appendChild(el('p', 'w1-cal__empty', 'Select a date to see available times.'));
        return;
      }
      slotsFor().forEach(function (t) {
        var b = el('button', null, t);
        b.type = 'button';
        b.setAttribute('aria-pressed', chosenTime === t ? 'true' : 'false');
        b.addEventListener('click', function () {
          chosenTime = t;
          renderSlots();
          chosen.textContent = '';
          chosen.appendChild(document.createTextNode('Requesting '));
          chosen.appendChild(el('strong', null, iso(chosenDate) + ' at ' + t + ' ET'));
          chosen.appendChild(document.createTextNode(' — 30 minutes.'));
          form.setAttribute('data-open', 'true');
          form.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
        slots.appendChild(b);
      });
    }

    prev.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      renderMonth();
    });
    next.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      renderMonth();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!chosenDate || !chosenTime) return;
      window.location.href = mailtoFor({
        dateISO: iso(chosenDate),
        time: chosenTime,
        name: form.querySelector('#w1-name').value.trim(),
        email: form.querySelector('#w1-email').value.trim(),
        company: form.querySelector('#w1-company').value.trim(),
        phone: form.querySelector('#w1-phone-input').value.trim(),
        note: form.querySelector('#w1-note').value.trim(),
        smsConsent: form.querySelector('#w1-sms').checked
      });
    });

    renderMonth();
    renderSlots();
    return root;
  }

  function mount() {
    if (!/\/contact\/?$/.test(window.location.pathname)) return;
    if (document.querySelector('.w1-cal')) return;
    var anchor = document.querySelector('.w1-contact-note') ||
      (document.querySelector('a[href^="mailto:"]') || {}).parentElement;
    if (!anchor) return;
    anchor.parentElement.insertBefore(build(), anchor.nextSibling);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.addEventListener('load', function () {
    mount();
    var root = document.getElementById('main') || document.body;
    var observer = new MutationObserver(mount);
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); mount(); }, 15000);
  });
})();
