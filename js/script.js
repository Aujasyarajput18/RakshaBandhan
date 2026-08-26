/**
 * ==========================================================================
 * script.js — MASTER SIBLING STORYTELLING & INTERACTIVE MOTION ENGINE
 * Features: Lenis Smooth Scroll, GSAP ScrollTrigger, 3D Tilt Physics,
 * Particle Canvas, Audio Synthesizer, Quiz Duel, Wax Seal Letter, Virtual Rakhi.
 * ==========================================================================
 */

// ── Web Audio Synthesizer Engine (100% Zero-Dependency Reliable Sound FX) ──
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
            const t = this.ctx.currentTime + (idx * 0.04);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 1.85);
        });
    },
    playWaxCrack() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.19);
    },
    playPop() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, t);
        osc.frequency.exponentialRampToValueAtTime(920, t + 0.08);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Lenis Smooth Scrolling
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 2. Load and Hydrate Dynamic Config
    const config = await loadRakhiConfig();
    hydrateStoryDOM(config);

    // 3. Setup Custom Cursor & Background Particles
    setupCustomCursor();
    setupParticleCanvas();

    // 4. Setup Intro Screen Gate
    setupIntroGate();

    // 5. Setup Interactive Quiz
    setupSiblingQuiz(config);

    // 6. Setup Interactive Puja Thali
    setupThaliInteractions(config);

    // 7. Setup Royal Wax Seal Letter
    setupWaxSealLetter();

    // 8. Setup Signature "Tie The Rakhi" Ceremony
    setupTieRakhiCeremony();

    // 9. Setup Audio & Export Handlers
    setupAudioSystem(config);
    setupExportAndSharing(config, lenis);

    // 10. Setup GSAP Entrance Transitions
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initScrollAnimations();
    }
});

/**
 * Hydrates DOM with config data
 */
function hydrateStoryDOM(config) {
    const sister = config.names?.sister || "Ananya";
    const brother = config.names?.brother || "Aarav";

    const heroNames = document.getElementById('hero-sibling-names');
    if (heroNames) heroNames.textContent = `${sister.toUpperCase()} × ${brother.toUpperCase()}`;

    const finaleNames = document.getElementById('finale-sibling-banner');
    if (finaleNames) finaleNames.textContent = `${sister.toUpperCase()} & ${brother.toUpperCase()}`;

    const tagline = document.getElementById('hero-tagline-text');
    if (tagline && config.hero?.tagline) {
        tagline.textContent = `${config.hero.tagline.toUpperCase()} ${config.hero.subtagline ? config.hero.subtagline.toUpperCase() : ''}`;
    }

    // Memories Grid
    const memoriesList = document.getElementById('memories-grid-list');
    if (memoriesList && config.memories && Array.isArray(config.memories)) {
        memoriesList.innerHTML = config.memories.map((m, i) => `
            <div class="luxury-memory-card" data-idx="${i}">
                <div class="card-image-wrap">
                    <img src="${m.image || 'assets/images/demo/img1.svg'}" alt="${m.title}">
                </div>
                <div class="card-era-badge">${m.year || `Era 0${i+1}`}</div>
                <h3 class="card-title">${m.title}</h3>
                <p class="card-desc">${m.description}</p>
            </div>
        `).join('');
    }

    // Letter
    const salutation = document.getElementById('letter-salutation');
    const paragraphs = document.getElementById('letter-body-paragraphs');
    const signature = document.getElementById('letter-signature');

    if (salutation && config.letter?.salutation) salutation.textContent = config.letter.salutation;
    if (paragraphs && config.letter?.bodyParagraphs) {
        paragraphs.innerHTML = config.letter.bodyParagraphs.map(p => `<p style="margin-bottom:18px;">${p}</p>`).join('');
    }
    if (signature && config.letter?.signoff) signature.textContent = config.letter.signoff;

    // Vows Grid
    const vowsList = document.getElementById('vows-grid-list');
    if (vowsList && config.vows && Array.isArray(config.vows)) {
        vowsList.innerHTML = config.vows.map(v => `
            <div class="luxury-vow-card">
                <span class="vow-badge-icon">${v.icon || '🛡️'}</span>
                <h4 class="vow-card-title">${v.title}</h4>
                <p class="vow-card-desc">${v.desc}</p>
            </div>
        `).join('');
    }
}

