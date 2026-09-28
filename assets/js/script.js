
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
           PROJECT PARALLAX
        ----------------------------------------------------- */

        gsap.utils
          .toArray(".project-shape")
          .forEach((shape, index) => {

            gsap.to(shape, {
              y: index % 2 === 0 ? -35 : 35,
              ease: "none",
              scrollTrigger: {
                trigger: shape.closest(".project"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
              }
            });

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
