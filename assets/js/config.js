document.body.classList.add("is-loading");

const preloader = document.querySelector(".c-preloader");
const preText = document.querySelector(".c-preloader__text");

gsap.set(preText, { y: 40, opacity: 0 });

const preloadTl = gsap.timeline();

preloadTl.to(preText, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
});

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
        open = !open;
        nav.classList.toggle("c-nav--open");
        document.body.classList.toggle("is-nav-open");
        open ? tl.play() : tl.reverse();
    });

    links.forEach(link => {
        link.addEventListener("click", function (e) {

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
    
    window.addEventListener("scroll", handleNavScroll);
    
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
    
    const panels = document.querySelectorAll(".l-section");

    panels.forEach(panel => {

    const inner = panel.querySelector(".c-section__inner");

    if (!inner) return;

    gsap.to(inner, {
        filter: window.innerWidth < 768 ? "blur(3px)" : "blur(6px)",
        ease: "none",
        scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: true
            }
        });
    });
    
    document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        setTimeout(handleNavScroll, 50);
    });
    
    let resizeTimeout;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
    
    Promise.all([
        document.fonts.ready,
        new Promise(resolve => {
            const imgs = document.images;
            let loaded = 0;

            if (imgs.length === 0) resolve();

            for (let img of imgs) {
                if (img.complete) {
                    loaded++;
                    if (loaded === imgs.length) resolve();
                } else {
                    img.addEventListener("load", () => {
                        loaded++;
                        if (loaded === imgs.length) resolve();
                    });
                }
            }
        })
    ]).then(() => {

        ScrollTrigger.refresh();

        gsap.to(preText, {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: "power3.in"
        });

        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            onComplete: () => {
                preloader.remove();
                document.body.classList.remove("is-loading");
                ScrollTrigger.refresh();
            }
        });

    });

});