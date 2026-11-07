const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// Part links preselect the matching request type in the form.
const form = document.querySelector(".quote-form");
const typeSelect = form && form.querySelector("select[name='request-type']");

document.querySelectorAll("[data-request]").forEach((link) => {
  link.addEventListener("click", () => {
    if (typeSelect) typeSelect.value = link.dataset.request;
  });
});

// Form submission to the Google Apps Script endpoint.
if (form) {
  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector("button[type='submit']");

  const setStatus = (message, isError) => {
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    button.disabled = true;
    button.textContent = "Sending...";
    setStatus("");

    fetch(form.action, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(new FormData(form)),
    })
      .then(() => {
        setStatus("Request sent. We will reply by email, usually within 48 hours.");
        form.reset();
      })
      .catch(() => {
        setStatus("Could not send. Please email sourcing@luxlampinfo.com directly.", true);
      })
      .finally(() => {
        button.disabled = false;
        button.textContent = "Send request";
      });
  });
}
