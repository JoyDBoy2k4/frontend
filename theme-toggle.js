// theme-toggle.js
(function () {
  const html = document.documentElement;
  const toggleButton = document.getElementById("themeToggle");

  // Apply saved theme as early as possible
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);

  window.addEventListener("DOMContentLoaded", () => {
    if (!toggleButton) return;

    toggleButton.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  });
})();