/**
 * Intro Gate Screen
 */
function setupIntroGate() {
    const gate = document.getElementById('cinematic-intro-gate');
    const enterBtn = document.getElementById('btn-enter-experience');
    const audio = document.getElementById('festive-audio');
    const visBars = document.getElementById('audio-vis-bars');

    enterBtn?.addEventListener('click', () => {
        SoundFX.playChime();
        gate?.classList.add('gate-opened');

        // Play festive audio
        if (audio) {
            audio.play().then(() => {
                visBars?.classList.add('is-playing');
            }).catch(e => console.warn("Audio autoplay blocked:", e));
        }
    });
}

/**
 * Desktop Custom Cursor
 */
function setupCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('button, a, .luxury-memory-card, .thali-node, .wax-seal-button');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}

/**
 * Background Particle Dust
 */
function setupParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * -0.4 - 0.1,
        speedX: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.6 + 0.2
    }));

    function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y < 0) p.y = height;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229, 185, 92, ${p.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffd54f';
            ctx.fill();
        });
        requestAnimationFrame(render);
    }
    render();
}

/**
 * Sibling Menace Quiz
 */
function setupSiblingQuiz(config) {
    const btnSister = document.getElementById('btn-vote-sister');
    const btnBrother = document.getElementById('btn-vote-brother');
    const qText = document.getElementById('quiz-question-text');
    const feedback = document.getElementById('quiz-feedback-text');

    const sisterName = config.names?.sister || "Sister";
    const brotherName = config.names?.brother || "Brother";

    if (btnSister) btnSister.textContent = `${sisterName.toUpperCase()} 👧`;
    if (btnBrother) btnBrother.textContent = `${brotherName.toUpperCase()} 👦`;

    const disputes = [
        { q: "Who stole food from the fridge at 2:00 AM? 🍫", winner: sisterName, remark: "Caught red-handed with the chocolates! 🍫" },
        { q: "Who gets angry first in an argument? 😤", winner: brotherName, remark: "Zero chill, 100% drama! ⚡" },
        { q: "Who is Mom's favorite child? 🏆", winner: brotherName, remark: "A fiercely debated family mystery! 👑" },
        { q: "Who threw the first remote control? 📺", winner: sisterName, remark: "Aggressive TV scheduling tactics! 🎮" },
        { q: "Who says sorry first? 🕊️", winner: brotherName, remark: "Peace restored in record time! 🤍" }
    ];
    let disputeIdx = 0;

    function handleVote(choice) {
        SoundFX.playPop();
        triggerConfettiBurst();

        const current = disputes[disputeIdx];
        if (feedback) {
            feedback.textContent = `🎯 Voted for ${choice.toUpperCase()}! ${current.remark}`;
        }

        setTimeout(() => {
            disputeIdx = (disputeIdx + 1) % disputes.length;
            if (qText) qText.textContent = disputes[disputeIdx].q;
        }, 2200);
    }

    btnSister?.addEventListener('click', () => handleVote(sisterName));
    btnBrother?.addEventListener('click', () => handleVote(brotherName));
}

/**
 * Interactive Puja Thali
 */
function setupThaliInteractions(config) {
    const nodes = document.querySelectorAll('.thali-node, .thali-center-flame');
    const titleEl = document.getElementById('thali-item-title');
    const descEl = document.getElementById('thali-item-desc');
    const thaliElements = config.thali?.elements || {
        rakhi: { label: "Rakhi", meaning: "A sacred promise of eternal protection." },
        diya: { label: "Aarti Diya", meaning: "A divine light guiding our path through every darkness." },
        kumkum: { label: "Roli Kumkum", meaning: "An auspicious blessing for longevity and good health." },
        rice: { label: "Akshat Rice", meaning: "Sacred grains of unbroken prosperity and peace." },
        sweets: { label: "Mithai", meaning: "A little sweetness to celebrate life's joyful moments." },
        flowers: { label: "Marigold Petals", meaning: "A lifetime of vibrant, fragrant memories." }
    };

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const key = node.getAttribute('data-key');
            const data = thaliElements[key];
            if (!data) return;

            SoundFX.playPop();
            if (titleEl) titleEl.textContent = `✨ ${data.label}`;
            if (descEl) descEl.textContent = `"${data.meaning}"`;
        });
    });
}

