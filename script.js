/* ==========================================================================
   neurodiversified.org — shared behavior
   Plain JS, no build step, no framework. Three small jobs:
   1. Dark/light theme toggle, remembered in localStorage
   2. Mobile nav open/close
   3. Lightweight "reveal on scroll" for elements marked [data-reveal]
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Donate link ----------------
     Set your real donation URL ONCE here (Stripe Payment Link, Zeffy, etc).
     Every button/link with data-donate-link on any page will pick it up
     automatically — you never have to hunt through the HTML files. */
  var DONATE_URL = "https://REPLACE-WITH-YOUR-DONATE-URL";

  document.querySelectorAll("[data-donate-link]").forEach(function (el) {
    el.href = DONATE_URL;
  });

  /* ---------------- Waitlist form (Web3Forms) ----------------
     Free, no backend needed. Get an access key at https://web3forms.com
     (just enter an email, no account setup) and paste it below. */
  var WEB3FORMS_ACCESS_KEY = "REPLACE-WITH-YOUR-WEB3FORMS-ACCESS-KEY";

  /* ---------------- Theme toggle ---------------- */
  var root = document.documentElement;
  var THEME_KEY = "neurodiversified-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.textContent = theme === "dark" ? "☀︎" : "☾";
    }
  }

  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".theme-toggle");
    if (!toggle) return;
    var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------------- Mobile nav ---------------- */
  document.addEventListener("click", function (e) {
    var navToggle = e.target.closest(".nav-toggle");
    if (navToggle) {
      var nav = document.getElementById("main-nav");
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      return;
    }
  });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Waitlist / newsletter form (Web3Forms) ---------------- */
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-newsletter-form]");
    if (!form) return;
    e.preventDefault();

    var note = form.querySelector("[data-form-status]");
    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn = form.querySelector('button[type="submit"]');
    if (!emailInput || !emailInput.value) return;

    if (submitBtn) submitBtn.disabled = true;
    if (note) note.textContent = "Sending…";

    var formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("email", emailInput.value);
    formData.append("subject", "New waitlist signup — neurodiversified");
    formData.append("from_name", "neurodiversified site");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          if (note) note.textContent = "Thanks — you're on the list. We'll be in touch as we launch.";
          form.reset();
        } else {
          if (note) note.textContent = "Something went wrong — please try again, or email hello@neurodiversified.org directly.";
        }
      })
      .catch(function () {
        if (note) note.textContent = "Something went wrong — please try again, or email hello@neurodiversified.org directly.";
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
