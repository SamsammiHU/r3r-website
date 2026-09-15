/* =========================================================
   R3R — site behavior
   ---------------------------------------------------------
   CONFIG: replace the placeholders below before going live.
   Everything here is editable without touching the HTML.
   ========================================================= */

const SITE_CONFIG = {
  /* 1) Formspree free endpoint — form submissions email the owner. */
  formspreeEndpoint: "https://formspree.io/f/xyeyqoll",

  /* 2) Contact details shown on the Contact page.
        email is intentionally left blank until the domain mailbox is ready.
        When empty, the Contact page shows a "Coming soon" placeholder and
        the mailto link is disabled (no broken/dead link). */
  email: "sammihu@r3r-mc.com",
  wechat: "164694493",

  /* 3) Plausible analytics (free, privacy-friendly, no cookie banner).
        Create a site at https://plausible.io and set your domain. */
  plausibleDomain: "r3r-mc.com",
};

(function () {
  "use strict";

  /* ---------- Language ---------- */
  const STORAGE_KEY = "r3r-lang";
  const html = document.documentElement;

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
    return "en"; // English is the primary language
  }

  function t(lang, key) {
    const dict = window.I18N && window.I18N[lang];
    if (dict && dict[key] != null) return dict[key];
    // fall back to English, then to the key itself
    if (window.I18N && window.I18N.en[key] != null) return window.I18N.en[key];
    return key;
  }

  function applyLang(lang) {
    html.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(lang, key);
    });

    document.querySelectorAll("[data-meta]").forEach(function (el) {
      const key = el.getAttribute("data-meta");
      el.setAttribute("content", t(lang, key));
    });

    const toggle = document.getElementById("langToggle");
    if (toggle) toggle.textContent = lang === "zh" ? "EN" : "中文";

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLang() {
    applyLang(getLang());
    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const next = getLang() === "zh" ? "en" : "zh";
        applyLang(next);
      });
    }
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const btn = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!btn || !links) return;
    btn.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---------- Contact details injection ---------- */
  function initContact() {
    const emailEl = document.getElementById("cfg-email");
    const emailLink = document.getElementById("cfg-email-link");
    const wechatEl = document.getElementById("cfg-wechat");
    if (emailEl) {
      emailEl.textContent = SITE_CONFIG.email || "Coming soon / 即将开通";
    }
    if (emailLink) {
      if (SITE_CONFIG.email) {
        emailLink.setAttribute("href", "mailto:" + SITE_CONFIG.email);
      } else {
        // No email configured yet — disable the link so it is not a dead mailto.
        emailLink.removeAttribute("href");
        emailLink.style.pointerEvents = "none";
        emailLink.style.color = "var(--color-muted)";
      }
    }
    if (wechatEl) wechatEl.textContent = SITE_CONFIG.wechat;
  }

  /* ---------- Contact form (Formspree) ---------- */
  function initForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const status = document.getElementById("formStatus");
    const successMsg = t(getLang(), "contact.f.success");
    const errorMsg = t(getLang(), "contact.f.error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const endpoint = SITE_CONFIG.formspreeEndpoint;
      if (!endpoint || endpoint.indexOf("REPLACE_WITH_YOUR_FORM_ID") !== -1) {
        if (status) {
          status.className = "form-status err";
          status.textContent =
            "Form endpoint not configured yet. Please set SITE_CONFIG.formspreeEndpoint in assets/js/main.js";
        }
        return;
      }

      const data = new FormData(form);
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              status.className = "form-status ok";
              status.textContent = successMsg;
            }
          } else {
            return res.json().then(function (err) {
              throw err;
            });
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status err";
            status.textContent = errorMsg;
          }
        });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initContact();
    initForm();
    initYear();
  });
})();
