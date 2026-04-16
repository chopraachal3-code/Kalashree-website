/* ============================================================
   KALASHREE PRINTERS – script.js
   Vanilla JS – No dependencies
   ============================================================ */

/* ── DOM HELPERS ────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── ELEMENT REFERENCES ─────────────────────────────────────── */
const header        = $('header')  || document.querySelector('.header');
const headerEl      = document.querySelector('.header');
const hamburger     = $('hamburger');
const sidebar       = $('sidebar');
const sidebarClose  = $('sidebarClose');
const overlay       = $('overlay');
const searchToggle  = $('searchToggle');
const searchBar     = $('searchBar');
const searchInput   = $('searchInput');
const searchClear   = $('searchClear');
const searchResults = $('searchResults');
const productsTrack = $('productsTrack');
const trackPrev     = $('trackPrev');
const trackNext     = $('trackNext');
const trackDots     = $('trackDots');
const modalBackdrop = $('modalBackdrop');
const enquiryModal  = $('enquiryModal');
const modalClose    = $('modalClose');
const modalProduct  = $('modalProduct');
const enquiryForm   = $('enquiryForm');
const contactForm   = $('contactForm');
const toast         = $('toast');
const toastMsg      = $('toastMsg');

/* ============================================================
   1. STICKY HEADER – add shadow on scroll
   ============================================================ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
});

/* ============================================================
   2. SIDEBAR NAVIGATION
   ============================================================ */
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

/* Close sidebar when a nav link is clicked */
$$('.sidebar-links .nav-link').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

/* ============================================================
   3. SEARCH BAR TOGGLE
   ============================================================ */
searchToggle.addEventListener('click', () => {
  const isOpen = searchBar.classList.toggle('active');
  if (isOpen) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    searchResults.style.display = 'none';
  }
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchResults.style.display = 'none';
  searchInput.focus();
});

/* Close search bar on Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchBar.classList.remove('active');
    searchInput.value = '';
    searchResults.style.display = 'none';
    closeModal();
  }
});

/* ── Search data ─────────────────────────────────────────────── */
const searchData = [
  { label: 'Gold Foil Elegance', category: 'Wedding Cards',    anchor: '#products' },
  { label: 'Floral Rhapsody',    category: 'Wedding Cards',    anchor: '#products' },
  { label: 'Velvet Box Suite',   category: 'Wedding Cards',    anchor: '#products' },
  { label: 'Laser Cut Mandala',  category: 'Wedding Cards',    anchor: '#products' },
  { label: 'Royal Scroll',       category: 'Wedding Cards',    anchor: '#products' },
  { label: 'Wedding Cards',      category: 'Category',         anchor: '#cat-wedding' },
  { label: 'E-Invites',          category: 'Category',         anchor: '#cat-einvite' },
  { label: 'Birthday Invites',   category: 'Category',         anchor: '#cat-birthday' },
  { label: 'Anniversary Invites',category: 'Category',         anchor: '#cat-birthday' },
  { label: 'Inauguration Invites',category:'Category',         anchor: '#cat-inauguration' },
  { label: 'About Us',           category: 'Page',             anchor: '#about' },
  { label: 'Contact',            category: 'Page',             anchor: '#contact' },
];

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { searchResults.style.display = 'none'; return; }

  const filtered = searchData.filter(item =>
    item.label.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    searchResults.innerHTML = `<div class="no-results">No results found</div>`;
  } else {
    searchResults.innerHTML = filtered.map(item => `
      <div class="search-result-item" data-anchor="${item.anchor}">
        <strong>${highlight(item.label, query)}</strong>
        <span style="color:var(--muted);font-size:.75rem;margin-left:8px;">${item.category}</span>
      </div>
    `).join('');

    /* Attach click listeners */
    $$('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const target = document.querySelector(el.dataset.anchor);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        searchBar.classList.remove('active');
        searchInput.value = '';
        searchResults.style.display = 'none';
      });
    });
  }
  searchResults.style.display = 'block';
});

/* Helper to bold the matched portion */
function highlight(text, query) {
  const re = new RegExp(`(${query})`, 'gi');
  return text.replace(re, '<mark style="background:var(--gold);padding:0 2px;">$1</mark>');
}

/* Close search results on outside click */
document.addEventListener('click', e => {
  if (!searchBar.contains(e.target) && !searchResults.contains(e.target) && e.target !== searchToggle) {
    searchResults.style.display = 'none';
  }
});

/* ============================================================
   4. PRODUCTS TRACK – Arrow scroll + Drag scroll + Dots
   ============================================================ */
const CARD_W = 320 + 28; // card width + gap

/* Build dots */
function buildDots() {
  const cards = productsTrack.querySelectorAll('.product-card');
  trackDots.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'track-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to card ${i + 1}`);
    dot.addEventListener('click', () => {
      productsTrack.scrollTo({ left: i * CARD_W, behavior: 'smooth' });
    });
    trackDots.appendChild(dot);
  });
}
buildDots();

