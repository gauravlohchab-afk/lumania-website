/* ================================================================
   SERENOVA WELLNESS — script.js
   Complete JavaScript for all pages
   ================================================================ */

'use strict';

/* ────────────────────────────────────────────
   1. NAVBAR — Sticky shadow + mobile toggle
   ──────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

// Add shadow when scrolled
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// Hamburger toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navbar && !navbar.contains(e.target)) {
    navMenu && navMenu.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
  }
});

// Close menu on nav link click (mobile)
if (navMenu) {
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle && navToggle.classList.remove('open');
    });
  });
}

// Mobile dropdown toggles
if (navMenu) {
  navMenu.querySelectorAll('.nav-item > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const parent = link.parentElement;
        if (parent.querySelector('.dropdown')) {
          e.preventDefault();
          parent.classList.toggle('open');
        }
      }
    });
  });
}

/* ────────────────────────────────────────────
   2. HERO SLIDER — DISABLED (replaced with static two-column layout)
   ──────────────────────────────────────────── */
// Slider functionality removed - hero is now a static two-column layout


/* ────────────────────────────────────────────
   3. SCROLL REVEAL ANIMATION
   ──────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────
   4. COUNTER ANIMATION (Stats section)
   ──────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000; // ms
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ────────────────────────────────────────────
   5. TESTIMONIALS SLIDER
   ──────────────────────────────────────────── */
const testiTrack = document.getElementById('testiTrack');
const testiPrev  = document.getElementById('testiPrev');
const testiNext  = document.getElementById('testiNext');

if (testiTrack) {
  const testiCards   = testiTrack.querySelectorAll('.testi-card');
  let testiCurrent   = 0;
  let testiAutoplay  = null;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    return 2;
  }

  function updateTesti() {
    const visCount = getVisibleCount();
    const maxIndex = Math.max(0, testiCards.length - visCount);
    testiCurrent = Math.min(testiCurrent, maxIndex);
    const cardWidth = testiCards[0].offsetWidth + 28; // gap
    testiTrack.style.transform = `translateX(-${testiCurrent * cardWidth}px)`;
  }

  function testiNext_fn() {
    const visCount = getVisibleCount();
    const maxIndex = Math.max(0, testiCards.length - visCount);
    testiCurrent = testiCurrent < maxIndex ? testiCurrent + 1 : 0;
    updateTesti();
  }

  function testiPrev_fn() {
    const visCount = getVisibleCount();
    const maxIndex = Math.max(0, testiCards.length - visCount);
    testiCurrent = testiCurrent > 0 ? testiCurrent - 1 : maxIndex;
    updateTesti();
  }

  testiNext && testiNext.addEventListener('click', () => { testiNext_fn(); resetTestiAuto(); });
  testiPrev && testiPrev.addEventListener('click', () => { testiPrev_fn(); resetTestiAuto(); });

  function startTestiAuto() { testiAutoplay = setInterval(testiNext_fn, 4500); }
  function resetTestiAuto() { clearInterval(testiAutoplay); startTestiAuto(); }

  // Touch swipe on testimonials
  let testiTouchStart = 0;
  testiTrack.addEventListener('touchstart', e => { testiTouchStart = e.touches[0].clientX; }, { passive: true });
  testiTrack.addEventListener('touchend', e => {
    const diff = testiTouchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? testiNext_fn() : testiPrev_fn(); resetTestiAuto(); }
  });

  // Recalculate on resize
  window.addEventListener('resize', updateTesti, { passive: true });

  startTestiAuto();
}

/* ────────────────────────────────────────────
   6. SERVICE DETAIL PAGE — TABS
   ──────────────────────────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    // Update buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');
  });
});

/* ────────────────────────────────────────────
   7. PAGINATION BUTTONS (Blog page)
   ──────────────────────────────────────────── */
document.querySelectorAll('.page-btn:not(:first-child):not(:last-child)').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
    if (!isNaN(parseInt(this.textContent))) this.classList.add('active');
  });
});

