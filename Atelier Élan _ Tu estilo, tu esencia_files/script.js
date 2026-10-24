
document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("themeToggle");

  if (!boton) {
    console.error("No se encontró el botón themeToggle");
    return;
  }

  const temaGuardado = localStorage.getItem("atelier-theme");

  if (temaGuardado === "dark") {
    document.body.classList.add("dark-mode");
  }

  function actualizarTexto() {
    boton.textContent = document.body.classList.contains("dark-mode")
      ? "☀️ Modo claro"
      : "🌙 Modo oscuro";
  }

  actualizarTexto();

  boton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const modoOscuro = document.body.classList.contains("dark-mode");

    localStorage.setItem("atelier-theme", modoOscuro ? "dark" : "light");

    actualizarTexto();
  });
});
