/*
 * ==========================================================================
 * Rakhi Story Engine — High-End Cinematic Interactive Experience
 * Features: Lenis Smooth Scroll, GSAP ScrollTrigger Parallax,
 * 3D Physics Tilt, Web Audio Haptics, Wax Seal Letter & Memory Stream
 * ==========================================================================
 */

// ── Web Audio Synthesizer (Zero-Dependency Micro-Haptics) ──
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playChime() {
    this.init();
    if (!this.ctx) return;
    const notes = [528, 792, 1056];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + (idx * 0.045);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.65);
    });
  },
  playWaxCrack() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.16);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  }
};

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
  const config = typeof window.loadRakhiConfig === 'function'
    ? await window.loadRakhiConfig()
    : (window.rakhiConfig || {});

  const story = hydrateStory(config);
  setupLenis();
  setupAudio(config);
  setupLetter();
  setupTilt();
  setupCelebration();
  setupReplay();
  setupPetalDust();
  setupScrollProgress();
  setupIntroMouseParallax();

  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-motion');
    window.gsap.registerPlugin(window.ScrollTrigger);
    setupScrollStory();
  }

  document.body.dataset.siblings = `${story.sister}-${story.brother}`.toLowerCase().replace(/\s+/g, '-');
});

/**
 * Buttery Smooth Inertia Scroll (Lenis + GSAP Integration)
 */
function setupLenis() {
  if (typeof Lenis === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    lenisInstance = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      syncTouch: true,
      autoResize: true
    });

    if (window.ScrollTrigger) {
      lenisInstance.on('scroll', window.ScrollTrigger.update);
    }

    if (window.gsap) {
      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    }
  } catch (_) {}
}

function hydrateStory(config) {
  const sister = cleanText(config.names?.sister, 'Ananya');
  const brother = cleanText(config.names?.brother, 'Aarav');
  const sisterProfile = config.profiles?.sister || {};
  const brotherProfile = config.profiles?.brother || {};
  const memories = Array.isArray(config.memories) && config.memories.length ? config.memories : [];
  const childhood = Array.isArray(config.childhoodPhotos) && config.childhoodPhotos.length ? config.childhoodPhotos : [];
  const photos = makePhotoSet(childhood, memories);
  const sisterPhoto = cleanUrl(sisterProfile.photo || config.hero?.sisterPhoto || config.hero?.image || 'assets/images/demo/portrait.svg');
  const brotherPhoto = cleanUrl(brotherProfile.photo || config.hero?.brotherPhoto || photos.at(-1)?.url || 'assets/images/demo/img6.svg');

  setText('threshold-names', `${sister.toUpperCase()} & ${brother.toUpperCase()}`);
  setText('sister-name', sister.toUpperCase());
  setText('header-year', cleanText(config.festival?.year || config.year, '2026'));
  setImage('hero-portrait', sisterPhoto, `A portrait of ${sister}`);
  setImage('portal-sister-img', sisterPhoto, `A portrait of ${sister}`);
  setImage('portal-brother-img', brotherPhoto, `A photo of ${brother}`);
  setImage('distance-sister-photo', sisterPhoto, `A memory of ${sister}`);
  setImage('distance-brother-photo', brotherPhoto, `A memory of ${brother}`);
  setText('sister-city', cleanText(config.distanceSection?.sisterCity || sisterProfile.city, 'Mumbai').toUpperCase());
  setText('brother-city', cleanText(config.distanceSection?.brotherCity || brotherProfile.city, 'London').toUpperCase());
  document.title = `${sister} & ${brother} — a Rakhi story`;

  renderPhotoStream(photos);
  renderTimeline(memories, photos);
  renderLetter(config.letter || {}, sister, brother);

  const signoff = document.getElementById('finale-signoff');
  if (signoff) signoff.innerHTML = `Forever your brother, <strong>${escapeHtml(brother)}</strong>`;
  setText('finale-sister-name', sister.toUpperCase());
  setImage('finale-left-img', photos[0]?.url || 'assets/images/demo/img1.svg', 'Childhood memory');
  setImage('finale-right-img', photos[photos.length - 1]?.url || 'assets/images/demo/img6.svg', 'Recent memory');

  return { sister, brother };
}

