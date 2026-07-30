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
  var DONATE_URL = "https://buy.stripe.com/fZu00i9sz70idKQ4oMfUQ00";

  document.querySelectorAll("[data-donate-link]").forEach(function (el) {
    el.href = DONATE_URL;
  });

  /* ---------------- Waitlist form (Web3Forms) ----------------
     Free, no backend needed. Get an access key at https://web3forms.com
     (just enter an email, no account setup) and paste it below. */
  var WEB3FORMS_ACCESS_KEY = "f2b98cfc-85f4-405b-9b42-432e6f5d04f9";

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

/* ==========================================================================
   Resource Vault — 3D Coverflow carousel (Swiper)
   Loads cards from resources.json and spins them like a jukebox.
   ========================================================================== */
var resourceSwiperInstance = null;

async function loadResources() {
  const track = document.querySelector(".resource-stack-track");
  const host = document.querySelector(".resource-swiper");
  if (!track || !host) return;

  // Wait briefly if Swiper CDN is still loading
  if (typeof Swiper === "undefined") {
    await new Promise(function (resolve) {
      var tries = 0;
      var t = setInterval(function () {
        tries += 1;
        if (typeof Swiper !== "undefined" || tries > 40) {
          clearInterval(t);
          resolve();
        }
      }, 50);
    });
  }
  if (typeof Swiper === "undefined") {
    track.innerHTML =
      '<p style="text-align: center; width: 100%; padding: 2rem;">Carousel library failed to load. Please refresh.</p>';
    return;
  }

  try {
    const response = await fetch("resources.json");
    if (!response.ok) throw new Error("Failed to fetch resources.json");
    const resources = await response.json();
    track.innerHTML = "";

    resources.forEach(function (resource) {
      let facetsHtml = "";
      if (resource.facets && resource.facets.length > 0) {
        const listItems = resource.facets.map(function (item) {
          return "<li>" + item + "</li>";
        }).join("");
        facetsHtml = '<ul class="card-facets">' + listItems + "</ul>";
      }

      const card = document.createElement("a");
      card.href = resource.linkUrl || "#";
      card.className = "swiper-slide dynamic-card";
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      card.innerHTML =
        '<div class="card-image-wrapper">' +
          '<img src="' + (resource.imageUrl || "") + '" alt="' + (resource.name || "") + ' logo" class="card-logo" loading="lazy">' +
        "</div>" +
        '<div class="card-content">' +
          "<h3>" + (resource.name || "") + "</h3>" +
          "<p>" + (resource.blurb || "") + "</p>" +
          facetsHtml +
          '<span class="card-link">Explore Resource &rarr;</span>' +
        "</div>";

      track.appendChild(card);
    });

    // Tear down previous instance if re-running (e.g. from console)
    if (resourceSwiperInstance && resourceSwiperInstance.destroy) {
      resourceSwiperInstance.destroy(true, true);
      resourceSwiperInstance = null;
    }

    // Coverflow "jukebox" — rewind instead of loop so 3 slides work cleanly
    resourceSwiperInstance = new Swiper(".resource-swiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: false,
      rewind: true,
      coverflowEffect: {
        rotate: 12,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      keyboard: {
        enabled: true
      }
    });
  } catch (error) {
    console.error("Error loading resources:", error);
    track.innerHTML =
      '<p style="text-align: center; width: 100%; padding: 2rem;">Resources are currently updating. Please check back shortly.</p>';
  }
}

// Auto-start when vault markup is on the page.
// Uses DOMContentLoaded + window.load so it still runs if the script
// evaluated before the Swiper CDN finished, or after a late paint.
(function initResourceVault() {
  function go() {
    if (!document.querySelector(".resource-swiper")) return;
    if (document.querySelector(".resource-stack-track .swiper-slide")) return; // already built
    loadResources();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
  // Safety net: if first pass raced Swiper CDN, try once more after full load
  window.addEventListener("load", function () {
    if (!document.querySelector(".resource-stack-track .swiper-slide")) {
      go();
    }
  });
})();
