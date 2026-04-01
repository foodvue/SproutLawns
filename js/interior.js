/* =============================================
   INTERIOR PAGE JS
   /js/interior.js — loaded on all non-homepage pages
   Works alongside /js/main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- FAQ Accordion ----------
    document.querySelectorAll('.faq-item__question').forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const answer = button.nextElementSibling;

            // Close all other FAQ items
            document.querySelectorAll('.faq-item__question').forEach(otherBtn => {
                if (otherBtn !== button) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherBtn.nextElementSibling;
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.removeAttribute('data-open');
                }
            });

            // Toggle clicked item
            if (isExpanded) {
                button.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                answer.removeAttribute('data-open');
            } else {
                button.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.setAttribute('data-open', '');
            }
        });
    });

    // ---------- Scroll Animations for [data-animate] ----------
    // Only runs if main.js doesn't already handle this
    if (!window.__sproutAnimateInit) {
        const animateEls = document.querySelectorAll('[data-animate]');
        if (animateEls.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            animateEls.forEach(el => observer.observe(el));
        }
        window.__sproutAnimateInit = true;
    }

});
