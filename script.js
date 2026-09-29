/* =========================================================
   KEO RATANAK — PORTFOLIO
   script.js — vanilla JS interactivity (no dependencies)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADING SCREEN ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 400);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2500);

  /* ---------- 2. STICKY NAV + SCROLLED STATE ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 3. MOBILE NAV TOGGLE ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    hamburger.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- 4. ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  };
  document.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- 5. TYPING ANIMATION ---------- */
  const typedEl = document.getElementById('typedText');
  const roles = ['Software Engineer', 'Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = false;

    const type = () => {
      const current = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typedEl.textContent = current.substring(0, charIndex);

      let delay = isDeleting ? 45 : 90;

      if (!isDeleting && charIndex === current.length) {
        delay = 1600;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }

      setTimeout(type, delay);
    };

    setTimeout(type, 1600);
  }

  /* ---------- 6. SCROLL REVEAL ---------- */
  // Elements are visible by default (see style.css). Only add the
  // hidden "pending" state here, at runtime, so a JS failure never
  // leaves the page blank.
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealEls.forEach(el => el.classList.add('reveal-pending'));

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }
  // If IntersectionObserver isn't supported, elements simply stay
  // in their default visible state — nothing further needed.

  /* ---------- 7. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- 8. ANIMATED SKILL BARS ---------- */
  const skillbars = document.querySelectorAll('.skillbar');

  if ('IntersectionObserver' in window && skillbars.length) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const fill = bar.querySelector('.skillbar__fill');
          const level = bar.getAttribute('data-level') || 0;
          requestAnimationFrame(() => { fill.style.width = `${level}%`; });
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    skillbars.forEach(bar => skillObserver.observe(bar));
  }

  /* ---------- 9. DARK / LIGHT MODE TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('kr-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    themeToggle.setAttribute('aria-pressed', String(savedTheme === 'light'));
  }

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';

    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('kr-theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'light'));
  });

  /* ---------- 10. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 ? '' : 'Please enter a subject.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  };

  const validateField = (field) => {
    const value = field.value;
    const message = validators[field.name] ? validators[field.name](value) : '';
    const errorEl = document.getElementById(`${field.name}Error`);

    field.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message;

    return !message;
  };

  if (form) {
    ['name', 'email', 'subject', 'message'].forEach(id => {
      const field = document.getElementById(id);
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = ['name', 'email', 'subject', 'message'].map(id => document.getElementById(id));
      const allValid = fields.map(validateField).every(Boolean);

      if (allValid) {
        successMsg.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        form.reset();
        setTimeout(() => { successMsg.textContent = ''; }, 6000);
      } else {
        successMsg.textContent = '';
        fields.find(f => f.classList.contains('is-invalid'))?.focus();
      }
    });
  }

  /* ---------- 11. FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});