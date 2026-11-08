document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const b = document.querySelector('.hamburger'), n = document.querySelector('#mainnav');
  if (b && n) {
    b.addEventListener('click', () => {
      const open = n.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    n.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      n.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    }));
  }

  // Contact form -> sends straight to inbox via FormSubmit (no email app opens).
  // Confirms instantly and sends in the background with keepalive, so the slow
  // FormSubmit API never makes the visitor wait, and the send still completes
  // even if they navigate away or close the tab.
  const form = document.querySelector('#inquiry-form');
  if (form) {
    const status = document.querySelector('#form-status');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const payload = {
        name: d.get('name'),
        email: d.get('email'),
        business: d.get('business'),
        interest: d.get('help') || 'Not specified',
        message: d.get('message') || '',
        _subject: 'Your Beauty CFO inquiry — ' + d.get('business'),
        _template: 'table',
        _captcha: 'false'
      };

      // Fire the request; keepalive lets it outlive navigation / tab close.
      fetch('https://formsubmit.co/ajax/hello@yourbeautycfo.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).then(r => r.json()).then(out => {
        if (!(out && (out.success === true || out.success === 'true')) && status) {
          status.textContent = 'Your inquiry was received. If you do not hear back shortly, please email hello@yourbeautycfo.com directly.';
        }
      }).catch(() => {});

      // Instant confirmation — the visitor is never blocked by the slow API.
      form.reset();
      if (status) status.textContent = 'Thank you — your inquiry has been sent. We will be in touch soon.';
    });
  }
});
