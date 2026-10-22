
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const themeToggle = document.querySelector("#themeToggle");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");
const sendButton = document.querySelector("#sendButton");
const productButton = document.querySelector("#productButton");

// Pega aquí la URL COMPLETA de tu webhook nuevo de Discord.
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1562179682261139546/f-94iMvTjqd6GqA_AwFcqn4rrE0fYW8HIuxzhmQjPIhMoW_gtnhOr0yD1BxH5wLcy5_i";

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  });
});

const applyTheme = dark => {
  document.body.classList.toggle("dark-theme", dark);
  if (themeToggle) {
    themeToggle.innerHTML = dark
      ? "☀ <span>Modo claro</span>"
      : "☾ <span>Modo oscuro</span>";
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Activar modo claro" : "Activar modo oscuro"
    );
  }
};

let darkMode = false;

try {
  darkMode = localStorage.getItem("atelier-theme") === "dark";
} catch {}

applyTheme(darkMode);

themeToggle?.addEventListener("click", () => {
  darkMode = !document.body.classList.contains("dark-theme");
  applyTheme(darkMode);

  try {
    localStorage.setItem("atelier-theme", darkMode ? "dark" : "light");
  } catch {}
});

const revealItems = document.querySelectorAll(
  ".section, .fashion-card, .tech-grid a, .featured-art"
);

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealItems.forEach(item => item.classList.add("reveal"));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
}

productButton?.addEventListener("click", () => {
  document.querySelector("#contacto")?.scrollIntoView({
    behavior: "smooth"
  });

  const message = document.querySelector("#mensaje");

  if (message) {
    message.value = "Hola, me interesa conocer más sobre Élan Signature.";
    message.focus({ preventScroll: true });
  }
});

contactForm?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!contactStatus || !sendButton) return;

  const formData = new FormData(contactForm);
  const nombre = String(formData.get("nombre") || "").trim();
  const correo = String(formData.get("correo") || "").trim();
  const mensaje = String(formData.get("mensaje") || "").trim();

  if (!nombre || !correo || !mensaje) {
    contactStatus.textContent = "Completa todos los campos.";
    return;
  }

  if (
    !DISCORD_WEBHOOK_URL.startsWith("https://discord.com/api/webhooks/") ||
    DISCORD_WEBHOOK_URL.includes("PEGA_AQUI")
  ) {
    contactStatus.textContent =
      "Pega la URL completa del webhook en js/script.js.";
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Enviando...";
  contactStatus.textContent = "";

  const discordForm = new FormData();

  discordForm.append("payload_json", JSON.stringify({
    embeds: [{
      title: "Nuevo mensaje de Atelier Élan",
      color: 0xB49A7A,
      fields: [
        { name: "Nombre", value: nombre.slice(0, 80), inline: true },
        { name: "Correo", value: correo.slice(0, 150), inline: true },
        { name: "Mensaje", value: mensaje.slice(0, 1500) }
      ],
      footer: { text: "Formulario de contacto · Atelier Élan" },
      timestamp: new Date().toISOString()
    }],
    allowed_mentions: { parse: [] }
  }));

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: discordForm
    });

    contactStatus.textContent =
      "Solicitud enviada. Comprueba el canal de Discord.";
    contactForm.reset();
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    contactStatus.textContent =
      "No se pudo enviar. Revisa tu conexión y la URL del webhook.";
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML =
      'Enviar mensaje <span aria-hidden="true">→</span>';
  }
});
