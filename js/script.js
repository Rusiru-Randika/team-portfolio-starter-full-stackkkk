// MEMBER 3: all JavaScript interactivity
const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  themeToggle.setAttribute("aria-pressed", String(isDarkMode));
  themeToggle.setAttribute(
    "aria-label",
    isDarkMode ? "Enable light mode" : "Enable dark mode"
  );
});