function makePhotoSet(childhood, memories) {
  const fallback = [
    { url: 'assets/images/demo/img1.svg', caption: 'Before we knew what growing up meant.' },
    { url: 'assets/images/demo/img2.svg', caption: 'You were annoying then too.' },
    { url: 'assets/images/demo/img3.svg', caption: 'An excellent partnership in chaos.' },
    { url: 'assets/images/demo/img4.svg', caption: 'The photo we almost did not take.' },
    { url: 'assets/images/demo/img5.svg', caption: 'Somehow, you grew up.' }
  ];
  const supplied = childhood.map((photo, index) => ({
    url: cleanUrl(photo.url || photo.image || memories[index]?.image || fallback[index % fallback.length].url),
    caption: cleanText(photo.caption || memories[index]?.description, fallback[index % fallback.length].caption)
  }));
  return (supplied.length ? supplied : fallback).slice(0, 5);
}

function renderPhotoStream(photos) {
  const container = document.getElementById('photo-stream');
  if (!container) return;
  
  container.innerHTML = photos.map((photo, index) => `
    <div class="memory-reel-card ${index === 2 ? 'is-expanded' : ''}" data-index="${index}">
      <div class="reel-noise-overlay" aria-hidden="true">
        <svg class="reel-noise-svg" width="100%" height="100%">
          <filter id="reel-noise-${index}">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#reel-noise-${index})" opacity="0.22"/>
        </svg>
      </div>
      <img src="${escapeAttr(photo.url)}" alt="Memory ${index + 1}" class="reel-img" loading="lazy">
      <div class="reel-card-overlay">
        <span class="reel-card-number">0${index + 1}</span>
        <p class="reel-card-caption">${escapeHtml(photo.caption)}</p>
      </div>
    </div>
  `).join('');

  const cards = container.querySelectorAll('.memory-reel-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('is-expanded'));
      card.classList.add('is-expanded');
    });
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('is-expanded'));
      card.classList.add('is-expanded');
    });
  });
}

function renderTimeline(memories, photos) {
  const container = document.getElementById('memory-route');
  if (!container) return;
  const defaults = [
    { year: '2010', era: 'ERA 01', icon: '👑', title: 'The Tiny Humans Era', desc: 'Before we knew how fast time would move. Stealing toys and crying to Mom.' },
    { year: '2014', era: 'ERA 02', icon: '📺', title: 'The Remote Control War', desc: 'No one remembers who started the fight. Both of us firmly remember winning.' },
    { year: '2018', era: 'ERA 03', icon: '🍕', title: 'Growing Up (Sort of)', desc: 'The year we became secret-keepers and official 50% snack tax partners.' },
    { year: '2022', era: 'ERA 04', icon: '✈️', title: 'Different Cities, Same Dial', desc: 'Miles apart, but the first call when life got crazy was always you.' },
    { year: '2026', era: 'ERA 05', icon: '🛡️', title: 'Forever In My Corner', desc: 'A little older, none the wiser, and an unbreakable sacred bond.' }
  ];
  
  const entries = defaults.map((item, index) => {
    const memory = memories[index] || {};
    return {
      year: cleanText(memory.year, item.year),
      era: item.era,
      icon: item.icon,
      title: cleanText(memory.title, item.title),
      desc: cleanText(memory.description, item.desc),
      image: cleanUrl(memory.image || photos[index]?.url || `assets/images/demo/img${index + 1}.svg`)
    };
  });

  container.innerHTML = entries.map((item, index) => `
    <article class="memory-slate-card" data-step="${index}">
      <div class="slate-glow"></div>
      <div class="slate-inner">
        <div class="slate-header">
          <span class="slate-era-pill">${escapeHtml(item.era)}</span>
          <span class="slate-year">${escapeHtml(item.year)}</span>
        </div>
        
        <figure class="slate-polaroid">
          <div class="slate-tape"></div>
          <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" loading="lazy">
        </figure>

        <div class="slate-content">
          <div class="slate-title-row">
            <span class="slate-icon">${item.icon}</span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <p>${escapeHtml(item.desc)}</p>
        </div>
      </div>
    </article>
  `).join('');
}

