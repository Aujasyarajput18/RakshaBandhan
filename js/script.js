/*
 * Rakhi story engine
 * All client-specific content comes from js/config.js (or its shareable URL payload).
 * The animation layer is deliberately small: SVG, CSS, canvas dust, and GSAP only.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const config = typeof window.loadRakhiConfig === 'function'
    ? await window.loadRakhiConfig()
    : (window.rakhiConfig || {});

  const story = hydrateStory(config);
  setupAudio(config);
  setupLetter();
  setupTilt();
  setupReplay();
  setupPetalDust();
  setupScrollProgress();

  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-motion');
    window.gsap.registerPlugin(window.ScrollTrigger);
    setupScrollStory();
  }

  // Updating this attribute makes the personalized version easy to identify in a CMS preview.
  document.body.dataset.siblings = `${story.sister}-${story.brother}`.toLowerCase().replace(/\s+/g, '-');
});

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
    return `<article class="memory-stop">
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

function setupScrollStory() {
  const { gsap, ScrollTrigger } = window;
  const intro = document.querySelector('.intro-scene');
  const introThread = document.getElementById('intro-thread-path');
  const pathLength = safelyGetPathLength(introThread);
  if (introThread && pathLength) gsap.set(introThread, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

  // Initial load entrance
  gsap.from(['.word-happy', '.word-raksha', '.word-bandhan'], {
    y: 35,
    opacity: 0,
    stagger: 0.15,
    duration: 1.1,
    ease: 'power3.out'
  });

  const introTimeline = gsap.timeline({
    scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom bottom', scrub: 0.8 }
  });
  introTimeline
    .to('.intro-prompt', { opacity: 0, y: -20, duration: 0.15 }, 0)
    .to(introThread, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 0)
    .to('.word-happy', { xPercent: -25, yPercent: -15, duration: 0.45, ease: 'none' }, 0)
    .to('.word-raksha', { xPercent: 20, yPercent: -10, duration: 0.45, ease: 'none' }, 0)
    .to('.word-bandhan', { xPercent: -15, yPercent: 20, duration: 0.45, ease: 'none' }, 0)
    .to('.fabric-one', { xPercent: 20, yPercent: -9, duration: 1 }, 0)
    .to('.fabric-two', { xPercent: -20, yPercent: 10, duration: 1 }, 0)
    .to(['.word-happy', '.word-raksha', '.word-bandhan'], { opacity: 0, yPercent: -20, duration: 0.2, stagger: 0.03 }, 0.55)
    .fromTo('.bond-statement', { opacity: 0, yPercent: 25 }, { opacity: 1, yPercent: 0, duration: 0.2 }, 0.62)
    .to('.bond-statement', { opacity: 0, yPercent: -25, duration: 0.15 }, 0.85);

  const enter = document.getElementById('enter-bond');
  enter?.addEventListener('click', () => document.getElementById('her')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  gsap.from('.sister-intro > *', { y: 42, opacity: 0, stagger: .13, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.sister-section', start: 'top 67%' } });
  gsap.from('.portrait-stage', { y: 100, rotate: 7, opacity: 0, duration: 1.25, ease: 'power3.out', scrollTrigger: { trigger: '.sister-section', start: 'top 62%' } });
  gsap.utils.toArray('.memory-photo').forEach((photo, index) => {
    gsap.from(photo, { y: index % 2 ? 130 : 95, x: index % 2 ? 45 : -45, opacity: 0, scale: .88, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: photo, start: 'top 86%' } });
  });
  gsap.from('.remember-intro > *', { y: 40, opacity: 0, stagger: .1, duration: .8, scrollTrigger: { trigger: '.remember-section', start: 'top 72%' } });
  gsap.utils.toArray('.memory-stop').forEach((stop, index) => {
    const card = stop.querySelector('.memory-card');
    gsap.from(card, { x: index % 2 ? 45 : -45, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: stop, start: 'top 80%' } });
  });
  gsap.from('.letter-lead > *', { x: -45, opacity: 0, stagger: .1, duration: .9, scrollTrigger: { trigger: '.letter-section', start: 'top 70%' } });
  gsap.from('.envelope-wrap', { y: 70, rotate: 4, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.letter-section', start: 'top 66%' } });

  const distanceThread = document.getElementById('distance-thread');
  const distanceLength = safelyGetPathLength(distanceThread);
  if (distanceThread && distanceLength) gsap.set(distanceThread, { strokeDasharray: distanceLength, strokeDashoffset: distanceLength });
  const distanceTimeline = gsap.timeline({ scrollTrigger: { trigger: '.distance-section', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  distanceTimeline
    .to('.distance-line-one', { opacity: 1, duration: .18 }, .05)
    .to('.distance-line-one', { opacity: 0, duration: .14 }, .29)
    .to(distanceThread, { strokeDashoffset: 0, duration: .3, ease: 'none' }, .25)
    .to('.city-sister', { x: '14vw', duration: .3, ease: 'none' }, .27)
    .to('.city-brother', { x: '-14vw', duration: .3, ease: 'none' }, .27)
    .to('.distance-line-two', { opacity: 1, duration: .16 }, .42)
    .to('.distance-line-two', { opacity: 0, duration: .13 }, .60)
    .to('.city-sister', { x: '27vw', duration: .22, ease: 'none' }, .55)
    .to('.city-brother', { x: '-27vw', duration: .22, ease: 'none' }, .55)
    .to('.city-sister', { x: '5vw', duration: .18, ease: 'none' }, .73)
    .to('.city-brother', { x: '-5vw', duration: .18, ease: 'none' }, .73)
    .to('.distance-line-three', { opacity: 1, duration: .2 }, .77);

  gsap.from('.finale-rakhi', { scale: .65, opacity: 0, duration: 1.2, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.finale', start: 'top 70%' } });
  gsap.from('.finale h2 span', { y: 42, opacity: 0, stagger: .16, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: '.finale', start: 'top 58%' } });
}

function setupLetter() {
  const envelope = document.getElementById('open-letter');
  const paper = document.getElementById('letter-paper');
  envelope?.addEventListener('click', () => {
    const opening = !envelope.classList.contains('is-open');
    envelope.classList.toggle('is-open', opening);
    paper?.classList.toggle('is-visible', opening);
    envelope.setAttribute('aria-expanded', String(opening));
    paper?.setAttribute('aria-hidden', String(!opening));
    if (opening && window.gsap) window.gsap.from('.letter-body p', { y: 17, opacity: 0, stagger: .14, delay: .5, duration: .55, ease: 'power2.out' });
  });
}

function setupAudio(config) {
  const audio = document.getElementById('ambient-audio');
  const button = document.querySelector('.sound-toggle');
  if (!audio || !button || config.music?.enabled === false) return;
  if (config.music?.source) audio.src = cleanUrl(config.music.source);
  button.addEventListener('click', async () => {
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
    } catch (_) { /* Browser playback policy can decline a failed gesture gracefully. */ }
  });
}

