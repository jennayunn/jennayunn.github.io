document.addEventListener('DOMContentLoaded', () => {
    const nerves = document.querySelectorAll('.brain-path');
    const hero = document.querySelector('.hero');
    const firstContentSection = document.querySelector('.content-section');
    const sourceBrain = document.querySelector('#brain-svg');
    const miniBrain = document.querySelector('.mini-brain');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const siteHeader = document.querySelector('.site-header');
    const progressFill = document.querySelector('.scroll-progress-fill');
    const progressTrack = document.querySelector('.scroll-progress-track');
    const navSections = [...document.querySelectorAll('.content-section[id]')];
    const navLinks = new Map(
        [...document.querySelectorAll('.site-nav a')].map(a => [a.getAttribute('href').slice(1), a])
    );

    let currentSectionId = null;

    const setCurrentSection = (id) => {
        if (id === currentSectionId) return;
        currentSectionId = id;
        navLinks.forEach((link, key) => {
            const isCurrent = key === id;
            link.classList.toggle('is-current', isCurrent);
            if (isCurrent) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const miniBrainSvg = sourceBrain.cloneNode(true);
    miniBrainSvg.removeAttribute('id');
    miniBrainSvg.classList.add('mini-brain-svg');
    miniBrain.appendChild(miniBrainSvg);

    // Hand each path's own length to CSS so the looping keyframes can draw
    // and retract it. The animation itself lives in the stylesheet, since a
    // one-shot transition cannot repeat.
    nerves.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}px`;
        path.style.setProperty('--brain-dash', `${length}px`);
    });

    let animationFrame;
    let isLeavingHero = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updateScrollIndicator = () => {
        const scrollTop = window.scrollY;
        const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
        const headerHeight = siteHeader.offsetHeight;
        // An anchor jump to the first section lands at heroHeight minus its
        // scroll-margin-top (= headerHeight), and so does the first-scroll
        // scrollIntoView. The reveal point must sit at or below that, or the
        // header and axon hide themselves exactly when you navigate.
        const revealPoint = Math.max(hero.offsetHeight - headerHeight - 8, 1);
        const remainingScroll = Math.max(maximumScroll - revealPoint, 1);
        const progressAfterHero = clamp((scrollTop - revealPoint) / remainingScroll, 0, 1);

        const pastHero = scrollTop >= revealPoint;
        scrollIndicator.classList.toggle('is-visible', pastHero);
        siteHeader.classList.toggle('is-visible', pastHero);
        progressFill.style.height = `${progressAfterHero * 100}%`;
        progressTrack.classList.toggle('is-complete', progressAfterHero >= 0.995);

        // the active section is the last one whose top has crossed just
        // below the header; at the page end the final section may be too
        // short to ever reach that line, so pin it there.
        const line = headerHeight + 48;
        let active = navSections[0];
        for (const section of navSections) {
            if (section.getBoundingClientRect().top <= line) active = section;
        }
        if (scrollTop >= maximumScroll - 4) active = navSections[navSections.length - 1];
        setCurrentSection(pastHero ? active.id : null);

        animationFrame = undefined;
    };

    const requestScrollUpdate = () => {
        if (animationFrame) return;
        animationFrame = window.requestAnimationFrame(updateScrollIndicator);
    };

    const leaveHeroOnFirstScroll = (event) => {
        if (isLeavingHero) {
            event.preventDefault();
            return;
        }

        if (window.scrollY <= 2 && event.deltaY > 0) {
            event.preventDefault();
            isLeavingHero = true;
            firstContentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            window.setTimeout(() => {
                isLeavingHero = false;
            }, 800);
        }
    };

    window.addEventListener('wheel', leaveHeroOnFirstScroll, { passive: false });
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);
    updateScrollIndicator();
});
