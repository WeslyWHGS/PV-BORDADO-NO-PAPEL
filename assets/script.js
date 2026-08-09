// ===== Countdown regressivo (reinicia a cada 12h para manter urgência) =====
(function () {
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  if (!hoursEl) return;

  const CYCLE_MS = 12 * 60 * 60 * 1000;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const remainder = Date.now() % CYCLE_MS;
    const msLeft = CYCLE_MS - remainder;
    const totalSeconds = Math.floor(msLeft / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

// ===== FAQ Accordion =====
(function () {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ===== Sticky CTA: esconde perto da seção de oferta =====
(function () {
  const sticky = document.querySelector('.sticky-cta');
  const oferta = document.getElementById('oferta');
  if (!sticky || !oferta) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sticky.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(oferta);
  sticky.style.transition = 'transform 0.3s ease';
})();
