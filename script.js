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

// Function to load and build the resource cards with 3D Coverflow
async function loadResources() {
  const track = document.querySelector('.carousel-track');
  
  if (!track) return; 

  try {
    const response = await fetch('resources.json');
    const resources = await response.json();
    track.innerHTML = '';

    resources.forEach(resource => {
      let facetsHtml = '';
      if (resource.facets && resource.facets.length > 0) {
        const listItems = resource.facets.map(item => `<li>${item}</li>`).join('');
        facetsHtml = `<ul class="card-facets">${listItems}</ul>`;
      }

      const card = document.createElement('a');
      card.href = resource.linkUrl;
      // CRITICAL: We added 'swiper-slide' here so the 3D engine recognizes it
      card.className = 'swiper-slide dynamic-card';
      card.target = '_blank'; 
      
      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${resource.imageUrl}" alt="${resource.name} logo" class="card-logo">
        </div>
        <div class="card-content">
          <h3>${resource.name}</h3>
          <p>${resource.blurb}</p>
          ${facetsHtml}
          <span class="card-link">Explore Resource &rarr;</span>
        </div>
      `;

      track.appendChild(card);
    });

    // NOW FIRE UP THE 3D OVERLAPPING ENGINE
    const swiper = new Swiper('.resource-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0, // Set to 0 so they stay flat horizontally
        stretch: -50, // Pulls them closer together to overlap
        depth: 250, // Pushes the side cards into the background
        modifier: 1,
        slideShadows: true, // Adds dynamic shadows to the cards behind
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true // Lets them spin endlessly
    });

  } catch (error) {
    console.error("Error loading resources:", error);
    track.innerHTML = `<p style="text-align: center;">Resources are currently updating. Please check back shortly.</p>`;
  }
}
