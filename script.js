// Website interactions: responsive navigation and contact form.
(() => {
  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuToggle.textContent = open ? "×" : "☰";
    });
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const status = document.getElementById("formStatus");
      const button = document.getElementById("contactSubmit");
      if (!status) return;
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      status.textContent = "Sending your message…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });
        const result = await response.json();
        if (!response.ok || result.success === false) {
          throw new Error(result.message || "The email service could not accept the message.");
        }
        status.textContent = "Thank you. Your message has been submitted successfully.";
        form.reset();
      } catch (error) {
        status.textContent = "We couldn't send your message right now. Please email info@hiscorp-gov.com directly or contact us on WhatsApp.";
      } finally {
        if (button) { button.disabled = false; button.textContent = "Send Message →"; }
      }
    });
  }
})();

  // Stagger the homepage service cards into view, and provide a tactile
  // highlight for touchscreens without leaving a sticky hover state.
  const serviceCards = Array.from(document.querySelectorAll(".cards-grid .service-card, .partner-card"));
  if (serviceCards.length) {
    serviceCards.forEach((card, index) => {
      card.classList.add("reveal-service");
      card.style.setProperty("--service-delay", `${index * 115}ms`);
      // Make the existing card keyboard reachable without changing its links/content.
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });
      serviceCards.forEach(card => observer.observe(card));
    } else {
      serviceCards.forEach(card => card.classList.add("is-visible"));
    }

    const touchTimers = new WeakMap();
    serviceCards.forEach(card => {
      card.addEventListener("pointerdown", event => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          card.classList.add("is-touched");
          const oldTimer = touchTimers.get(card);
          if (oldTimer) clearTimeout(oldTimer);
        }
      }, { passive: true });

      const clearTouch = () => {
        const timer = setTimeout(() => card.classList.remove("is-touched"), 650);
        touchTimers.set(card, timer);
      };
      card.addEventListener("pointerup", clearTouch, { passive: true });
      card.addEventListener("pointercancel", clearTouch, { passive: true });
      card.addEventListener("pointerleave", event => {
        if (event.pointerType === "touch" || event.pointerType === "pen") clearTouch();
      }, { passive: true });
      card.addEventListener("click", event => {
        // A tap briefly highlights the card while keeping existing links functional.
        if (event.detail === 0) return;
        card.classList.add("is-touched");
        const oldTimer = touchTimers.get(card);
        if (oldTimer) clearTimeout(oldTimer);
        touchTimers.set(card, setTimeout(() => card.classList.remove("is-touched"), 650));
      });
    });
  }
