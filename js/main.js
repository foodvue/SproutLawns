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

  // --- Facebook Pixel (active ad account): 1366652494845892 ---
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1366652494845892');
  fbq('track', 'PageView');

  // --- Google Ads: AW-748853640 ---
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-748853640';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  // Expose globally so page scripts (quote form) can fire events
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'AW-748853640');
  gtag('config', 'G-NJG1G7FM07');

  // Google Ads phone conversion tracking
  gtag('config', 'AW-748853640/d7frCOLwq7caEIiziuUC', {
    phone_conversion_number: '(317) 900-7151'
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
    initPhoneClickTracking();
    initTextClickTracking();
    initQuoteForm();
    loadChatbot();
  });

  /* ==========================================================
     LOAD CHATBOT
     Injects /js/chatbot.js (self-contained widget + styles)
     Loads asynchronously so it doesn't block page render.
     ========================================================== */
  function loadChatbot() {
    if (document.getElementById('sprout-chatbot-script')) return;
    var s = document.createElement('script');
    s.id = 'sprout-chatbot-script';
    s.src = '/js/chatbot.js';
    s.async = true;
    document.body.appendChild(s);
  }

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
        // Google Ads phone conversions are counted by the call-tracking
        // forwarding number (phone_conversion_number config), not by clicks.

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
     TEXT (SMS) CLICK TRACKING
     ========================================================== */
  function initTextClickTracking() {
    document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'sms_click', {
            event_category: 'engagement',
            event_label: link.href.replace('sms:', '')
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Contact');
        }
        if (typeof window.uetq !== 'undefined') {
          window.uetq.push('event', 'sms_click', {});
        }
      });
    });
  }

  /* ==========================================================
     QUOTE FORM
     Shared by /instant-estimate/ and /contact/
     ========================================================== */
  function initQuoteForm() {
    var message = document.getElementById('message');
    var count = document.getElementById('char-count');
    if (!message || !count) return;
    message.addEventListener('input', function () {
      count.textContent = message.value.length + ' / 500';
    });
  }

  window.submitQuoteForm = function () {
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var street = document.getElementById('street').value.trim();
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var zip = document.getElementById('zip').value.trim();
    var checked = document.querySelectorAll('input[name="services"]:checked');
    var services = [];
    checked.forEach(function(cb) { services.push(cb.value); });
    var service = services.join(', ');
    var message = document.getElementById('message').value.trim();

    if (!firstName || !lastName || !email || !phone || !street || !city || !zip || services.length === 0) {
      alert('Please fill out all required fields and select at least one service.');
      return;
    }

    var btn = document.getElementById('quote-submit-btn');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    fetch('https://hooks.zapier.com/hooks/catch/27072165/unp91mr/', {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip: zip,
        service: service,
        message: 'SERVICES REQUESTED:\n- ' + services.join('\n- ') + '\n\nDETAILS:\n' + (message || 'No additional details provided.')
      })
    })
    .then(function() {
      document.getElementById('quote-form-wrapper').style.display = 'none';
      document.getElementById('quote-form-success').style.display = '';
      // The Google Ads "Submit lead form" conversion counts visits to /thank-you/
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: 'quote_request'
        });
      }
      if (typeof window.uetq !== 'undefined') {
        window.uetq.push('event', 'form_submission', {});
      }
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
      // Short delay so the tracking requests above go out before the page changes
      setTimeout(function () {
        window.location.href = '/thank-you/';
      }, 800);
    })
    .catch(function() {
      btn.textContent = 'Submit Request';
      btn.style.opacity = '1';
      btn.style.pointerEvents = '';
      alert('Something went wrong. Please try again or call us at (317) 900-7151.');
    });
  };

  /* ==========================================================
     GA4 PHONE CLICK TRACKING
     Fires GA4 key event on any tel: link click sitewide
     ========================================================== */
  function initPhoneClickTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'phone_call', {
            event_category: 'engagement',
            event_label: link.href.replace('tel:', '')
          });
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