/**
 * Royal Wax Seal Letter
 */
function setupWaxSealLetter() {
    const sealBtn = document.getElementById('btn-break-seal');
    const closedView = document.getElementById('envelope-closed-view');
    const openedView = document.getElementById('parchment-opened-view');

    sealBtn?.addEventListener('click', () => {
        SoundFX.playWaxCrack();
        triggerConfettiBurst();

        if (closedView) closedView.style.display = 'none';
        if (openedView) openedView.style.display = 'block';
        SoundFX.playChime();
    });
}

/**
 * Signature "Tie The Rakhi" Ceremony
 */
function setupTieRakhiCeremony() {
    const btnTie = document.getElementById('btn-tie-rakhi');
    const stage = document.getElementById('wrist-canvas-zone');
    const rakhi = document.getElementById('ceremony-rakhi-piece');

    btnTie?.addEventListener('click', () => {
        SoundFX.playChime();
        triggerConfettiBurst();

        if (stage) stage.classList.add('is-tied');
        if (rakhi) {
            rakhi.style.transform = 'scale(1.15) rotate(5deg)';
            rakhi.style.filter = 'drop-shadow(0 0 32px rgba(255, 215, 0, 1))';
        }
        if (btnTie) btnTie.textContent = "✅ Rakhi Tied. Promise Kept. 🪔✨";
    });
}

/**
 * GSAP Scroll Animations
 */
function initScrollAnimations() {
    gsap.utils.toArray('.story-section').forEach(section => {
        gsap.from(section.querySelectorAll('.section-eyebrow, .section-headline, .section-tagline, .luxury-memory-card, .quiz-glass-card, .thali-stage-box, .envelope-closed-state, .ceremony-card-stage, .finale-celebration-card'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    });
}

/**
 * Export & Sharing
 */
function setupExportAndSharing(config, lenis) {
    const btnDownload = document.getElementById('btn-download-keepsake');
    const btnNavDownload = document.getElementById('btn-nav-download');
    const btnShareWA = document.getElementById('btn-share-whatsapp');
    const btnReplay = document.getElementById('btn-replay-story');

    const sister = config.names?.sister || "Sister";
    const brother = config.names?.brother || "Brother";

    async function exportKeepsakeCard() {
        const poster = document.getElementById('hero-poster-card');
        if (!poster) return;

        SoundFX.playChime();
        try {
            if (window.html2canvas) {
                const canvas = await html2canvas(poster, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                });
                const link = document.createElement('a');
                link.download = `RakshaBandhan_${sister}_${brother}_2026.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        } catch (err) {
            console.error("Download keepsake error:", err);
        }
    }

    [btnDownload, btnNavDownload].forEach(b => b?.addEventListener('click', exportKeepsakeCard));

    btnShareWA?.addEventListener('click', () => {
        const url = window.location.href;
        const text = encodeURIComponent(`🪔 Happy Raksha Bandhan! ✨\n\nI personalized this sacred interactive digital tribute for ${sister} & ${brother}:\n\n${url}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });

    btnReplay?.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Confetti Burst
 */
function triggerConfettiBurst() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.65 },
            colors: ['#e5b95c', '#b71c1c', '#fff4d0', '#d97706', '#2e7d32']
        });
    }
}

/**
 * Audio System
 */
function setupAudioSystem(config) {
    const audio = document.getElementById('festive-audio');
    const btnMusic = document.getElementById('btn-nav-music');
    const visBars = document.getElementById('audio-vis-bars');

    if (config.music?.source && audio) audio.src = config.music.source;

    let isPlaying = false;
    btnMusic?.addEventListener('click', () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            if (visBars) visBars.classList.remove('is-playing');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                if (visBars) visBars.classList.add('is-playing');
            }).catch(e => console.warn("Audio play prevented:", e));
        }
    });
}