function renderLetter(letter, sister, brother) {
  const date = cleanText(letter.date, 'August, 2026');
  const salutation = cleanText(letter.salutation, `Dearest ${sister},`);
  const paragraphs = Array.isArray(letter.bodyParagraphs) && letter.bodyParagraphs.length
    ? letter.bodyParagraphs
    : [
      `We have grown up, changed, argued, laughed — and somehow you have remained one of the most important people in my life.`,
      `Whenever the world feels too much, knowing I have you in my corner gives me a quiet kind of strength.`,
      `No matter how far life takes us, our bond stays right here. Happy Raksha Bandhan, always.`
    ];
  const signoff = cleanText(letter.signoff, `Forever your brother, ${brother}`);
  setText('letter-date', date.toUpperCase());
  setText('letter-salutation', salutation);
  setText('letter-signature', signoff);
  const body = document.getElementById('letter-body');
  if (body) body.innerHTML = paragraphs.slice(0, 4).map(paragraph => `<p>${escapeHtml(cleanText(paragraph, ''))}</p>`).join('');
}

/**
 * Multi-layer Mouse Parallax in Intro Scene
 */
function setupIntroMouseParallax() {
  const intro = document.querySelector('.intro-scene');
  if (!intro || !window.matchMedia('(pointer: fine)').matches) return;

  intro.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    const fabric1 = document.querySelector('.fabric-one');
    const fabric2 = document.querySelector('.fabric-two');
    const mandala = document.querySelector('.intro-mandala');

    if (fabric1) fabric1.style.transform = `translateX(${x * 0.7}px) translateY(${y * 0.7}px) rotate(-10deg)`;
    if (fabric2) fabric2.style.transform = `translateX(${x * -0.6}px) translateY(${y * -0.6}px)`;
    if (mandala) mandala.style.transform = `translateX(${x * -0.3}px) translateY(${y * -0.3}px)`;
  });
}

/**
 * Chapter 02: Kinetic Landing Scroll Storytelling Engine
 * Replicating HomeHeroLandingScrollAnimation with dynamic flight & kinetic text
 */
