document.addEventListener('DOMContentLoaded', () => {

  // If the page was redirected after a successful form submit, show success message
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function showSuccessMessage(text) {
    const section = document.querySelector('#contact');
    if (!section) return;
    // remove existing message if present
    const existing = section.querySelector('.form-success');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.setAttribute('role', 'status');
    msg.textContent = text || 'Tu mensaje se envió correctamente. Gracias — te responderé pronto.';

    // insert after the form
    const form = section.querySelector('.contact-form');
    if (form) {
      form.insertAdjacentElement('afterend', msg);
      // reset form fields for a clean state
      try { form.reset(); } catch (e) {}
    } else {
      section.appendChild(msg);
    }
  }

  // show message if ?sent=1 in URL
  if (getQueryParam('sent') === '1') {
    // small timeout so scroll-to-contact (from _next anchor) completes first
    setTimeout(() => showSuccessMessage('¡Listo! Tu mensaje fue enviado correctamente.'), 300);
  }

  // --- HEADER -> CONTACT FORM subject wiring ---
  const contratar = document.querySelector('#link-contratar');
  const freelance = document.querySelector('#link-freelance');
  const subjectSelect = document.querySelector('#subject');
  const hiddenSubject = document.querySelector('#emailSubject'); // optional hidden input

  function scrollToForm() {
    const contact = document.querySelector('#contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
  }

  function setSubject(value) {
    if (!value) return;
    if (subjectSelect) {
      subjectSelect.value = value;
      // visual feedback: highlight the select briefly
      const prevBorder = subjectSelect.style.borderColor;
      const prevBox = subjectSelect.style.boxShadow;
      subjectSelect.style.borderColor = '#2563eb';
      subjectSelect.style.boxShadow = '0 0 0 6px rgba(37,99,235,0.12)';
      setTimeout(() => {
        subjectSelect.style.borderColor = prevBorder;
        subjectSelect.style.boxShadow = prevBox;
      }, 1400);
    }
    if (hiddenSubject) {
      hiddenSubject.value = value;
    }
  }

  if (contratar) {
    contratar.addEventListener('click', (e) => {
      e.preventDefault();
      setSubject('CONTRÁTAME');
      scrollToForm();
    });
  }

  if (freelance) {
    freelance.addEventListener('click', (e) => {
      e.preventDefault();
      setSubject('SOLICITAR SERVICIO');
      scrollToForm();
    });
  }

  // Configuración del carousel
  const container = document.querySelector('.cards');
  const prev = document.querySelector('.carousel-button.prev');
  const next = document.querySelector('.carousel-button.next');

  if (!container || !prev || !next) return;

  function pageWidth() {
    // scroll by the visible area (wrapper width)
    return container.clientWidth;
  }

  function updateButtons() {
    const maxScroll = container.scrollWidth - container.clientWidth;
    prev.disabled = container.scrollLeft <= 0;
    next.disabled = container.scrollLeft >= Math.max(0, maxScroll - 1);

    if (maxScroll <= 0) {
      prev.style.display = 'none';
      next.style.display = 'none';
    } else {
      prev.style.display = '';
      next.style.display = '';
    }
  }

  prev.addEventListener('click', () => {
    container.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    container.scrollBy({ left: pageWidth(), behavior: 'smooth' });
  });

  container.addEventListener('scroll', () => {
    // throttle not necessary for small pages
    updateButtons();
  });

  window.addEventListener('resize', () => {
    updateButtons();
  });

  // initial state
  updateButtons();

  // allow keyboard arrows when focus is inside the carousel
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });

  // make container focusable for keyboard support
  container.setAttribute('tabindex', '0');

  // prevent horizontal wheel/trackpad gestures from causing page scroll
  // allow horizontal scrolling inside the carousel instead
  container.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      container.scrollBy({ left: e.deltaX, behavior: 'auto' });
    }
  }, { passive: false });

});