(() => {
  const EMAIL = 'almost.theraputic@gmail.com';
// Paste your calendar booking link here (Calendly, Cal.com, etc.). Leave empty to email instead.
const BOOKING_URL = '';
// Times on offer. Change these to the real ones.
const SLOTS = ['10:00', '13:00', '17:00', '19:00'];
// Paste your Google Business Profile link here.
const GBP_URL = '';

  const mailto = (subject, body) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Buttons that say "book" open a ready-written email; the contact form lets people add detail.
  document.querySelectorAll('[data-mail]').forEach((a) => {
    if (a.dataset.mail === 'hero' || a.dataset.mail === 'price') {
      a.href = mailto(
        'First call enquiry',
        'Hello,\n\nI would like to book a first 30-minute call.\n\nThank you,\n'
      );
    }
  });

  // Entrances: stagger the parts of each section in reading order, once.
  document.querySelectorAll('main > section, .foot').forEach((section) => {
    section.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', Math.min(i, 6)));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // Contact form: opens the visitor's own mail app with everything filled in. Nothing is stored.
  const form = document.getElementById('mail-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name') || '').toString().trim();
    const why = (d.get('why') || '').toString().trim();
    const times = (d.get('times') || '').toString().trim();
    const lines = ['Hello,', '', 'I would like to book a first 30-minute call.'];
    if (d.get('student')) lines.push('', 'I am a student and can show valid student ID, so I would like the 40% student discount.');
    if (why) lines.push('', `What brings me here: ${why}`);
    if (times) lines.push('', `Times that suit me: ${times}`);
    lines.push('', 'Thank you,', name);
    window.location.href = mailto('First call enquiry', lines.join('\n'));
  });

  // For people on webmail with no mail app configured.
  const status = document.getElementById('copy-status');
  const copyBtn = document.getElementById('copy-mail');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyBtn.textContent = 'Copied. Paste it into your email.';
      status.textContent = 'Email address copied.';
    } catch {
      copyBtn.textContent = EMAIL;
      status.textContent = 'Copy failed. The address is ' + EMAIL;
    }
  });
})();

// Booking picker: next 14 days (Mon-Sat) and set times. Writes the chosen slot into an email.
(() => {
  const EMAIL = 'almost.theraputic@gmail.com';
  const BOOKING_URL = '';
  const SLOTS = ['10:00', '13:00', '17:00', '19:00'];
  const mailto = (subject, body) => "mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}";
  const days = document.getElementById('days'), times = document.getElementById('times'), send = document.getElementById('send-request');
  if (!days) return;
  let day = null, time = null;
  const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const chip = (label, group, onPick) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      group.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true'); onPick(); update();
    });
    group.append(b);
  };
  const today = new Date();
  for (let i = 1, n = 0; n < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (d.getDay() === 0) continue;
    n++;
    chip(fmtDay(d), days, () => { day = fmtDay(d); });
  }
  SLOTS.forEach((t) => chip(t, times, () => { time = t; }));
  const update = () => {
    if (day && time) {
      send.removeAttribute('aria-disabled');
      send.textContent = `Request ${day} at ${time}`;
      send.href = BOOKING_URL || mailto('First call request', `Hello,\n\nI would like to book a first 30-minute call.\n\nPreferred time: ${day} at ${time}\n\nThank you.`);
      if (BOOKING_URL) { send.target = '_blank'; send.rel = 'noopener'; }
    } else {
      send.setAttribute('aria-disabled', 'true'); send.removeAttribute('href');
      send.textContent = 'Choose a day and time';
    }
  };
  send.addEventListener('click', (e) => { if (send.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
})();