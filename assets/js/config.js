function isDesktop() {
    return window.innerWidth >= 992;
}

function handleNavScroll() {
    const nav = document.querySelector(".c-nav");
    if (!nav) return;

    if (window.scrollY > 1) {
        nav.classList.add("is-scrolled");
    } else {
        nav.classList.remove("is-scrolled");
    }
}

window.addEventListener("load", function () {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const nav = document.querySelector(".c-nav");
    const toggle = nav?.querySelector(".c-nav__toggle");
    const overlay = nav?.querySelector(".c-nav__overlay");
    const links = nav?.querySelectorAll(".c-nav__link") || [];
    const bars = nav?.querySelectorAll(".c-nav__toggle-line") || [];
    const overlayBrand = nav.querySelector(".c-nav__overlay-brand img");

    // =========================
    // NAV
    // =========================
    if (nav && toggle && overlay && bars.length === 3) {
        gsap.set(links, {
            y: 100,
            opacity: 0
        });

        gsap.set(overlayBrand, {
            y: 100,
            opacity: 0
        });

        let tl = gsap.timeline({
            paused: true
        });

        tl.to(overlay, {
            clipPath: "circle(150% at calc(100% - 40px) 40px)",
            duration: 0.8,
            ease: "power4.inOut",
            onStart: () => overlay.style.pointerEvents = "auto",
            onReverseComplete: () => overlay.style.pointerEvents = "none"
        });

        tl.to(overlayBrand, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.6");

        tl.to(links, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4");

        tl.to(bars[0], {
            rotate: 45,
            y: 7,
            duration: 0.3
        }, 0);

        tl.to(bars[1], {
            opacity: 0,
            duration: 0.3
        }, 0);

        tl.to(bars[2], {
            rotate: -45,
            y: -7,
            duration: 0.3
        }, 0);

        let open = false;

        toggle.addEventListener("click", function () {
            if (isDesktop()) return;

            open = !open;
            nav.classList.toggle("c-nav--open");
            document.body.classList.toggle("is-nav-open");
            open ? tl.play() : tl.reverse();
        });

        links.forEach(link => {
            link.addEventListener("click", function (e) {
                if (isDesktop()) return;

                const targetId = this.getAttribute("href");
                if (!targetId || !targetId.startsWith("#")) return;

                e.preventDefault();

                const section = document.querySelector(targetId);
                if (!section) return;

                open = false;
                nav.classList.remove("c-nav--open");
                document.body.classList.remove("is-nav-open");

                tl.reverse().eventCallback("onReverseComplete", () => {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = section.offsetTop - navHeight;

                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: targetPosition,
                        ease: "power2.out"
                    });

                    tl.eventCallback("onReverseComplete", null);
                });
            });
        });

        window.addEventListener("resize", () => {
            if (isDesktop()) {
                open = false;
                nav.classList.remove("c-nav--open");
                document.body.classList.remove("is-nav-open");
                tl.progress(0).pause();
            }
        });
    }

    window.addEventListener("scroll", handleNavScroll);

    // =========================
    // UNIWERSALNA FUNKCJA PARALLAX
    // =========================
    function initParallaxSection({
        section,
        media,
        content,
        bg = null,
        start = "top bottom",
        end = "bottom top",
        mediaYPercent = 12,
        contentY = -60,
        bgScaleTo = 1.14,
        scrub = true
    }) {
        const sectionEl = document.querySelector(section);
        const mediaEl = document.querySelector(media);
        const contentEl = document.querySelector(content);
        const bgEl = bg ? document.querySelector(bg) : null;

        if (!sectionEl || !mediaEl || !contentEl) return;

        // Startowy stan contentu (ważne przy refresh / restore scroll)
        gsap.set(contentEl, { y: 0, opacity: 1 });

        // Parallax tła / media wrapper
        gsap.to(mediaEl, {
            yPercent: mediaYPercent,
            ease: "none",
            scrollTrigger: {
                trigger: sectionEl,
                start,
                end,
                scrub,
                invalidateOnRefresh: true
            }
        });

        // Dodatkowy zoom obrazka / video
        if (bgEl) {
            gsap.to(bgEl, {
                scale: bgScaleTo,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionEl,
                    start,
                    end,
                    scrub,
                    invalidateOnRefresh: true
                }
            });
        }

        // Parallax contentu (tylko ruch, bez opacity)
        gsap.to(contentEl, {
            y: contentY,
            ease: "none",
            scrollTrigger: {
                trigger: sectionEl,
                start,
                end,
                scrub,
                invalidateOnRefresh: true
            }
        });
    }

    // =========================
    // HERO PARALLAX
    // =========================
    initParallaxSection({
        section: ".l-section--hero",
        media: ".c-hero__media",
        content: ".c-hero__parallax",
        bg: ".c-hero__video",
        start: "top top",
        end: "bottom top",
        mediaYPercent: 12,
        contentY: -80,
        bgScaleTo: 1.14
    });

    // =========================
    // CTA PARALLAX
    // =========================
    initParallaxSection({
        section: ".l-section--cta",
        media: ".c-cta__media",
        content: ".c-cta__parallax",
        bg: ".c-cta__image, .c-cta__video",
        start: "top bottom",
        end: "bottom top",
        mediaYPercent: 12,
        contentY: -60,
        bgScaleTo: 1.14
    });

    // =========================
    // REVEAL SEKCJI (sekwencyjny)
    // =========================
    const revealSections = document.querySelectorAll(".c-reveal");

    function showRevealSection(section) {
        const elements = section.querySelectorAll(".c-reveal__title, .c-reveal__text, .c-reveal__link");

        gsap.to(elements, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto"
        });
    }

    function hideRevealSection(section) {
        const elements = section.querySelectorAll(".c-reveal__title, .c-reveal__text, .c-reveal__link");

        gsap.to(elements, {
            y: 40,
            opacity: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto"
        });
    }

    revealSections.forEach(section => {
        const elements = section.querySelectorAll(".c-reveal__title, .c-reveal__text, .c-reveal__link");

        // Stan początkowy
        gsap.set(elements, {
            y: 40,
            opacity: 0
        });

        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "bottom 35%",
            onEnter: () => showRevealSection(section),
            onLeave: () => hideRevealSection(section),
            onEnterBack: () => showRevealSection(section),
            onLeaveBack: () => hideRevealSection(section)
        });
    });

    // =========================
    // REFRESH / FIXY
    // =========================
    document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
        setTimeout(handleNavScroll, 50);
    });

    let resizeTimeout;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    });

    (function () {
        const html = document.documentElement;
        const preloader = document.querySelector(".c-preloader");
        const percentEl = document.querySelector(".js-preloader-percent");
        const barEl = document.querySelector(".js-preloader-bar");

        if (!preloader || !percentEl || !barEl) {
            html.classList.remove("is-loading");
            return;
        }

        let progress = 0;
        let target = 0;
        let rafId = null;
        let finished = false;

        function computeTarget() {
            const cap = finished ? 100 : 99;
    
            if (!finished) {
                if (progress < 60) target = Math.min(cap, progress + (Math.random() * 10 + 6));
                else if (progress < 85) target = Math.min(cap, progress + (Math.random() * 5 + 2));
                else target = Math.min(cap, progress + (Math.random() * 2.5 + 0.6));
            } else {
                target = 100;
            }
        }

        function render() {
            percentEl.textContent = String(Math.round(progress));
            barEl.style.width = `${progress}%`;
        }

        function tick() {
            computeTarget();
            
            progress += (target - progress) * 0.08;

            if (!finished) progress = Math.min(progress, 99);
            else progress = Math.min(progress, 100);

            render();

            if (finished && progress >= 99.6) {
                progress = 100;
                render();
                cancelAnimationFrame(rafId);
                rafId = null;
                hide();
                
                return;
            }

            rafId = requestAnimationFrame(tick);
        }

        function hide() {
            preloader.classList.add("is-hidden");
            html.classList.remove("is-loading");

            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }

            setTimeout(() => preloader.remove(), 650);
        }

        rafId = requestAnimationFrame(tick);

        window.addEventListener("load", () => {
            finished = true;
        });

        setTimeout(() => {
            finished = true;
        }, 12000);
    })();

});

(function () {
  const progressBar = document.querySelector('.c-scroll-progress__bar');
  if (!progressBar) return;

  let maxScroll = 0;
  let ticking = false;

  function recalcMaxScroll() {
    // Cała wysokość dokumentu - wysokość okna
    maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;

    // Zabezpieczenie dla bardzo krótkich stron
    if (maxScroll < 1) maxScroll = 1;
  }

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    progressBar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  function onResize() {
    recalcMaxScroll();
    requestUpdate();
  }

  // Init
  recalcMaxScroll();
  updateProgress();

  // Events
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', onResize);

  // Dodatkowo po pełnym załadowaniu (obrazy/video mogą zmienić wysokość strony)
  window.addEventListener('load', onResize);

  // Opcjonalnie: jeśli treść dynamicznie się zmienia (np. accordion, lazyload)
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      recalcMaxScroll();
      requestUpdate();
    });
    ro.observe(document.body);
  }
})();