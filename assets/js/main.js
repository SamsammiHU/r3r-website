/* =========================================================
   R3R — JSON-driven renderer
   Markup holds structure; every string and image path lives
   in /assets/data/site.json.
   ========================================================= */

(function () {
  "use strict";

  var get = function (obj, path) {
    if (!path) return obj;
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? acc : acc[key];
    }, obj);
  };

  function bind(root, ctx) {
    root.querySelectorAll("[data-bind]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-bind"));
      if (v != null) el.textContent = v;
    });

    root.querySelectorAll("[data-img]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-img"));
      if (v != null) el.setAttribute("src", v);
    });

    root.querySelectorAll("[data-alt]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-alt"));
      if (v != null) el.setAttribute("alt", v);
    });

    root.querySelectorAll("[data-href]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-href"));
      if (v != null) el.setAttribute("href", v);
    });

    root.querySelectorAll("[data-mailto]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-mailto"));
      if (v) el.setAttribute("href", "mailto:" + v);
    });

    root.querySelectorAll("[data-use]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-use"));
      if (v) el.setAttribute("href", v);
    });

    root.querySelectorAll("[data-value]").forEach(function (el) {
      var v = get(ctx, el.getAttribute("data-value"));
      if (v != null) el.setAttribute("value", v);
    });
  }

  function expandCollections(root, data) {
    root.querySelectorAll("[data-each]").forEach(function (host) {
      var items = get(data, host.getAttribute("data-each"));
      var tpl = host.querySelector("template");
      if (!items || !tpl) return;

      var frag = document.createDocumentFragment();
      items.forEach(function (item) {
        var node = tpl.content.cloneNode(true);
        bind(node, item);
        frag.appendChild(node);
      });

      tpl.remove();
      host.appendChild(frag);
    });
  }

  function initNav() {
    var btn = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!btn || !links) return;

    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Open menu");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  function initLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox-src]");
    if (!triggers.length) return;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Enlarged view");
    box.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close enlarged view">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" />' +
      "</svg></button>" +
      '<img alt="" />';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var closeBtn = box.querySelector(".lightbox-close");
    var lastFocus = null;

    function open(src, alt) {
      lastFocus = document.activeElement;
      img.setAttribute("src", src);
      img.setAttribute("alt", alt || "");
      box.classList.add("open");
      document.body.classList.add("lb-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      box.classList.remove("open");
      document.body.classList.remove("lb-open");
      img.setAttribute("src", "");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(function (el) {
      el.addEventListener("click", function () {
        var thumb = el.querySelector("img");
        open(
          el.getAttribute("data-lightbox-src"),
          thumb ? thumb.getAttribute("alt") : ""
        );
      });
    });

    closeBtn.addEventListener("click", close);

    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }

  function markActive() {
    var here = location.pathname.replace(/\/+$/, "");
    if (here === "") here = "/index.html";

    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === here) a.classList.add("active");
    });
  }

  function initForm(data) {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var endpoint = data.site.formspreeEndpoint;
    var copy = (data.contact && data.contact.form) || {};
    var status = document.getElementById("formStatus");
    var dept = document.getElementById("f-department");
    var category = document.getElementById("f-category");
    var routes = {};

    (data.contact.categories || []).forEach(function (c) {
      routes[c.value] = c.email;
    });

    if (endpoint) form.setAttribute("action", endpoint);

    if (category) {
      category.addEventListener("change", function () {
        if (dept) dept.value = routes[category.value] || data.site.formRecipient;
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (dept) {
        dept.value =
          (category && routes[category.value]) || data.site.formRecipient;
      }

      var submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.style.opacity = "0.6";
      }

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          if (dept) dept.value = "";
          if (status) {
            status.className = "form-status ok";
            status.textContent = copy.success || "Thank you. Your enquiry has been sent.";
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status err";
            status.textContent =
              copy.error ||
              "Something went wrong. Please email " + data.site.formRecipient + " directly.";
          }
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.style.opacity = "";
          }
        });
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function init(data) {
    expandCollections(document, data);
    bind(document, data);
    initNav();
    markActive();
    initForm(data);
    initYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLightbox();

    fetch("/assets/data/site.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(init)
      .catch(function (err) {
        console.error("R3R content failed to load:", err);
        var notice = document.createElement("div");
        notice.className = "container";
        notice.style.padding = "14px 24px";
        notice.style.background = "#fdf1f1";
        notice.style.color = "#8a2b2b";
        notice.style.fontSize = "14px";
        notice.textContent =
          "Content could not be loaded. Please email business@r3r-mc.com.";
        document.body.insertBefore(notice, document.body.firstChild);
      });
  });
})();
