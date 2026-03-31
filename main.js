/* ============================================================
   SPROUT LAWN & LANDSCAPE — Shared JavaScript
   main.js — loaded on every page
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     TRACKING PIXELS & ANALYTICS
     All codes carried over from WordPress site
     ========================================================== */

  // --- Facebook Pixel 1: 545120554910959 ---
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '545120554910959');
  fbq('track', 'PageView');

  // --- Facebook Pixel 2: 304993876718773 ---
  fbq('init', '304993876718773');
  fbq('track', 'PageView');

  // --- Google Ads: AW-748853640 ---
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-748853640';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'AW-748853640');

  // Google Ads phone conversion tracking
  gtag('config', 'AW-748853640/d7frCOLwq7caEIiziuUC', {
    phone_conversion_number: '(317) 316-8654'
  });

  // --- Bing UET: 15247889 ---
  (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"15247889",
  enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},
  n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
  var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},
  i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script",
  "//bat.bing.com/bat.js","uetq");

  // --- WhatConverts ---
  var wcScript = document.createElement('script');
  wcScript.async = true;
  wcScript.src = 'https://scripts.iconnode.com/110875.js';
  document.head.appendChild(wcScript);

  // --- Hotjar: 5104239 ---
  (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:5104239,hjsv:6};a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

  // --- Google reCAPTCHA (loaded on demand, not globally) ---
  // Site key: 6LfcmCcrAAAAADwBIdiHUT6IMhEteGBFYf9Pp8uY
  // Only loaded on pages with forms — see loadRecaptcha()

  /* ==========================================================
     DOM READY
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollAnimations();
    initFaqAccordions();
    initSmoothScroll();
    initStickyNav();
    initPhoneConversion();
  });

  /* ==========================================================
     NAVIGATION
     ========================================================== */
  function initNavigation() {
    var hamburger = document.querySelector('.nav__hamburger');
    var menu = document.querySelector('.nav__menu');
    var dropdownParents = document.querySelectorAll('.nav__item');

    if (!hamburger || !menu) return;

    // Hamburger toggle
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Dropdown toggle on mobile (tap to expand)
    dropdownParents.forEach(function (item) {
      var link = item.querySelector('.nav__link');
      var dropdown = item.querySelector('.nav__dropdown');

      if (!dropdown || !link) return;

      link.addEventListener('click', function (e) {
        // Only intercept on mobile
        if (window.innerWidth <= 1024) {
          // If link has a dropdown, toggle it
          if (dropdown) {
            e.preventDefault();
            item.classList.toggle('open');

            // Close other dropdowns
            dropdownParents.forEach(function (other) {
              if (other !== item) other.classList.remove('open');
            });
          }
        }
      });
    });

    // Close menu when clicking a non-dropdown link on mobile
    menu.querySelectorAll('.nav__dropdown a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 1024) {
          hamburger.classList.remove('active');
          menu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) {
        hamburger.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================
     STICKY NAV SHADOW
     ========================================================== */
  function initStickyNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;

    function checkScroll() {
      var shouldBeScrolled = window.scrollY > 20;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        nav.classList.toggle('scrolled', scrolled);
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ==========================================================
     SCROLL ANIMATIONS (IntersectionObserver)
     ========================================================== */
  function initScrollAnimations() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

    if (!reveals.length) return;

    // Fallback for old browsers
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ==========================================================
     FAQ ACCORDION
     ========================================================== */
  function initFaqAccordions() {
    var questions = document.querySelectorAll('.faq__question');

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var answer = item.querySelector('.faq__answer');
        var isOpen = item.classList.contains('open');

        // Close all other items in the same FAQ
        var faqList = btn.closest('.faq__list');
        if (faqList) {
          faqList.querySelectorAll('.faq__item.open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('open');
              var openAnswer = openItem.querySelector('.faq__answer');
              if (openAnswer) openAnswer.style.maxHeight = null;
            }
          });
        }

        // Toggle current
        item.classList.toggle('open');
        if (!isOpen && answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else if (answer) {
          answer.style.maxHeight = null;
        }
      });
    });
  }

  /* ==========================================================
     SMOOTH SCROLL (for anchor links)
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ==========================================================
     PHONE CLICK CONVERSION TRACKING
     ========================================================== */
  function initPhoneConversion() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        // Google Ads conversion
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            send_to: 'AW-748853640/d7frCOLwq7caEIiziuUC'
          });
        }

        // Facebook
        if (typeof fbq === 'function') {
          fbq('track', 'Contact');
        }

        // Bing
        if (typeof window.uetq !== 'undefined') {
          window.uetq.push('event', 'phone_call', {});
        }
      });
    });
  }

  /* ==========================================================
     UTILITY: Load reCAPTCHA on form pages
     Call this function on pages that have Jobber forms
     ========================================================== */
  window.loadRecaptcha = function () {
    if (document.querySelector('script[src*="recaptcha"]')) return;
    var s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?render=6LfcmCcrAAAAADwBIdiHUT6IMhEteGBFYf9Pp8uY';
    s.async = true;
    document.head.appendChild(s);
  };

  /* ==========================================================
     UTILITY: Load DeepLawn widget
     Only on /instant-estimate/ page
     ========================================================== */
  window.loadDeepLawn = function () {
    var widget = document.createElement('script');
    widget.src = 'https://api.deeplawn.com/api/deeplawn-widget';
    widget.setAttribute('companyid', '66b10be658587f93b68d94b1');
    widget.async = true;
    document.body.appendChild(widget);
  };

  /* ==========================================================
     CTA FORM TRACKING
     Fire conversion events when Jobber form is submitted
     ========================================================== */
  window.addEventListener('message', function (event) {
    // Listen for Jobber form submission postMessage
    if (event.data && (event.data.type === 'jobber_form_submitted' ||
        (typeof event.data === 'string' && event.data.indexOf('jobber') > -1))) {
      // Google Ads
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: 'AW-748853640/d7frCOLwq7caEIiziuUC'
        });
      }
      // Facebook
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
      // Bing
      if (typeof window.uetq !== 'undefined') {
        window.uetq.push('event', 'form_submission', {});
      }
    }
  });

})();