function setupKineticStorytelling() {
  const { gsap, ScrollTrigger } = window;
  const heroSection = document.getElementById('photo-journey');
  const heroHeader = document.getElementById('kinetic-header');
  const animatedIconsContainer = document.getElementById('kinetic-icons');
  if (!heroSection || !animatedIconsContainer || !gsap || !ScrollTrigger) return;

  const iconElements = Array.from(animatedIconsContainer.querySelectorAll('.kinetic-icon-card'));
  const textSegments = Array.from(document.querySelectorAll('.kinetic-text-segment'));
  const placeholders = Array.from(document.querySelectorAll('.kinetic-placeholder-icon'));

  // Pre-dock images when progress completes
  placeholders.forEach((ph, i) => {
    const src = iconElements[i]?.querySelector('img')?.src || `assets/images/demo/img${i + 1}.svg`;
    const img = ph.querySelector('img');
    if (img) img.src = src;
  });

  // Shuffle text animation order
  const animationOrder = textSegments.map((segment, index) => ({ segment, originalIndex: index }));
  for (let i = animationOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [animationOrder[i], animationOrder[j]] = [animationOrder[j], animationOrder[i]];
  }

  let duplicateIcons = null;

  function cleanupDuplicates() {
    if (duplicateIcons) {
      duplicateIcons.forEach((d) => d.parentNode?.removeChild(d));
      duplicateIcons = null;
    }
  }

  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: () => `+=${window.innerHeight * 4}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onLeave: () => {
      cleanupDuplicates();
      placeholders.forEach(ph => ph.classList.add('is-docked'));
      textSegments.forEach(seg => gsap.set(seg, { opacity: 1 }));
    },
    onLeaveBack: () => {
      cleanupDuplicates();
      placeholders.forEach(ph => ph.classList.remove('is-docked'));
      textSegments.forEach(seg => gsap.set(seg, { opacity: 0 }));
      gsap.set(heroHeader, { transform: 'translateY(0px)', opacity: 1 });
      gsap.set(animatedIconsContainer, { x: 0, y: 0, scale: 1, opacity: 1 });
    },
    onUpdate: (self) => {
      const progress = self.progress;
      const isMobile = window.innerWidth < 1000;
      const targetIconSize = isMobile ? 38 : 54;
      const currentIconSize = iconElements[0]?.getBoundingClientRect().width || 1;
      const exactScale = targetIconSize / currentIconSize;

      if (progress < 0.3) {
        const moveProgress = progress / 0.3;
        const containerMoveY = -window.innerHeight * 0.28 * moveProgress;

        cleanupDuplicates();
        placeholders.forEach(ph => ph.classList.remove('is-docked'));
        textSegments.forEach(seg => gsap.set(seg, { opacity: 0 }));

        if (progress < 0.15) {
          const headerProgress = progress / 0.15;
          gsap.set(heroHeader, {
            transform: `translateY(${-40 * headerProgress}px)`,
            opacity: 1 - headerProgress,
          });
        } else {
          gsap.set(heroHeader, { transform: 'translateY(-40px)', opacity: 0 });
        }

        gsap.set(animatedIconsContainer, { x: 0, y: containerMoveY, scale: 1, opacity: 1 });

        iconElements.forEach((icon, index) => {
          if (icon) {
            const staggerDelay = index * 0.1;
            const iconProgress = gsap.utils.mapRange(staggerDelay, staggerDelay + 0.5, 0, 1, moveProgress);
            const clamped = Math.max(0, Math.min(1, iconProgress));
            gsap.set(icon, { x: 0, y: (-containerMoveY) * (1 - clamped) });
          }
        });

      } else if (progress < 0.6) {
        const scaleProgress = (progress - 0.3) / 0.3;

        cleanupDuplicates();
        placeholders.forEach(ph => ph.classList.remove('is-docked'));
        textSegments.forEach(seg => gsap.set(seg, { opacity: 0 }));
        gsap.set(heroHeader, { transform: 'translateY(-40px)', opacity: 0 });

        const containerRect = animatedIconsContainer.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();
        const deltaX = (heroRect.width / 2 - (containerRect.left - heroRect.left + containerRect.width / 2)) * scaleProgress;
        const deltaY = (heroRect.height / 2 - (containerRect.top - heroRect.top + containerRect.height / 2)) * scaleProgress;

        gsap.set(animatedIconsContainer, {
          x: deltaX,
          y: -window.innerHeight * 0.28 + deltaY,
          scale: 1 + (exactScale - 1) * scaleProgress,
          opacity: 1,
        });

        iconElements.forEach((icon) => { if (icon) gsap.set(icon, { x: 0, y: 0 }); });

      } else if (progress < 0.78) {
        const moveProgress = (progress - 0.6) / 0.18;

        gsap.set(heroHeader, { transform: 'translateY(-40px)', opacity: 0 });
        placeholders.forEach(ph => ph.classList.remove('is-docked'));

        const heroRect = heroSection.getBoundingClientRect();
        const containerRect = animatedIconsContainer.getBoundingClientRect();
        const deltaX = heroRect.width / 2 - (containerRect.left - heroRect.left + containerRect.width / 2);
        const deltaY = heroRect.height / 2 - (containerRect.top - heroRect.top + containerRect.height / 2);

        gsap.set(animatedIconsContainer, {
          x: deltaX,
          y: -window.innerHeight * 0.28 + deltaY,
          scale: exactScale,
          opacity: 0,
        });

        if (!duplicateIcons) {
          duplicateIcons = [];
          iconElements.forEach((icon) => {
            if (icon) {
              const duplicate = icon.cloneNode(true);
              duplicate.className = 'duplicate-kinetic-icon';
              Object.assign(duplicate.style, {
                position: 'absolute',
                width: targetIconSize + 'px',
                height: targetIconSize + 'px',
                zIndex: '50',
              });
              heroSection.appendChild(duplicate);
              duplicateIcons.push(duplicate);
            }
          });
        }

        duplicateIcons?.forEach((duplicate, index) => {
          if (index < placeholders.length && iconElements[index]) {
            const iconRect = iconElements[index].getBoundingClientRect();
            const startX = iconRect.left - heroRect.left;
            const startY = iconRect.top - heroRect.top;

            const targetRect = placeholders[index].getBoundingClientRect();
            const targetX = targetRect.left - heroRect.left;
            const targetY = targetRect.top - heroRect.top;

            const moveX = targetX - startX;
            const moveY = targetY - startY;

            let currentX = 0;
            let currentY = moveProgress < 0.5 ? moveY * (moveProgress / 0.5) : moveY;
            if (moveProgress >= 0.5) currentX = moveX * ((moveProgress - 0.5) / 0.5);

            duplicate.style.left = startX + currentX + 'px';
            duplicate.style.top = startY + currentY + 'px';
            duplicate.style.opacity = '1';
            duplicate.style.display = 'block';
          }
        });

      } else {
        // Phase 4: Lock and illuminate
        gsap.set(heroHeader, { transform: 'translateY(-100px)', opacity: 0 });
        gsap.set(animatedIconsContainer, { opacity: 0 });
        cleanupDuplicates();
        placeholders.forEach(ph => ph.classList.add('is-docked'));

        animationOrder.forEach((item, randomIndex) => {
          const segStart = 0.78 + randomIndex * 0.035;
          const segProgress = gsap.utils.mapRange(segStart, segStart + 0.02, 0, 1, progress);
          gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segProgress)) });
        });
      }
    },
  });
}

/**
 * Master GSAP Cinematic Scroll Choreography
 */
function setupScrollStory() {
  const { gsap, ScrollTrigger } = window;
  const intro = document.querySelector('.intro-scene');
  const introThread = document.getElementById('intro-thread-path');
  const pathLength = safelyGetPathLength(introThread);
  if (introThread && pathLength) gsap.set(introThread, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

  const introTimeline = gsap.timeline({
    scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom bottom', scrub: 0.8 }
  });
  introTimeline
    .to('.intro-prompt', { opacity: 0, y: -25, duration: 0.14 }, 0)
    .to(introThread, { strokeDashoffset: 0, duration: 0.45, ease: 'none' }, 0)
    .to('.word-happy', { xPercent: -28, yPercent: -18, duration: 0.45, ease: 'none' }, 0)
    .to('.word-raksha', { xPercent: 24, yPercent: -12, duration: 0.45, ease: 'none' }, 0)
    .to('.word-bandhan', { xPercent: -18, yPercent: 22, duration: 0.45, ease: 'none' }, 0)
    .to('.fabric-one', { xPercent: 25, yPercent: -12, duration: 1 }, 0)
    .to('.fabric-two', { xPercent: -25, yPercent: 12, duration: 1 }, 0)
    .to(['.word-happy', '.word-raksha', '.word-bandhan'], { opacity: 0, yPercent: -25, duration: 0.18, stagger: 0.03 }, 0.52)
    .fromTo('.bond-statement', { opacity: 0, yPercent: 30, scale: 0.95 }, { opacity: 1, yPercent: 0, scale: 1, duration: 0.22 }, 0.58)
    .to('.bond-statement', { opacity: 0, yPercent: -30, duration: 0.15 }, 0.85);

  // Chapter 00: Grand Sacred Threshold Gateway
  gsap.from('.threshold-header > *', {
    y: 35,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.threshold', start: 'top 78%' }
  });

  gsap.from('.polaroid-left', {
    x: -80,
    rotate: -20,
    opacity: 0,
    scale: 0.85,
    duration: 1.1,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: '.threshold', start: 'top 72%' }
  });

  gsap.from('.polaroid-right', {
    x: 80,
    rotate: 20,
    opacity: 0,
    scale: 0.85,
    duration: 1.1,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: '.threshold', start: 'top 72%' }
  });

  gsap.from('.portal-core-wrapper', {
    scale: 0.75,
    opacity: 0,
    duration: 1.2,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.threshold', start: 'top 72%' }
  });

  // Threshold Button & Rangoli Scroll Spin
  gsap.to('.thread-cta svg', {
    rotate: 240,
    ease: 'none',
    scrollTrigger: { trigger: '.threshold', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.threshold-rangoli.rangoli-left', {
    rotate: 65,
    ease: 'none',
    scrollTrigger: { trigger: '.threshold', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.threshold-rangoli.rangoli-right', {
    rotate: -65,
    ease: 'none',
    scrollTrigger: { trigger: '.threshold', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });

  const enter = document.getElementById('enter-bond');
  enter?.addEventListener('click', () => {
    SoundFX.playChime();
    triggerSparkleBurst();
    if (lenisInstance) {
      lenisInstance.scrollTo('#her', { duration: 1.4 });
    } else {
      document.getElementById('her')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Chapter 01: Sister Spotlight (Luxury Editorial Showcase)
  gsap.from('.watermark-number', {
    yPercent: 40,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 80%', scrub: 1 }
  });

  gsap.from('.sister-chapter-badge', {
    y: -25,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 75%' }
  });

  gsap.from('.sister-hero-title', {
    scale: 0.88,
    y: 35,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 72%' }
  });

  gsap.from('.sister-quote-card', {
    x: -45,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 68%' }
  });

  gsap.from('.trait-card', {
    y: 30,
    opacity: 0,
    scale: 0.9,
    stagger: 0.12,
    duration: 0.85,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.sister-section', start: 'top 65%' }
  });

  gsap.from('.portrait-stage-luxury', {
    rotateY: -20,
    rotateX: 10,
    scale: 0.8,
    opacity: 0,
    duration: 1.3,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 65%' }
  });

  gsap.from('.portrait-diya-glow', {
    scale: 0.3,
    opacity: 0,
    duration: 1,
    delay: 0.4,
    ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.sister-section', start: 'top 65%' }
  });

  // Chapter 02: Kinetic Landing Scroll Storytelling (HomeHeroLandingScrollAnimation)
  setupKineticStorytelling();

  // Chapter 03: The Chronology of Us (Horizontal Pinned 3D Time-Vault)
  gsap.from('.remember-header > *', {
    y: 35,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.remember-section', start: 'top 75%' }
  });

  gsap.to('.remember-ambient-mandala', {
    rotate: 160,
    ease: 'none',
    scrollTrigger: { trigger: '.remember-section', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });

  const track = document.getElementById('memory-route');
  if (track) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.16),
      ease: 'none',
      scrollTrigger: {
        trigger: '.remember-section',
        start: 'top top',
        end: () => `+=${track.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.from('.memory-slate-card', {
      rotateY: -15,
      opacity: 0,
      scale: 0.88,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.remember-section', start: 'top 65%' }
    });
  }

  // Chapter 04: Letter Section
  gsap.from('.letter-lead > *', {
    x: -50,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    scrollTrigger: { trigger: '.letter-section', start: 'top 70%' }
  });
  gsap.from('.envelope-wrap', {
    y: 80,
    rotate: 5,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.letter-section', start: 'top 66%' }
  });

  // Chapter 05: Distance Section (Unified Global Sibling Hub)
  const distanceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.distance-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const medallion = document.getElementById('connection-medallion');
        const counter = document.getElementById('distance-counter-text');
        if (self.progress > 0.65) {
          medallion?.classList.add('is-active');
          if (counter) counter.textContent = '0 MILES • 1 SACRED BOND';
        } else {
          medallion?.classList.remove('is-active');
          if (counter) counter.textContent = '4,487 MILES • 0 SECONDS OF DISTANCE';
        }
      }
    }
  });

  distanceTimeline
    // Scene 1: Initial Cards Entrance & First Line
    .from('.sister-hub', { x: -60, opacity: 0, duration: 0.2 }, 0)
    .from('.brother-hub', { x: 60, opacity: 0, duration: 0.2 }, 0)
    .to('.distance-line-one', { opacity: 1, y: 0, duration: 0.15 }, 0.04)
    .to('.distance-line-one', { opacity: 0, y: -20, duration: 0.12 }, 0.28)
    
    // Scene 2: Golden Light Conduit activates across to Brother
    .to('#conduit-glow', { width: '100%', duration: 0.45, ease: 'power1.inOut' }, 0.22)
    .to('#conduit-particle', { left: '100%', duration: 0.45, ease: 'power1.inOut' }, 0.22)
    .to('.distance-line-two', { opacity: 1, y: 0, duration: 0.15 }, 0.38)
    .to('.distance-line-two', { opacity: 0, y: -20, duration: 0.12 }, 0.62)
    
    // Scene 3: Heartfelt Climax - Sacred Medallion blooms & Final Line shines
    .to('.sister-hub', { scale: 1.04, duration: 0.25, ease: 'power2.out' }, 0.66)
    .to('.brother-hub', { scale: 1.04, duration: 0.25, ease: 'power2.out' }, 0.66)
    .to('.distance-line-three', { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'back.out(1.4)' }, 0.72);

  // Chapter 06: Finale (Royal Sacred Celebration Altar)
  gsap.from('.sanctum-rakhi-altar', {
    scale: 0.7,
    rotate: -15,
    opacity: 0,
    duration: 1.3,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.finale', start: 'top 75%' }
  });
  gsap.from('.sanctum-headline', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.finale', start: 'top 68%' }
  });
  gsap.from('.sanctum-blessing-slate', {
    y: 25,
    scale: 0.94,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: '.finale', start: 'top 62%' }
  });
  gsap.from('.sanctum-actions', {
    y: 18,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.finale', start: 'top 58%' }
  });
  gsap.from('.sanctum-diya', {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.finale', start: 'top 65%' }
  });

  ScrollTrigger.refresh();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/**
 * Interactive Finale Celebration
 */
