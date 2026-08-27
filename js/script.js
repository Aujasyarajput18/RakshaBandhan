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
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6
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

  const finalSignoff = cleanText(config.finale?.signoff || config.letter?.signoff, `Always your brother, ${brother}`);
  const signoff = document.getElementById('finale-signoff');
  if (signoff) signoff.innerHTML = escapeHtml(finalSignoff).replace(/,\s*/, ',<br>');

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
    <figure class="memory-photo" data-photo="${index}">
      <img src="${escapeAttr(photo.url)}" alt="Memory ${index + 1}" loading="lazy">
      <figcaption>${escapeHtml(photo.caption)}</figcaption>
    </figure>
  `).join('');
}

function renderTimeline(memories, photos) {
  const container = document.getElementById('memory-route');
  if (!container) return;
  const defaults = [
    ['2010', 'The first Rakhi', 'Before we knew how much of life we would share.'],
    ['2014', 'The big fight', 'No one remembers why. Both of us remember winning.'],
    ['2018', 'The year we grew up', 'Slightly. At least on paper.'],
    ['2022', 'Different cities', 'New routines, same person on speed dial.'],
    ['2026', 'Still us', 'A little older. Every bit as connected.']
  ];
  const entries = memories.length ? memories.slice(0, 5) : defaults.map(([year, title, description], index) => ({ year, title, description, image: photos[index]?.url }));
  container.innerHTML = entries.map((memory, index) => {
    const defaultItem = defaults[index % defaults.length];
    const year = cleanText(memory.year, defaultItem[0]);
    const title = cleanText(memory.title, defaultItem[1]);
    const description = cleanText(memory.description, defaultItem[2]);
    const image = cleanUrl(memory.image || photos[index]?.url || `assets/images/demo/img${index + 1}.svg`);
    return `<article class="memory-stop" data-step="${index}">
      <span class="memory-node" aria-hidden="true"></span>
      <div class="memory-card">
        <figure><img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy"></figure>
        <p class="memory-year">${escapeHtml(year)}</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
      </div>
    </article>`;
  }).join('');
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

    const toran = document.querySelector('.intro-toran');
    const fabric1 = document.querySelector('.fabric-one');
    const fabric2 = document.querySelector('.fabric-two');
    const mandala = document.querySelector('.intro-mandala');

    if (toran) toran.style.transform = `translateX(calc(-50% + ${x * 0.4}px)) translateY(${y * 0.3}px)`;
    if (fabric1) fabric1.style.transform = `translateX(${x * 0.7}px) translateY(${y * 0.7}px) rotate(-10deg)`;
    if (fabric2) fabric2.style.transform = `translateX(${x * -0.6}px) translateY(${y * -0.6}px)`;
    if (mandala) mandala.style.transform = `translateX(${x * -0.3}px) translateY(${y * -0.3}px)`;
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

  // Chapter 01: Sister Spotlight
  gsap.from('.sister-intro > *', {
    y: 50,
    opacity: 0,
    stagger: 0.14,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 70%' }
  });
  gsap.from('.portrait-stage', {
    y: 110,
    rotate: 9,
    opacity: 0,
    duration: 1.35,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.sister-section', start: 'top 65%' }
  });

  // Chapter 02: Photo Journey River Parallax
  gsap.utils.toArray('.memory-photo').forEach((photo, index) => {
    const isEven = index % 2 === 0;
    gsap.from(photo, {
      y: isEven ? 140 : 100,
      x: isEven ? -40 : 40,
      rotate: isEven ? -12 : 12,
      opacity: 0,
      scale: 0.86,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: photo, start: 'top 88%' }
    });

    gsap.to(photo, {
      yPercent: isEven ? -18 : 18,
      ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });

  // Chapter 03: Remember When Timeline
  gsap.from('.remember-intro > *', {
    y: 45,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    scrollTrigger: { trigger: '.remember-section', start: 'top 72%' }
  });
  gsap.utils.toArray('.memory-stop').forEach((stop, index) => {
    const card = stop.querySelector('.memory-card');
    const node = stop.querySelector('.memory-node');
    const isEven = index % 2 === 0;

    gsap.from(card, {
      x: isEven ? -55 : 55,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: { trigger: stop, start: 'top 82%' }
    });

    gsap.fromTo(node, { scale: 0.4, opacity: 0.3 }, {
      scale: 1.25,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: stop, start: 'top 75%' }
    });
  });

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

  // Chapter 05: Distance Section
  const distanceThread = document.getElementById('distance-thread');
  const distanceLength = safelyGetPathLength(distanceThread);
  if (distanceThread && distanceLength) gsap.set(distanceThread, { strokeDasharray: distanceLength, strokeDashoffset: distanceLength });
  
  const distanceTimeline = gsap.timeline({
    scrollTrigger: { trigger: '.distance-section', start: 'top top', end: 'bottom bottom', scrub: 1 }
  });
  distanceTimeline
    .to('.distance-line-one', { opacity: 1, duration: 0.18 }, 0.05)
    .to('.distance-line-one', { opacity: 0, duration: 0.14 }, 0.28)
    .to(distanceThread, { strokeDashoffset: 0, duration: 0.32, ease: 'none' }, 0.24)
    .to('.city-sister', { x: '14vw', duration: 0.3, ease: 'none' }, 0.26)
    .to('.city-brother', { x: '-14vw', duration: 0.3, ease: 'none' }, 0.26)
    .to('.distance-line-two', { opacity: 1, duration: 0.16 }, 0.42)
    .to('.distance-line-two', { opacity: 0, duration: 0.13 }, 0.60)
    .to('.city-sister', { x: '27vw', duration: 0.22, ease: 'none' }, 0.55)
    .to('.city-brother', { x: '-27vw', duration: 0.22, ease: 'none' }, 0.55)
    .to('.city-sister', { x: '5vw', duration: 0.18, ease: 'none' }, 0.73)
    .to('.city-brother', { x: '-5vw', duration: 0.18, ease: 'none' }, 0.73)
    .to('.distance-line-three', { opacity: 1, duration: 0.2 }, 0.77);

  // Chapter 06: Finale
  gsap.from('.finale-rakhi', {
    scale: 0.6,
    opacity: 0,
    duration: 1.3,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: '.finale', start: 'top 72%' }
  });
  gsap.from('.finale h2 span', {
    y: 45,
    opacity: 0,
    stagger: 0.18,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.finale', start: 'top 60%' }
  });

  ScrollTrigger.refresh();
  window.addEventListener('load', () => ScrollTrigger.refresh());
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