/* ────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLLING
   ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────
   9. NAVBAR ACTIVE LINK on scroll
   ──────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.nav-book)');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sec.id}`) link.classList.add('active');
      });
    }
  });
}, { passive: true });

/* ────────────────────────────────────────────
   10. BACK TO TOP button (auto-created)
   ──────────────────────────────────────────── */
const backToTop = document.createElement('button');
backToTop.innerHTML = '&#8679;';
backToTop.setAttribute('aria-label', 'Back to top');
Object.assign(backToTop.style, {
  position: 'fixed',
  bottom: '100px',
  right: '30px',
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: 'var(--dark)',
  color: '#fff',
  border: 'none',
  fontSize: '22px',
  cursor: 'pointer',
  zIndex: '9998',
  opacity: '0',
  transform: 'scale(0.8)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  lineHeight: '1',
});
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'scale(1)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'scale(0.8)';
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ────────────────────────────────────────────
   11. CAT STRIP — active state on hover/click
   ──────────────────────────────────────────── */
document.querySelectorAll('.cat-item').forEach(item => {
  item.addEventListener('mouseenter', function () {
    document.querySelectorAll('.cat-item').forEach(i => i.style.background = '');
    this.style.background = 'var(--white)';
  });
  item.addEventListener('mouseleave', function () {
    this.style.background = '';
  });
});

/* ────────────────────────────────────────────
   12. IMAGE LAZY LOAD FALLBACK
   ──────────────────────────────────────────── */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('error', function () {
    this.style.background = 'var(--border)';
    this.style.minHeight  = '120px';
  });
});

/* ────────────────────────────────────────────
   13. NEWSLETTER FORM feedback
   ──────────────────────────────────────────── */
document.querySelectorAll('.newsletter-form').forEach(form => {
  if (form.tagName === 'FORM') return; // Already handled by onsubmit
  const btn = form.querySelector('button');
  if (btn) {
    btn.addEventListener('click', () => {
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--accent)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3500);
      } else if (input) {
        input.style.boxShadow = '0 0 0 2px var(--primary)';
        input.focus();
        setTimeout(() => input.style.boxShadow = '', 2500);
      }
    });
  }
});

/* ────────────────────────────────────────────
   14. GALLERY ITEM click (lightbox hint)
   ──────────────────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function () {
    const img = this.querySelector('.gallery-img');
    if (!img) return;
    // Simple fullscreen preview overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '99999', cursor: 'zoom-out', padding: '20px',
    });
    const preview = document.createElement('img');
    preview.src = img.src;
    preview.alt = img.alt;
    Object.assign(preview.style, {
      maxWidth: '92vw', maxHeight: '88vh',
      borderRadius: '12px',
      boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
      animation: 'fadeIn 0.35s ease',
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, {
      position: 'absolute', top: '20px', right: '24px',
      background: 'rgba(255,255,255,0.15)', color: '#fff',
      border: 'none', borderRadius: '50%', width: '44px', height: '44px',
      fontSize: '24px', cursor: 'pointer', lineHeight: '1',
    });

    overlay.appendChild(preview);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.25s';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 250);
    };

    overlay.addEventListener('click', e => { if (e.target !== preview) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

/* Inject fadeIn keyframe for gallery */
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }';
document.head.appendChild(style);

/* ────────────────────────────────────────────
   15. SIDEBAR SEARCH — Blog pages
   ──────────────────────────────────────────── */
document.querySelectorAll('.sidebar-search button').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    if (input && input.value.trim()) {
      // In a real project, this would trigger a search
      const msg = document.createElement('p');
      msg.textContent = `Searching for: "${input.value}"...`;
      msg.style.cssText = 'font-size:13px;color:var(--primary);margin-top:8px;';
      btn.parentElement.after(msg);
      setTimeout(() => msg.remove(), 2500);
    }
  });
});

/* ────────────────────────────────────────────
   16. DOM READY — Final setup
   ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Immediately trigger reveals for above-the-fold elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });

  // Highlight current page link in nav
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  console.log('%c Serenova Wellness — Website Loaded ', 'background:#b5896a;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;');
});