function setupCelebration() {
  const celebrateBtn = document.getElementById('celebrate-btn');
  celebrateBtn?.addEventListener('click', () => {
    SoundFX.playChime();
    triggerGrandFestivalConfetti();
    const altar = document.querySelector('.rakhi-hero-img-wrap');
    if (altar && window.gsap) {
      window.gsap.fromTo(altar, { scale: 1.25, rotate: 10 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    }
  });
}

function triggerGrandFestivalConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#d99b38', '#a94f5c', '#e6b84f', '#6f2c42', '#2d6a4f']
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#d99b38', '#ffffff', '#e6b84f']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#a94f5c', '#ffffff', '#6f2c42']
      });
    }, 250);
  }
}

/**
 * Royal Wax Seal Letter
 */
function setupLetter() {
  const envelope = document.getElementById('open-letter');
  const paper = document.getElementById('letter-paper');
  envelope?.addEventListener('click', () => {
    const opening = !envelope.classList.contains('is-open');
    if (opening) {
      SoundFX.playWaxCrack();
      SoundFX.playChime();
      triggerSparkleBurst();
    }
    envelope.classList.toggle('is-open', opening);
    paper?.classList.toggle('is-visible', opening);
    envelope.setAttribute('aria-expanded', String(opening));
    paper?.setAttribute('aria-hidden', String(!opening));
    if (opening && window.gsap) {
      window.gsap.from('.letter-body p', { y: 20, opacity: 0, stagger: 0.15, delay: 0.45, duration: 0.6, ease: 'power2.out' });
      window.gsap.from('.letter-signature', { y: 15, opacity: 0, delay: 1, duration: 0.6, ease: 'power2.out' });
    }
  });
}

