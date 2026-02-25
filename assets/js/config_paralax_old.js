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
    const toggle = nav.querySelector(".c-nav__toggle");
    const overlay = nav.querySelector(".c-nav__overlay");
    const links = nav.querySelectorAll(".c-nav__link");
    const bars = nav.querySelectorAll(".c-nav__toggle-line");

    gsap.set(links, {
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

    tl.to(links, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.4");

    tl.to(bars[0], {
        rotate: 45,
        y: 9,
        duration: 0.3
    }, 0);

    tl.to(bars[1], {
        opacity: 0,
        duration: 0.3
    }, 0);

    tl.to(bars[2], {
        rotate: -45,
        y: -9,
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

            if (!targetId.startsWith("#")) return;

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
    
    window.addEventListener("scroll", handleNavScroll);
    
    const heroSection = document.querySelector(".l-section--hero");
    const heroMedia = document.querySelector(".c-hero__media");
    const heroVideo = document.querySelector(".c-hero__video");
    
    gsap.set(".c-hero__parallax", {
        y: 0,
        opacity: 1
    });
    
    const heroContent = document.querySelector(".c-hero__parallax");

    if (heroSection && heroMedia && heroContent) {
        // ruch warstwy video (wolniej niż scroll)
        gsap.to(heroMedia, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        // opcjonalnie dodatkowy lekki zoom video podczas scrolla
        if (heroVideo) {
            gsap.to(heroVideo, {
                scale: 1.14,
                ease: "none",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }

        // ruch tekstu (subtelny) + lekkie wygaszanie
        gsap.to(heroContent, {
            y: -80,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }
    
    const ctaSection = document.querySelector(".l-section--cta");
    const ctaMedia = document.querySelector(".c-cta__media");
    const ctaBg = document.querySelector(".c-cta__image, .c-cta__video");
    const ctaContent = document.querySelector(".c-cta__parallax");

    if (ctaSection && ctaMedia && ctaContent) {
        gsap.set(ctaContent, { y: 0, opacity: 1 });

        gsap.to(ctaMedia, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: ctaSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        if (ctaBg) {
            gsap.to(ctaBg, {
                scale: 1.14,
                ease: "none",
                scrollTrigger: {
                    trigger: ctaSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }

        gsap.to(ctaContent, {
            y: -60,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
                trigger: ctaSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }

    const sections = document.querySelectorAll(".c-reveal");

    sections.forEach(section => {
        
        const elements = section.querySelectorAll(".c-reveal__title, .c-reveal__text, .c-reveal__link");

        gsap.to(elements, {
            scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse"
        },
            y: 0,
            opacity: 1,
            stagger: {
                each: 0.12,
                from: "start"
            },
            duration: 0.5,
            ease: "power3.out"
        });

    });
    
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

});