function setupTilt() {
  const stage = document.querySelector('[data-tilt]');
  if (!stage || !window.matchMedia('(pointer: fine)').matches) return;
  stage.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    stage.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
  });
  stage.addEventListener('pointerleave', () => { stage.style.transform = ''; });
}

function setupReplay() {
  document.getElementById('replay-story')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
  let width = 0, height = 0;
  const reduced = window.matchMedia('(max-width: 760px)').matches;
  const flecks = Array.from({ length: reduced ? 7 : 15 }, () => ({ x: Math.random(), y: Math.random(), size: 1 + Math.random() * 2.1, speed: .00007 + Math.random() * .00018, drift: Math.random() * Math.PI * 2, tone: Math.random() > .55 ? '169,79,92' : '217,155,56' }));
  const resize = () => { width = canvas.width = window.innerWidth * devicePixelRatio; height = canvas.height = window.innerHeight * devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  resize(); window.addEventListener('resize', resize, { passive: true });
  const draw = time => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    flecks.forEach(fleck => {
      fleck.y += fleck.speed;
      fleck.drift += .006;
      if (fleck.y > 1.05) { fleck.y = -.04; fleck.x = Math.random(); }
      const x = fleck.x * window.innerWidth + Math.sin(fleck.drift) * 16;
      const y = fleck.y * window.innerHeight;
      context.save(); context.translate(x, y); context.rotate(fleck.drift); context.fillStyle = `rgba(${fleck.tone},.32)`; context.beginPath(); context.ellipse(0, 0, fleck.size, fleck.size * 1.7, 0, 0, Math.PI * 2); context.fill(); context.restore();
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