/* Update active dot on scroll */
productsTrack.addEventListener('scroll', () => {
  const idx = Math.round(productsTrack.scrollLeft / CARD_W);
  $$('.track-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
});

/* Arrow buttons */
trackPrev.addEventListener('click', () => {
  productsTrack.scrollBy({ left: -CARD_W, behavior: 'smooth' });
});
trackNext.addEventListener('click', () => {
  productsTrack.scrollBy({ left: CARD_W, behavior: 'smooth' });
});

/* Drag-to-scroll */
let isDragging = false, startX, scrollLeft;

productsTrack.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX - productsTrack.offsetLeft;
  scrollLeft = productsTrack.scrollLeft;
  productsTrack.classList.add('grabbing');
});
productsTrack.addEventListener('mouseleave', () => {
  isDragging = false;
  productsTrack.classList.remove('grabbing');
});
productsTrack.addEventListener('mouseup', () => {
  isDragging = false;
  productsTrack.classList.remove('grabbing');
});
productsTrack.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - productsTrack.offsetLeft;
  const walk = (x - startX) * 1.5;
  productsTrack.scrollLeft = scrollLeft - walk;
});

/* ============================================================
   5. SCROLL-TRIGGERED REVEAL ANIMATION
   ============================================================ */
const revealEls = $$('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   6. ENQUIRY MODAL
   ============================================================ */
function openModal(productName) {
  modalProduct.textContent = productName || '';
  enquiryModal.classList.add('active');
  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus first input for accessibility
  setTimeout(() => { $('m-name').focus(); }, 200);
}

function closeModal() {
  enquiryModal.classList.remove('active');
  modalBackdrop.classList.remove('active');
  document.body.style.overflow = '';
  enquiryForm.reset();
}

/* Wire up all Enquire Now buttons */
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-enquire')) {
    const productName = e.target.dataset.product || '';
    openModal(productName);
  }
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

/* ============================================================
   7. TOAST NOTIFICATION
   ============================================================ */
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ============================================================
   8. FORM HANDLING
   ============================================================ */

/* Shared form validator */
function validateForm(form) {
  let valid = true;
  const name  = form.querySelector('[name="name"]');
  const phone = form.querySelector('[name="phone"]');

  if (name && name.value.trim().length < 2) {
    name.style.borderColor = 'var(--red)';
    valid = false;
  } else if (name) {
    name.style.borderColor = '';
  }

  if (phone && !/^\d{10}$/.test(phone.value.trim())) {
    phone.style.borderColor = 'var(--red)';
    valid = false;
  } else if (phone) {
    phone.style.borderColor = '';
  }

  return valid;
}

/* Enquiry modal form submit */
enquiryForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm(enquiryForm)) {
    shakeForm(enquiryForm);
    return;
  }
  const name = enquiryForm.querySelector('[name="name"]').value.trim();
  closeModal();
  showToast(`Thank you, ${name}! We'll contact you shortly.`);
});

/* Contact form submit */
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm(contactForm)) {
    shakeForm(contactForm);
    return;
  }
  const name = contactForm.querySelector('[name="name"]').value.trim();
  contactForm.reset();
  showToast(`Thank you, ${name}! Your message has been received.`);
});

/* Shake animation for invalid forms */
function shakeForm(form) {
  form.style.animation = 'none';
  form.offsetHeight; // reflow
  form.style.animation = 'shake .4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

/* Add shake keyframe dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================================
   9. SMOOTH SCROLL for all anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = headerEl.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   10. CATEGORY GRID – touch swipe on mobile
       (Category items use CSS hover overlay; no JS needed)
       But add tap-to-show overlay on touch devices
   ============================================================ */
if ('ontouchstart' in window) {
  $$('.cat-item').forEach(item => {
    item.addEventListener('click', () => {
      // On touch: toggle overlay visibility
      const overlay = item.querySelector('.cat-overlay');
      const isVisible = overlay.style.opacity === '1';
      // hide all other overlays
      $$('.cat-overlay').forEach(o => { o.style.opacity = ''; });
      if (!isVisible) overlay.style.opacity = '1';
    });
  });

  /* Enquire button inside cat-item: stop propagation so it opens modal */
  $$('.cat-item .btn-enquire').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
    });
  });
}

/* ============================================================
   11. HEADER SCROLL PROGRESS (thin gold line under header)
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 70px;
  left: 0;
  height: 2px;
  background: linear-gradient(to right, var(--gold-dark), var(--red));
  z-index: 799;
  width: 0%;
  transition: width .1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const pct   = (window.scrollY / total) * 100;
  progressBar.style.width = pct + '%';
});

/* ============================================================
   12. BACK TO TOP – appears after scrolling 400px
   ============================================================ */
const backTop = document.createElement('button');
backTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
backTop.setAttribute('aria-label', 'Back to top');
backTop.style.cssText = `
  position: fixed;
  bottom: 90px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--charcoal);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease, transform .3s ease;
  z-index: 700;
  cursor: pointer;
`;
document.body.appendChild(backTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backTop.style.opacity = '1';
    backTop.style.pointerEvents = 'all';
  } else {
    backTop.style.opacity = '0';
    backTop.style.pointerEvents = 'none';
  }
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   INIT – log ready state
   ============================================================ */
console.log('%cKalashree Printers ✦ Website Loaded', 'color:#d4af37;font-family:serif;font-size:14px;');