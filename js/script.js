// MEMBER 3: all JavaScript interactivity

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");

  const applyTheme = (isDark) => {
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Enable light mode" : "Enable dark mode"
      );
    }
  };

  // Check saved theme preference or default to system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme === "dark");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark-mode");
      applyTheme(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  const navLinks = document.querySelectorAll('.main-nav a, .site-footer a[href^="#"], .hero .button[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetId = href.substring(1);
      // Map 'team' to either 'team' or 'our-team' depending on HTML ID
      const targetElement =
        document.getElementById(targetId) ||
        (targetId === "team" ? document.getElementById("our-team") : null);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Update URL hash without jumping
        history.pushState(null, "", href);
      }
    });
  });

  const sections = document.querySelectorAll("header, section[id]");
  const headerNavLinks = document.querySelectorAll(".main-nav a");

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        headerNavLinks.forEach((link) => {
          link.classList.remove("active");
          const linkHref = link.getAttribute("href");
          if (
            linkHref === `#${id}` ||
            (id === "our-team" && linkHref === "#team")
          ) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink();

  const heroHeading = document.querySelector(".hero h1");
  if (heroHeading) {
    const baseText = "We build things, with ";
    const words = ["passion.", "code.", "creativity.", "teamwork."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 120;
    const deleteSpeed = 60;
    const pauseTime = 1600;

    heroHeading.innerHTML = `${baseText}<span class="typing-text" style="color: var(--primary); font-weight: 700;"></span><span class="typing-cursor" style="display:inline-block; animation: blink 0.9s infinite; color: var(--primary);">|</span>`;
    
    // Add blink animation dynamically if not present
    if (!document.getElementById("typing-cursor-style")) {
      const style = document.createElement("style");
      style.id = "typing-cursor-style";
      style.textContent = `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const typingElement = heroHeading.querySelector(".typing-text");

    const typeEffect = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typingElement.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        typingElement.textContent = currentWord.substring(0, charIndex);
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 400;
      }

      setTimeout(typeEffect, timeout);
    };

    setTimeout(typeEffect, 600);
  }

  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const getOrCreateErrorSpan = (input) => {
      let errorSpan = input.parentElement.querySelector(".input-error-msg");
      if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "input-error-msg";
        errorSpan.style.color = "#dc2626";
        errorSpan.style.fontSize = "0.8rem";
        errorSpan.style.marginTop = "0.25rem";
        errorSpan.style.display = "none";
        input.parentElement.appendChild(errorSpan);
      }
      return errorSpan;
    };

    const showError = (input, message) => {
      input.style.borderColor = "#dc2626";
      const errorSpan = getOrCreateErrorSpan(input);
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    };

    const clearError = (input) => {
      input.style.borderColor = "";
      const errorSpan = input.parentElement.querySelector(".input-error-msg");
      if (errorSpan) {
        errorSpan.style.display = "none";
        errorSpan.textContent = "";
      }
    };

    // Clear errors on typing
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => clearError(input));
      }
    });

    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showError(nameInput, "Please enter your name (at least 2 characters).");
        hasError = true;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        showError(emailInput, "Email address is required.");
        hasError = true;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email address.");
        hasError = true;
      } else {
        clearError(emailInput);
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
        showError(messageInput, "Please enter a message (at least 5 characters).");
        hasError = true;
      } else {
        clearError(messageInput);
      }

      if (hasError) {
        if (formSuccess) formSuccess.hidden = true;
        return;
      }

      // On Successful submission
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.classList.add("success-message");
        formSuccess.textContent = "Thank you! Your message has been sent successfully.";
      }

      contactForm.reset();

      // Automatically hide success message after 5 seconds
      setTimeout(() => {
        if (formSuccess) {
          formSuccess.hidden = true;
        }
      }, 5000);
    });
  }
});
