document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     YEAR
  ------------------------------------------------------- */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* -------------------------------------------------------
     NAV SCROLL STATE
  ------------------------------------------------------- */

  const nav = document.getElementById("nav");

  const updateNav = () => {
    if (!nav) return;

    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  updateNav();

  window.addEventListener(
    "scroll",
    updateNav,
    { passive: true }
  );


  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {

    const mobileLinks =
      mobileMenu.querySelectorAll("a");

    const closeMenu = () => {

      mobileMenu.classList.remove("active");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.classList.remove("menu-open");

      menuToggle.innerHTML = "<span>☰</span>";
    };

    menuToggle.addEventListener("click", () => {

      const isOpen =
        mobileMenu.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

      menuToggle.innerHTML =
        isOpen
          ? "<span>×</span>"
          : "<span>☰</span>";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

  }


  /* -------------------------------------------------------
     PORTFOLIO GRID & FILTERING
  ------------------------------------------------------- */

  const projects = [
    // website projects
    ["Ellegra Diamond", "Shopify", "shopify", "assets/img/website/ellegra.png", ""],
    ["Secret Lingeries", "Shopify", "shopify", "assets/img/website/secret.png", ""],
    ["Flawless Diary", "WordPress", "wordpress", "assets/img/website/flawless.png", ""],
    ["TurkGlow", "Shopify", "shopify", "assets/img/website/turk-glow.png", ""],
    ["Nivera Jewelry", "Shopify", "shopify", "assets/img/website/nivera.png", ""],
    ["Scotsman Travel", "Custom HTML/CSS/JS", "custom", "assets/img/website/scot.png", ""],
    ["AION Smart Life", "WordPress", "wordpress", "assets/img/website/aion.png", ""],
    ["Kaldi Legacy", "WordPress", "wordpress", "assets/img/website/kaldi.png", ""],
    ["Ashraf Sourcing", "WordPress", "wordpress", "assets/img/website/ashraf.png", ""],
    ["Crown Global Trading", "WordPress", "wordpress", "assets/img/website/crown.png", ""],
    ["Progress Mountain", "WordPress", "wordpress", "assets/img/website/progresss.png", ""],
    ["Khair Ul Wara", "WordPress", "wordpress", "assets/img/website/khair.png", ""],
    ["AGY Clothing", "Shopify", "shopify", "assets/img/website/agy.png", ""],
    ["Seji Art", "Shopify", "shopify", "assets/img/website/seji.png", ""],
    ["Aftab Impex", "Shopify App / E-commerce", "shopify", "assets/img/website/aftab.png", ""],
    ["SURI Jewelry", "Shopify", "shopify", "assets/img/website/suri.png", ""],
    ["Fatima Mumtaz", "WordPress", "wordpress", "assets/img/website/fatima.png", ""],
    ["FDM Commodities", "WordPress", "wordpress", "assets/img/website/fdm.png", ""],
    ["Magic Luxury Services", "WordPress", "custom", "assets/img/website/mlss.png", ""],
    ["Magic Luxury Service", "WordPress", "wordpress", "assets/img/website/mls.png", ""],
    ["Kenneyz Media City", "WordPress", "wordpress", "assets/img/website/media-city.png", ""],
    ["Kenneyz Productions", "WordPress", "wordpress", "assets/img/website/product.png", ""],
    ["Kenneyz Music", "WordPress", "wordpress", "assets/img/website/misic.png", ""],
    ["Amanda Marino Speaks", "WordPress", "wordpress", "assets/img/website/amanda.png", ""],
    ["Brokenhorn Leather", "Shopify", "shopify", "assets/img/website/broken.png", ""],
    ["Renna Fashion", "Shopify", "shopify", "assets/img/website/renna.jpg", ""],
    ["Elegance Step", "Shopify", "shopify", "assets/img/website/elegance.png", ""],
    ["Parish Footwear", "WordPress", "wordpress", "assets/img/website/pfw.jpg", ""],
    ["CosmosBro", "WordPress", "wordpress", "assets/img/website/cosmos.png", ""],
    ["Muddy Figs", "WordPress", "wordpress", "assets/img/website/muddy.jpg", ""],
    ["ILSPAK", "WordPress", "wordpress", "assets/img/website/ils.jpg", ""],
    ["Magic Remote UK", "Shopify", "shopify", "assets/img/website/mr.jpg", ""],
    ["Alfredo Martini", "WordPress", "wordpress", "assets/img/website/alfredo.png", ""],
    ["Mirza Ads Expert", "WordPress", "wordpress", "assets/img/website/mr.jpg", ""],
    ["Caliber Wardrobe", "Shopify", "shopify", "assets/img/website/cw.jpg", ""],
    ["Beauty Vente", "Shopify + WordPress", "shopify", "assets/img/website/bv.jpg", ""],
    ["HNA Apparel", "Shopify", "shopify", "assets/img/website/hna.jpg", ""],
    ["Medical HRF", "WordPress", "wordpress", "assets/img/website/mhrf.png", ""],
    ["Duraton Safety", "Custom HTML/CSS/JS", "custom", "assets/img/website/duraton.png", ""],
    ["Babur Rayyan", "WordPress", "wordpress", "assets/img/website/babu.png", ""],
    ["Peridit Paper Products", "Custom HTML/CSS/JS", "custom", "assets/img/website/paper.png", ""],
     ["Cluff Stitch", "Custom HTML/CSS/JS", "custom", "assets/img/website/cluff.png", ""],
      ["Step Stone", "Shopify", "shopify", "assets/img/website/step.png", ""],
       ["Bin Sultan", "Shopify", "shopify", "assets/img/website/sultan.png", ""],

  ];

  const grid = document.querySelector("#portfolioGrid");
  const filters = document.querySelectorAll(".filters button");
  const loadMore = document.querySelector("#loadMore");

  if (grid && filters.length > 0 && loadMore) {
    let activeFilter = "all";
    let showAll = false;

    function label(type) {
      return type === "shopify" ? "Shopify"
        : type === "wordpress" ? "WordPress"
        : type === "custom" ? "Custom Web"
        : type === "Meta" ? "Meta"
        : type === "Email" ? "Email Marketing"
        : type === "Ebay" ? "Ebay"
        : type === "ad-m" ? "Add Marketing"
        : type;
    }

    function renderProjects() {
      const filtered = projects.filter(p => activeFilter === "all" || p[2] === activeFilter);
      const visible = showAll ? filtered : filtered.slice(0, 8);
      
      grid.innerHTML = visible.map((p, i) => `
        <a class="portfolio-item" href="${p[4] || '#'}" ${p[4] && p[4] !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} data-category="${p[2]}" style="transition-delay:${Math.min(i * 35, 280)}ms">
          <div class="project-media">
            <img src="${p[3]}" alt="${p[0]} website project" loading="lazy" onerror="this.parentElement.classList.add('no-image');this.remove()">
            <span class="project-type">${label(p[2])}</span>
          </div>
          <div class="project-body">
            <div>
              <h3>${p[0]}</h3>
              <p>${p[1]}</p>
            </div>
            <span class="project-link"><i class="fa-solid fa-arrow-up-right"></i></span>
          </div>
        </a>`).join("");

      loadMore.style.display = filtered.length > 8 && !showAll ? "inline-flex" : "none";

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }

    filters.forEach(btn => {
      btn.addEventListener("click", () => {
        filters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        showAll = false;
        renderProjects();
      });
    });

    loadMore.addEventListener("click", () => {
      showAll = true;
      renderProjects();
    });

    renderProjects();
  }


  /* -------------------------------------------------------
     GSAP
  ------------------------------------------------------- */

  const initAnimations = () => {

    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      /* Graceful fallback if CDN fails */

      document
        .querySelectorAll(".reveal, .reveal-fast")
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });

      document
        .querySelectorAll(".hero-title .word")
        .forEach((word) => {
          word.style.transform = "none";
        });

      return;
    }

    gsap.registerPlugin(ScrollTrigger);


    /* -----------------------------------------------------
       HERO TEXT
    ----------------------------------------------------- */

    const heroWords =
      document.querySelectorAll(
        ".hero-title .word"
      );

    const heroTimeline = gsap.timeline({
      defaults: {
        ease: "power4.out"
      }
    });

    heroTimeline
      .to(".hero-kicker", {
        opacity: 1,
        y: 0,
        duration: 0.7
      })
      .to(
        heroWords,
        {
          y: "0%",
          duration: 1.05,
          stagger: 0.12
        },
        "-=0.35"
      )
      .to(
        ".hero-description",
        {
          opacity: 1,
          y: 0,
          duration: 0.7
        },
        "-=0.5"
      )
      .to(
        ".hero-actions",
        {
          opacity: 1,
          y: 0,
          duration: 0.7
        },
        "-=0.45"
      )
      .to(
        ".hero-art",
        {
          opacity: 1,
          y: 0,
          duration: 1
        },
        "-=0.7"
      );


    /* -----------------------------------------------------
       GENERAL REVEALS
    ----------------------------------------------------- */

    gsap.utils
      .toArray(".reveal")
      .forEach((element) => {

        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 35
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );

      });


    /* -----------------------------------------------------
       ORGANIC HERO MOVEMENT
    ----------------------------------------------------- */

    gsap.to(".art-orange", {
      rotation: "+=8",
      y: -15,
      duration: 5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    gsap.to(".art-center", {
      y: -8,
      rotation: -8,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    gsap.to(".art-circle", {
      rotation: 360,
      duration: 35,
      ease: "none",
      repeat: -1
    });


    /* -----------------------------------------------------
       PARALLAX
    ----------------------------------------------------- */

    gsap.to(".hero-art", {
      y: 80,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });


    /* -----------------------------------------------------
       ABOUT VISUAL
    ----------------------------------------------------- */

    gsap.to(".about-dot", {
      y: -18,
      x: 8,
      rotation: 8,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    gsap.to(".about-card", {
      rotation: -4,
      duration: 5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });


    /* -----------------------------------------------------
       REFRESH SCROLLTRIGGER
    ----------------------------------------------------- */

    window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

  };


  /* -------------------------------------------------------
     START ANIMATIONS
  ------------------------------------------------------- */

  initAnimations();


  /* -------------------------------------------------------
     SMOOTH ANCHOR OFFSET
  ------------------------------------------------------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const id =
          link.getAttribute("href");

        if (!id || id === "#") return;

        const target =
          document.querySelector(id);

        if (!target) return;

        event.preventDefault();

        const offset = 90;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        /* Keep the URL hash in sync so sections are linkable */
        if (window.history && history.pushState) {
          history.pushState(null, "", id);
        }

      });

    });


  /* -------------------------------------------------------
     CONTACT FORM (FormSubmit)
  ------------------------------------------------------- */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {

    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("formSubmit");
    const labelEl = submitBtn.querySelector(".form-submit-label");
    const endpoint =
      contactForm.action.replace(
        "formsubmit.co/",
        "formsubmit.co/ajax/"
      );

    const setStatus = (type, text) => {
      statusEl.className = "form-status " + type;
      statusEl.textContent = text;
    };

    contactForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      let valid = true;

      contactForm
        .querySelectorAll("[required]")
        .forEach((input) => {

          const ok =
            input.value.trim() !== "" &&
            (input.type !== "email" ||
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));

          input.closest(".field").classList.toggle("invalid", !ok);

          if (!ok) valid = false;

        });

      if (!valid) {
        setStatus("error", "Please fill in your name, a valid email and a short message.");
        return;
      }

      submitBtn.disabled = true;
      labelEl.textContent = "Sending…";
      statusEl.className = "form-status";
      statusEl.textContent = "";

      try {

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm)
        });

        const result = await response.json();

        if (!response.ok || result.success === "false") {
          throw new Error("Request failed");
        }

        contactForm.reset();
        setStatus("success", "Thanks! Your message is on its way — I'll get back to you soon.");
        labelEl.textContent = "Message sent";

      } catch (error) {

        // Fallback: normal form submission
        contactForm.submit();
        return;

      }

      setTimeout(() => {
        submitBtn.disabled = false;
        labelEl.textContent = "Send message";
      }, 3500);

    });

    contactForm
      .querySelectorAll("input, textarea")
      .forEach((input) => {
        input.addEventListener("input", () => {
          const field = input.closest(".field");
          if (field) field.classList.remove("invalid");
        });
      });

  }

  /* -------------------------------------------------------
     MAGNETIC BUTTON EFFECT
  ------------------------------------------------------- */

  const magneticElements =
    document.querySelectorAll(
      ".button-primary, .button-secondary, .contact-button, .nav-contact, .form-submit"
    );

  magneticElements.forEach((element) => {

    element.addEventListener("mousemove", (event) => {

      if (typeof gsap === "undefined") return;

      if (window.innerWidth < 760) return;

      const rect =
        element.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      gsap.to(element, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.3,
        ease: "power2.out"
      });

    });

    element.addEventListener("mouseleave", () => {

      if (typeof gsap === "undefined") return;

      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      });

    });

  });


  /* -------------------------------------------------------
     ESCAPE KEY
  ------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      mobileMenu &&
      mobileMenu.classList.contains("active")
    ) {

      mobileMenu.classList.remove("active");

      if (menuToggle) {
        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.innerHTML =
          "<span>☰</span>";
      }

      document.body.classList.remove(
        "menu-open"
      );
    }

  });

});
