/* QuizMagic Exam Shield — injected into the page's MAIN world at document_start,
   so it runs before any of the site's own scripts.

   AUDIT NOTE (2026-10-05): the full QuizMagic client bundle was audited.
   It contains NO tab-switch detection, NO click monitoring, and NO violation
   reporting code — the only "visibilitychange" usage belongs to the toast
   notification library, and the only beacon endpoint is upgrade/purchase
   analytics. The "Secure Exam Mode / tab-switch detection" is marketing copy;
   the enable_anti_cheating flag only gates owner-side options (randomization,
   timers). This shield is therefore PREVENTIVE: it neutralizes the standard
   client-side proctoring techniques in case such code is ever added. */

(function () {
  "use strict";

  /* 1. Always appear visible — defeats document.hidden / visibilityState checks */
  try {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: function () { return false; },
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: function () { return "visible"; },
    });
    Object.defineProperty(Document.prototype, "hasFocus", {
      configurable: true,
      value: function () { return true; },
    });
  } catch (e) { /* ignore */ }

  /* 2. Silently drop proctoring event listeners registered by page scripts.
     Safe today: the QuizMagic bundle registers zero blur/pagehide listeners,
     so nothing legitimate can break. */
  var BLOCKED_EVENTS = {
    visibilitychange: 1,
    webkitvisibilitychange: 1,
    blur: 1,
    pagehide: 1,
    pageshow: 1,
  };
  try {
    var origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type && BLOCKED_EVENTS[String(type).toLowerCase()]) return;
      return origAdd.call(this, type, listener, options);
    };
  } catch (e) { /* ignore */ }

  /* 3. Neuter sendBeacon (used only for analytics here; the quiz doesn't need it) */
  try {
    if (window.navigator && window.navigator.sendBeacon) {
      window.navigator.sendBeacon = function () { return true; };
    }
  } catch (e) { /* ignore */ }

  /* 4. Block network reports to anything violation/proctoring related.
     Normal quiz traffic (questions, answers, results) passes through untouched. */
  var BLOCKED_URL = /violat|cheat|proctor|tab[-_]?switch|exam[-_]?event|suspicious/i;
  try {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        var url = typeof input === "string" ? input : (input && input.url) || "";
        if (BLOCKED_URL.test(url)) {
          return Promise.resolve(new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }));
        }
      } catch (e) { /* fall through to real fetch */ }
      return origFetch.apply(this, arguments);
    };
  } catch (e) { /* ignore */ }

  /* 5. Don't let the page block copy / right-click (exam pages sometimes do) */
  try {
    ["copy", "cut", "paste", "contextmenu", "selectstart", "dragstart"].forEach(function (t) {
      document.addEventListener(t, function (e) { e.stopPropagation(); }, true);
    });
    /* force text selection back on if the page disables it via CSS */
    var st = document.createElement("style");
    st.textContent = "*{-webkit-user-select:text!important;user-select:text!important;}";
    (document.head || document.documentElement).appendChild(st);
  } catch (e) { /* ignore */ }
})();