function triggerSparkleBurst() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#d99b38', '#a94f5c', '#e6b84f', '#6f2c42']
    });
  }
}

function setupAudio(config) {
  const audio = document.getElementById('ambient-audio');
  const button = document.querySelector('.sound-toggle');
  const enterBtn = document.getElementById('enter-bond');
  if (!audio || !button || config.music?.enabled === false) return;
  if (config.music?.source) audio.src = cleanUrl(config.music.source);

  const toggleMusic = async () => {
    try {
      if (audio.paused) {
        await audio.play();
        button.classList.add('is-playing');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Pause ambient music');
      } else {
        audio.pause();
        button.classList.remove('is-playing');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Play ambient music');
      }
    } catch (_) {}
  };

  button.addEventListener('click', toggleMusic);
  enterBtn?.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        button.classList.add('is-playing');
        button.setAttribute('aria-pressed', 'true');
      }).catch(() => {});
    }
  });
}

function setupTilt() {
  const stage = document.querySelector('[data-tilt]');
  if (!stage || !window.matchMedia('(pointer: fine)').matches) return;
  stage.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) translateZ(10px)`;
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  });
}

function setupReplay() {
  document.getElementById('replay-story')?.addEventListener('click', () => {
    SoundFX.playChime();
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function setupScrollProgress() {
  const thread = document.querySelector('.story-progress span');
  if (!thread) return;
  let frameRequested = false;
  const update = () => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    thread.style.transform = `scaleX(${progress})`;
    frameRequested = false;
  };
  const requestUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
}

function setupPetalDust() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('petal-dust');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;
  const reduced = window.matchMedia('(max-width: 760px)').matches;
  const flecks = Array.from({ length: reduced ? 8 : 18 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2.2,
    speed: 0.00008 + Math.random() * 0.0002,
    drift: Math.random() * Math.PI * 2,
    tone: Math.random() > 0.55 ? '169,79,92' : '217,155,56'
  }));

  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    flecks.forEach(fleck => {
      fleck.y += fleck.speed;
      fleck.drift += 0.006;
      if (fleck.y > 1.05) { fleck.y = -0.04; fleck.x = Math.random(); }
      const x = fleck.x * window.innerWidth + Math.sin(fleck.drift) * 18;
      const y = fleck.y * window.innerHeight;
      context.save();
      context.translate(x, y);
      context.rotate(fleck.drift);
      context.fillStyle = `rgba(${fleck.tone},.34)`;
      context.beginPath();
      context.ellipse(0, 0, fleck.size, fleck.size * 1.8, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

function safelyGetPathLength(path) { try { return path?.getTotalLength() || 0; } catch (_) { return 0; } }
function cleanText(value, fallback) { return typeof value === 'string' && value.trim() ? value.trim() : fallback; }
function cleanUrl(value) { return typeof value === 'string' && value.trim() ? value.trim() : ''; }
function setText(id, value) { const element = document.getElementById(id); if (element) element.textContent = value; }
function setImage(id, source, alt) { const element = document.getElementById(id); if (element && source) { element.src = source; element.alt = alt; } }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
function escapeAttr(value) { return escapeHtml(value); }
