/**
 * Sprout Lawn & Landscape — Chatbot Widget
 *
 * Self-contained vanilla JS. Injects floating button + chat panel into page.
 * Talks to /api/chat endpoint (Anthropic Claude API).
 * Conversation persists in sessionStorage (within tab session only).
 *
 * Loaded by main.js via window.loadChatbot().
 */

(function () {
  'use strict';

  // --- Config ---
  var API_ENDPOINT = '/api/chat';
  var STORAGE_KEY = 'sprout_chat_messages_v1';
  var GREETING = "Hey \uD83C\uDF31 Sprout's web assistant here. Want a 60-second lawn quote, or have a question about what we do? What's going on with your yard?";
  var MAX_INPUT_LEN = 500;

  // --- State ---
  var messages = [];
  var isOpen = false;
  var isLoading = false;
  var hasGreeted = false;

  // --- DOM refs (set on build) ---
  var button, panel, messagesEl, inputEl, formEl;

  function init() {
    // Don't double-load
    if (document.getElementById('sprout-chat-button')) return;

    loadStoredMessages();
    injectStyles();
    buildButton();
    buildPanel();
  }

  function loadStoredMessages() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) messages = parsed;
      }
    } catch (e) {
      messages = [];
    }
  }

  function persistMessages() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // Storage full or disabled — fail silently
    }
  }

  function buildButton() {
    button = document.createElement('button');
    button.id = 'sprout-chat-button';
    button.className = 'sprout-chat-button';
    button.setAttribute('aria-label', 'Open chat');
    button.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
      '</svg>' +
      '<span class="sprout-chat-button-label">Chat</span>';
    button.addEventListener('click', openChat);
    document.body.appendChild(button);
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.id = 'sprout-chat-panel';
    panel.className = 'sprout-chat-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Sprout assistant');

    panel.innerHTML =
      '<div class="sprout-chat-header">' +
        '<div class="sprout-chat-header-text">' +
          '<div class="sprout-chat-title">Sprout Assistant</div>' +
          '<div class="sprout-chat-subtitle">Ask anything about our services</div>' +
        '</div>' +
        '<button class="sprout-chat-close" aria-label="Close chat" type="button">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="18" y1="6" x2="6" y2="18"></line>' +
            '<line x1="6" y1="6" x2="18" y2="18"></line>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="sprout-chat-messages" id="sprout-chat-messages" role="log" aria-live="polite"></div>' +
      '<form class="sprout-chat-form" id="sprout-chat-form">' +
        '<input type="text" id="sprout-chat-input" placeholder="Type a question..." autocomplete="off" maxlength="' + MAX_INPUT_LEN + '" aria-label="Message" />' +
        '<button type="submit" class="sprout-chat-send" aria-label="Send message">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="22" y1="2" x2="11" y2="13"></line>' +
            '<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
          '</svg>' +
        '</button>' +
      '</form>' +
      '<div class="sprout-chat-footer">Powered by AI · Not a real person</div>';

    document.body.appendChild(panel);

    messagesEl = panel.querySelector('#sprout-chat-messages');
    inputEl = panel.querySelector('#sprout-chat-input');
    formEl = panel.querySelector('#sprout-chat-form');

    panel.querySelector('.sprout-chat-close').addEventListener('click', closeChat);
    formEl.addEventListener('submit', handleSubmit);

    // Defensive: when input is focused (mobile keyboard opens), scroll messages to bottom
    inputEl.addEventListener('focus', function () {
      setTimeout(scrollToBottom, 300);
    });
  }

  function openChat() {
    if (isOpen) return;
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    button.classList.add('hidden');

    // Render existing messages or greeting
    renderAllMessages();
    if (messages.length === 0 && !hasGreeted) {
      renderMessage('assistant', GREETING);
      renderQuickReplies();
      hasGreeted = true;
    }

    // Don't auto-focus input on mobile (keyboard pops up immediately and hides greeting)
    // Desktop only: focus input after panel transition
    if (window.innerWidth > 768) {
      setTimeout(function () {
        if (inputEl) inputEl.focus();
      }, 200);
    }

    // Track open event
    if (typeof gtag === 'function') {
      gtag('event', 'chat_opened', { event_category: 'engagement' });
    }
  }

  function renderQuickReplies() {
    var container = document.createElement('div');
    container.className = 'sprout-chat-quickreplies';
    container.id = 'sprout-chat-quickreplies';
    container.innerHTML =
      '<button type="button" class="sprout-chat-qr" data-action="quote">' +
        '<span class="sprout-chat-qr-icon">📐</span> Get a fast quote' +
      '</button>' +
      '<button type="button" class="sprout-chat-qr" data-action="services">' +
        '<span class="sprout-chat-qr-icon">🌱</span> Ask about services' +
      '</button>' +
      '<a href="tel:3179007151" class="sprout-chat-qr" data-action="call">' +
        '<span class="sprout-chat-qr-icon">📞</span> Call (317) 900-7151' +
      '</a>';
    messagesEl.appendChild(container);
    scrollToBottom();

    // Wire up button clicks
    container.querySelectorAll('button.sprout-chat-qr').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        removeQuickReplies();
        if (action === 'quote') {
          inputEl.value = "I'd like to get a quote";
          formEl.dispatchEvent(new Event('submit'));
        } else if (action === 'services') {
          inputEl.value = "Tell me about your services";
          formEl.dispatchEvent(new Event('submit'));
        }
      });
    });

    // Phone link: track click + remove buttons
    var phoneLink = container.querySelector('a[data-action="call"]');
    if (phoneLink) {
      phoneLink.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'chat_phone_click', { event_category: 'engagement' });
        }
      });
    }
  }

  function removeQuickReplies() {
    var qr = document.getElementById('sprout-chat-quickreplies');
    if (qr) qr.remove();
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    button.classList.remove('hidden');
  }

  function renderAllMessages() {
    messagesEl.innerHTML = '';
    if (messages.length > 0) {
      messages.forEach(function (m) {
        renderMessage(m.role, m.content);
      });
    }
  }

  function renderMessage(role, text) {
    var msg = document.createElement('div');
    msg.className = 'sprout-chat-msg sprout-chat-msg-' + role;
    msg.innerHTML = formatMessage(text);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function renderTypingIndicator() {
    var msg = document.createElement('div');
    msg.id = 'sprout-chat-typing';
    msg.className = 'sprout-chat-msg sprout-chat-msg-assistant sprout-chat-typing';
    msg.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    var typing = document.getElementById('sprout-chat-typing');
    if (typing) typing.remove();
  }

  function formatMessage(text) {
    // Escape HTML
    var div = document.createElement('div');
    div.textContent = text;
    var html = div.innerHTML;

    // Linkify phone numbers like (317) 900-7151
    html = html.replace(
      /\((\d{3})\)\s?(\d{3})-(\d{4})/g,
      '<a href="tel:$1$2$3">($1)&nbsp;$2-$3</a>'
    );

    // Linkify sproutlawns.com URLs
    html = html.replace(
      /(?:https?:\/\/)?(?:www\.)?sproutlawns\.com(\/[a-zA-Z0-9\-_/]*)/g,
      '<a href="$1">sproutlawns.com$1</a>'
    );

    // Linkify bare paths like /instant-estimate/ or /contact/
    html = html.replace(
      /(^|\s)(\/[a-z0-9\-_]+\/[a-z0-9\-_/]*)/gi,
      function (match, prefix, path) {
        return prefix + '<a href="' + path + '">' + path + '</a>';
      }
    );

    // Convert line breaks to <br>
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  function scrollToBottom() {
    if (!messagesEl) return;
    // Allow render to settle, then scroll
    setTimeout(function () {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    var text = inputEl.value.trim();
    if (!text) return;

    // Hide quick-reply buttons once user sends anything (typed or clicked)
    removeQuickReplies();

    // Add user message
    messages.push({ role: 'user', content: text });
    persistMessages();
    renderMessage('user', text);
    inputEl.value = '';
    inputEl.focus();

    // Track first user message
    if (typeof gtag === 'function' && messages.filter(function (m) { return m.role === 'user'; }).length === 1) {
      gtag('event', 'chat_first_message', { event_category: 'engagement' });
    }

    sendToAPI();
  }

  function sendToAPI() {
    isLoading = true;
    renderTypingIndicator();
    inputEl.disabled = true;

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        removeTypingIndicator();
        var reply;
        if (result.ok && result.data.message) {
          reply = result.data.message;
        } else if (result.data.error) {
          reply = result.data.error;
        } else {
          reply = "Sorry, something went wrong. Please try again or call us at (317) 900-7151.";
        }
        messages.push({ role: 'assistant', content: reply });
        persistMessages();
        renderMessage('assistant', reply);
      })
      .catch(function (err) {
        removeTypingIndicator();
        var fallback = "Sorry, I'm having trouble connecting. Please call us at (317) 900-7151.";
        messages.push({ role: 'assistant', content: fallback });
        persistMessages();
        renderMessage('assistant', fallback);
        console.error('Chatbot fetch error:', err);
      })
      .finally(function () {
        isLoading = false;
        inputEl.disabled = false;
        inputEl.focus();
      });
  }

  function injectStyles() {
    if (document.getElementById('sprout-chat-styles')) return;
    var style = document.createElement('style');
    style.id = 'sprout-chat-styles';
    style.textContent =
      '.sprout-chat-button {' +
        'position: fixed; bottom: 20px; right: 20px; z-index: 9998;' +
        'background: #2c4a2e; color: white; border: 3px solid #d4327f; cursor: pointer;' +
        'padding: 12px 18px; border-radius: 999px; font-family: "Outfit", -apple-system, sans-serif;' +
        'font-size: 14px; font-weight: 500;' +
        'box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 0 0 1px rgba(212, 50, 127, 0.15);' +
        'display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;' +
      '}' +
      '.sprout-chat-button:hover {' +
        'background: #1e3520; border-color: #e84a9a; transform: translateY(-2px);' +
        'box-shadow: 0 6px 18px rgba(0,0,0,0.25), 0 0 0 4px rgba(212, 50, 127, 0.2);' +
      '}' +
      '.sprout-chat-button:focus-visible { outline: 3px solid #d4327f; outline-offset: 4px; }' +
      '.sprout-chat-button.hidden { opacity: 0; pointer-events: none; transform: scale(0.8); }' +

      '.sprout-chat-panel {' +
        'position: fixed; bottom: 20px; right: 20px; z-index: 9999;' +
        'width: 380px; max-width: calc(100vw - 40px); height: 580px; max-height: calc(100vh - 40px);' +
        'background: white; border-radius: 16px; box-shadow: 0 16px 50px rgba(0,0,0,0.2);' +
        'display: flex; flex-direction: column; overflow: hidden;' +
        'opacity: 0; transform: translateY(20px) scale(0.96); pointer-events: none;' +
        'transition: opacity 0.2s ease, transform 0.2s ease;' +
        'font-family: "Outfit", -apple-system, sans-serif;' +
      '}' +
      '.sprout-chat-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }' +

      '.sprout-chat-header {' +
        'background: #2c4a2e; color: white; padding: 16px 20px;' +
        'display: flex; align-items: center; justify-content: space-between;' +
      '}' +
      '.sprout-chat-title { font-family: "Cormorant Garamond", Georgia, serif; font-size: 20px; font-weight: 600; line-height: 1.2; }' +
      '.sprout-chat-subtitle { font-size: 12px; opacity: 0.85; margin-top: 2px; }' +
      '.sprout-chat-close {' +
        'background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer;' +
        'width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;' +
        'transition: background 0.15s ease;' +
      '}' +
      '.sprout-chat-close:hover { background: rgba(255,255,255,0.25); }' +

      '.sprout-chat-messages {' +
        'flex: 1; overflow-y: auto; padding: 20px; background: #faf9f7;' +
        'display: flex; flex-direction: column; gap: 12px;' +
      '}' +
      '.sprout-chat-msg {' +
        'max-width: 85%; padding: 10px 14px; border-radius: 16px;' +
        'font-size: 14px; line-height: 1.5; word-wrap: break-word;' +
      '}' +
      '.sprout-chat-msg-assistant { background: white; color: #1a1a1a; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }' +
      '.sprout-chat-msg-user { background: #2c4a2e; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }' +
      '.sprout-chat-msg a { color: inherit; text-decoration: underline; font-weight: 500; }' +
      '.sprout-chat-msg-user a { color: white; }' +

      '.sprout-chat-typing { display: flex; gap: 4px; align-items: center; padding: 14px 16px; }' +
      '.sprout-chat-typing span {' +
        'width: 8px; height: 8px; background: #6b6b6b; border-radius: 50%;' +
        'animation: sprout-chat-bounce 1.4s infinite ease-in-out both;' +
      '}' +
      '.sprout-chat-typing span:nth-child(1) { animation-delay: -0.32s; }' +
      '.sprout-chat-typing span:nth-child(2) { animation-delay: -0.16s; }' +
      '@keyframes sprout-chat-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }' +

      '.sprout-chat-form {' +
        'display: flex; gap: 8px; padding: 12px; background: white; border-top: 1px solid #e0ddd8;' +
      '}' +
      '.sprout-chat-form input {' +
        'flex: 1; padding: 10px 14px; border: 1px solid #e0ddd8; border-radius: 999px;' +
        'font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.15s ease;' +
        'min-width: 0;' +
      '}' +
      '.sprout-chat-form input:focus { border-color: #2c4a2e; }' +
      '.sprout-chat-form input:disabled { opacity: 0.5; cursor: not-allowed; }' +
      '.sprout-chat-send {' +
        'background: #d4327f; color: white; border: none; cursor: pointer;' +
        'width: 40px; height: 40px; border-radius: 50%;' +
        'display: flex; align-items: center; justify-content: center;' +
        'flex-shrink: 0; transition: background 0.15s ease;' +
      '}' +
      '.sprout-chat-send:hover { background: #b82a6b; }' +
      '.sprout-chat-send:focus-visible { outline: 3px solid #2c4a2e; outline-offset: 2px; }' +

      '.sprout-chat-footer {' +
        'font-size: 11px; color: #9a9a9a; text-align: center; padding: 6px 12px 10px; background: white;' +
      '}' +

      /* Quick-reply buttons (shown under greeting) */
      '.sprout-chat-quickreplies {' +
        'display: flex; flex-direction: column; gap: 8px; padding: 4px 0; align-self: flex-start; max-width: 90%;' +
      '}' +
      '.sprout-chat-qr {' +
        'display: inline-flex; align-items: center; gap: 8px;' +
        'background: white; color: #2c4a2e; border: 1.5px solid #2c4a2e;' +
        'padding: 9px 14px; border-radius: 999px; cursor: pointer;' +
        'font-family: inherit; font-size: 13px; font-weight: 500;' +
        'text-decoration: none; transition: all 0.15s ease; text-align: left;' +
      '}' +
      '.sprout-chat-qr:hover { background: #2c4a2e; color: white; }' +
      '.sprout-chat-qr-icon { font-size: 15px; line-height: 1; }' +

      /* Mobile (≤768px) — matches site's mobile-bottom-bar breakpoint.
         Use 100dvh (dynamic viewport height) so panel resizes when keyboard opens.
         Chatbot button sits above the sticky bottom bar (~75px tall). */
      '@media (max-width: 768px) {' +
        '.sprout-chat-panel {' +
          'width: 100%; max-width: 100%; bottom: 0; right: 0; left: 0; top: 0;' +
          'height: 100dvh; max-height: 100dvh; border-radius: 0;' +
        '}' +
        '.sprout-chat-button { bottom: 88px; right: 16px; padding: 12px; border-radius: 50%; }' +
        '.sprout-chat-button-label { display: none; }' +
        '.sprout-chat-button svg { width: 22px; height: 22px; }' +
      '}';
    document.head.appendChild(style);
  }

  // --- Public API ---
  window.SproutChat = {
    open: openChat,
    close: closeChat,
    init: init
  };

  // Auto-init when DOM ready (or immediately if already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
