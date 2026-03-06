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
    // REVEAL SEKCJI (aktywny środek viewportu)
    // =========================
    const revealSections = Array.from(document.querySelectorAll(".l-section")).filter(section => {
        return section.querySelector(".js-reveal");
    });

    let activeRevealSection = null;
    let revealTicking = false;

    function getRevealElements(section) {
        return section.querySelectorAll(".js-reveal");
    }

    function showRevealSection(section, immediate = false) {
        const elements = getRevealElements(section);
        if (!elements.length) return;

        gsap.killTweensOf(elements);

        if (immediate) {
            gsap.set(elements, {
                y: 0,
                opacity: 1
            });
            return;
        }

        gsap.to(elements, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true
        });
    }

    function hideRevealSection(section, immediate = false) {
        const elements = getRevealElements(section);
        if (!elements.length) return;

        gsap.killTweensOf(elements);

        if (immediate) {
            gsap.set(elements, {
                y: 40,
                opacity: 0
            });
            return;
        }

        gsap.to(elements, {
            y: 40,
            opacity: 0,
            stagger: 0.04,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true
        });
    }

    function getActiveRevealSection() {
        const viewportCenter = window.innerHeight / 2;

        for (const section of revealSections) {
            const rect = section.getBoundingClientRect();

            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                return section;
            }
        }

        return null;
    }

    function setRevealState(immediate = false) {
        const nextActiveSection = getActiveRevealSection();

        revealSections.forEach(section => {
            if (section === nextActiveSection) {
                showRevealSection(section, immediate);
            } else {
                hideRevealSection(section, immediate);
            }
        });

        activeRevealSection = nextActiveSection;
    }

    function updateRevealState() {
        const nextActiveSection = getActiveRevealSection();

        if (nextActiveSection === activeRevealSection) return;

        revealSections.forEach(section => {
            if (section === nextActiveSection) {
                showRevealSection(section, false);
            } else if (section === activeRevealSection) {
                hideRevealSection(section, false);
            } else {
                hideRevealSection(section, true);
            }
        });

        activeRevealSection = nextActiveSection;
    }

    function requestRevealUpdate() {
        if (revealTicking) return;

        revealTicking = true;

        requestAnimationFrame(() => {
            updateRevealState();
            revealTicking = false;
        });
    }

    revealSections.forEach(section => {
        const elements = getRevealElements(section);

        gsap.set(elements, {
            y: 40,
            opacity: 0
        });
    });

    requestAnimationFrame(() => {
        setRevealState(true);
    });

    window.addEventListener("scroll", requestRevealUpdate, { passive: true });

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
            setRevealState(true);
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

        // Czy to jest kolejne wejście w tej samej sesji (tab)?
        const SESSION_KEY = "designio_has_loaded_once";
        const hasLoadedOnce = sessionStorage.getItem(SESSION_KEY) === "1";

        // Ustawienia
        const FAST_MIN_VISIBLE_MS = 260; // żeby nie "mignęło"
        const SLOW_FAILSAFE_MS = 12000;  // awaryjne zdjęcie blokady na pierwszym wejściu
        const FONTS_MAX_WAIT_MS = 700;   // nie blokuj Safari zbyt długo fontami
        const MAX_BEFORE_READY = hasLoadedOnce ? 100 : 99;

        let progress = hasLoadedOnce ? 80 : 12; // <-- ważne: nie startuj od 0 na Safari
        let target = progress;
        let rafId = null;
        let finished = false;
        const startTs = performance.now();

        function render() {
            const shown = Math.round(progress);
            percentEl.textContent = String(shown);
            barEl.style.width = `${progress}%`;
        }

        function computeTarget() {
            const cap = finished ? 100 : MAX_BEFORE_READY;

            // Na kolejnych wejściach: szybciej i bez "czekania"
            if (hasLoadedOnce) {
                target = 100;
                return;
            }

            // Pierwsze wejście: realistyczny progres, ale dochodzimy do 99
            if (progress < 60) {
                target = Math.min(cap, progress + (Math.random() * 10 + 6)); // +6..16
            } else if (progress < 90) {
                target = Math.min(cap, progress + (Math.random() * 5 + 2)); // +2..7
            } else {
                target = Math.min(cap, progress + (Math.random() * 2.2 + 0.7)); // +0.7..2.9
            }
        }

        function lazyLoadVideos() {
            document.querySelectorAll("video[data-lazy-video]").forEach(video => {

                // wariant 1: video[data-src]
                const videoSrc = video.getAttribute("data-src");
                if (videoSrc && !video.src) {
                    video.src = videoSrc;
                    video.removeAttribute("data-src");
                }

                // wariant 2: <source data-src="...">
                const sources = video.querySelectorAll("source[data-src]");
                sources.forEach(s => {
                    s.src = s.getAttribute("data-src");
                    s.removeAttribute("data-src");
                });

                // iOS/Safari: wymuś przeładowanie źródeł
                try {
                    video.load();
                } catch (e) {}

                // autoplay bywa kapryśny – próbujemy, ale nie rzucamy błędów
                try {
                    const p = video.play();
                    if (p && typeof p.catch === "function") {
                        p.catch(() => {});
                    }
                } catch (e) {}

            });
        }

        function hideWhenAllowed() {
            const elapsed = performance.now() - startTs;
            const wait = Math.max(0, FAST_MIN_VISIBLE_MS - elapsed);

            setTimeout(() => {
                preloader.classList.add("is-hidden");
                html.classList.remove("is-loading");

                // odśwież ScrollTrigger po odsłonięciu
                if (window.ScrollTrigger) {
                    ScrollTrigger.refresh();
                }

                // Dopiero teraz ładujemy wideo (Safari przestaje "wisieć")
                lazyLoadVideos();

                setTimeout(() => preloader.remove(), 650);
            }, wait);
        }

        function tick() {
            computeTarget();

            const ease = hasLoadedOnce ? 0.20 : 0.10;
            progress += (target - progress) * ease;

            if (!finished) {
                progress = Math.min(progress, MAX_BEFORE_READY);
            } else {
                progress = Math.min(progress, 100);
            }

            render();

            if (finished && progress >= 99.6) {
                progress = 100;
                render();

                cancelAnimationFrame(rafId);
                rafId = null;

                hideWhenAllowed();
                return;
            }

            rafId = requestAnimationFrame(tick);
        }

        // START
        render();
        rafId = requestAnimationFrame(tick);

        async function markReady() {
            if (finished) return;

            // DOMContentLoaded (bez czekania na video)
            if (document.readyState === "loading") {
                await new Promise(resolve => {
                    document.addEventListener("DOMContentLoaded", resolve, { once: true });
                });
            }

            // fonty, ale max FONTS_MAX_WAIT_MS
            try {
                if (document.fonts && document.fonts.ready) {
                    await Promise.race([
                        document.fonts.ready,
                        new Promise(resolve => setTimeout(resolve, FONTS_MAX_WAIT_MS))
                    ]);
                }
            } catch (e) {}

            finished = true;
            sessionStorage.setItem(SESSION_KEY, "1");
        }

        if (hasLoadedOnce) {
            finished = true;
            sessionStorage.setItem(SESSION_KEY, "1");
        } else {
            markReady();

            setTimeout(() => {
                finished = true;
                sessionStorage.setItem(SESSION_KEY, "1");
            }, SLOW_FAILSAFE_MS);
        }
    })();

    (function () {

        // Prefetchujemy tylko linki wewnętrzne (ta sama domena)
        const prefetched = new Set();

        function isInternalUrl(url) {
            try {
                const u = new URL(url, location.href);
                return u.origin === location.origin;
            } catch {
                return false;
            }
        }

        function shouldPrefetch(url) {
            if (!url) return false;
            if (!isInternalUrl(url)) return false;
            if (prefetched.has(url)) return false;

            const u = new URL(url, location.href);
            if (u.hash && (u.pathname === location.pathname)) return false;

            if (/\.(pdf|zip|rar|7z|png|jpg|jpeg|webp|gif|svg|mp4|mp3|woff2?|ttf|otf)$/i.test(u.pathname)) return false;
            if (url.startsWith("mailto:") || url.startsWith("tel:")) return false;

            return true;
        }

        function prefetchDoc(url) {
            if (!shouldPrefetch(url)) return;

            prefetched.add(url);

            const link = document.createElement("link");
            link.rel = "prefetch";
            link.as = "document";
            link.href = url;
            document.head.appendChild(link);
        }

        document.querySelectorAll("a[href]").forEach(a => {
            const href = a.getAttribute("href");
            if (!href) return;

            a.addEventListener("mouseenter", () => prefetchDoc(href), { passive: true });
            a.addEventListener("touchstart", () => prefetchDoc(href), { passive: true });
            a.addEventListener("focus", () => prefetchDoc(href), { passive: true });
        });

        function prefetchTopNavAfterIdle() {
            const navLinks = document.querySelectorAll(".c-nav__link[href]");
            navLinks.forEach(a => prefetchDoc(a.getAttribute("href")));
        }

        function runAfterIdle() {
            const run = () => prefetchTopNavAfterIdle();

            if ("requestIdleCallback" in window) {
                requestIdleCallback(run, { timeout: 2000 });
            } else {
                setTimeout(run, 1200);
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", runAfterIdle, { once: true });
        } else {
            runAfterIdle();
        }
    })();

});

(function () {
    const progressBar = document.querySelector(".c-scroll-progress__bar");
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
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);

    // Dodatkowo po pełnym załadowaniu (obrazy/video mogą zmienić wysokość strony)
    window.addEventListener("load", onResize);

    // Opcjonalnie: jeśli treść dynamicznie się zmienia (np. accordion, lazyload)
    if ("ResizeObserver" in window) {
        const ro = new ResizeObserver(() => {
            recalcMaxScroll();
            requestUpdate();
        });
        ro.observe(document.body);
    }
})();