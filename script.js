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

  // Contact form -> sends straight to inbox via FormSubmit (no email app opens)
  const form = document.querySelector('#inquiry-form');
  if (form) {
    const status = document.querySelector('#form-status');
    const btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', async e => {
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
      if (btn) btn.disabled = true;
      if (status) status.textContent = 'Sending your inquiry…';
      try {
        const res = await fetch('https://formsubmit.co/ajax/hello@yourbeautycfo.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && (out.success === true || out.success === 'true')) {
          form.reset();
          if (status) status.textContent = 'Thank you — your inquiry has been sent. We will be in touch soon.';
        } else {
          if (status) status.textContent = 'Thank you. If you do not hear back shortly, please email hello@yourbeautycfo.com directly.';
        }
      } catch (err) {
        if (status) status.textContent = 'Sorry, something went wrong sending your message. Please email hello@yourbeautycfo.com directly.';
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }
});
