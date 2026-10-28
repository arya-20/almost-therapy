(() => {
  const EMAIL = 'almost.theraputic@gmail.com';

  const mailto = (subject, body) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Buttons that say "book" open a ready-written email; the contact form lets people add detail.
  document.querySelectorAll('[data-mail]').forEach((a) => {
    if (a.dataset.mail === 'hero' || a.dataset.mail === 'price') {
      a.href = mailto(
        'First call enquiry',
        'Hello Nithyha,\n\nI would like to book a first 30-minute call.\n\nThank you,\n'
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
    const lines = ['Hello Nithyha,', '', 'I would like to book a first 30-minute call.'];
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
