/**
 * script.js
 * Main Interaction & Screen Router Controller for Raksha Bandhan 3D Web Experience
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Dynamic Config from URL Hash (#data=...), JSON (?g=...), or Demo Defaults
    const config = await loadRakhiConfig();
    applyConfigToDOM(config);

    window.isTunnelActive = true;

    // Prevent scrolling while 3D tunnel is active
    window.addEventListener('wheel', (e) => {
        if (window.isTunnelActive) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, { passive: false, capture: true });

    window.addEventListener('touchmove', (e) => {
        if (window.isTunnelActive) {
            e.stopPropagation();
        }
    }, { passive: false, capture: true });

    window.scrollTo(0, 0);

    // Initialize StringTune for Kinetic Scroll Text
    if (window.StringTune && typeof StringTune.StringTune !== 'undefined') {
        try {
            const stringTune = StringTune.StringTune.getInstance();
            window.StringTuneContext = stringTune;
            stringTune.use(StringTune.StringSplit);
            stringTune.use(StringTune.StringProgress);
            stringTune.start(0);
        } catch (err) {
            console.warn("StringTune init notice:", err);
        }
    }

    // Interactive Modules Init
    if (typeof initThaliBuilder === 'function') initThaliBuilder();
    if (typeof initRakhiCeremony === 'function') initRakhiCeremony();

    // DOM Elements
    const screen0 = document.getElementById('screen-0');
    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const screen3 = document.getElementById('screen-3');
    const screenLetter = document.getElementById('screen-letter');
    const screenReadLetter = document.getElementById('screen-read-letter');
    const screenThali = document.getElementById('screen-thali');
    const screenThaliServe = document.getElementById('screen-thali-serve');
    const screenWheel = document.getElementById('screen-wheel');
    const screenCeremony = document.getElementById('screen-ceremony');
    const screenFinale = document.getElementById('screen-finale');

    const scrollContainer = document.getElementById('scroll-container');
    const btnOpenGiftBox = document.getElementById('btn-open-gift-box');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    // Envelope & Letters
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeBox = document.getElementById('envelope-box');
    const btnNextScrapbook = document.getElementById('btn-next-scrapbook');

    // Wheel
    const spinWheel = document.getElementById('spin-wheel');
    const btnSpinWheel = document.getElementById('btn-spin-wheel');
    const wheelResultContainer = document.getElementById('wheel-result-container');
    const wheelResultText = document.getElementById('wheel-result-text');
    const btnNextWheel = document.getElementById('btn-next-wheel');

    // Next Buttons
    const btnNextThaliCelebrate = document.getElementById('btn-next-thali-celebrate');
    const btnNextCeremony = document.getElementById('btn-next-ceremony');

    // Back Buttons
    const btnBackEnvelope = document.getElementById('btn-back-envelope');
    const btnBackScrapbook = document.getElementById('btn-back-scrapbook');
    const btnBackThali = document.getElementById('btn-back-thali');
    const btnBackThaliServe = document.getElementById('btn-back-thali-serve');
    const btnBackWheel = document.getElementById('btn-back-wheel');
    const btnBackCeremony = document.getElementById('btn-back-ceremony');

    // Audio & Finale
    const festiveAudio = document.getElementById('festive-audio');
    const btnPlayMusic = document.getElementById('btn-play-music');
    const vinylDisc = document.getElementById('vinyl-disc');
    const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
    const btnReplay = document.getElementById('btn-replay');

    // --- Screen Router Utility ---
    function switchScreen(currentScreen, nextScreen) {
        if (!nextScreen) return;
        if (currentScreen) currentScreen.classList.remove('active');
        nextScreen.classList.add('active');

        // Reset scroll when exiting Screen 1
        if (currentScreen === screen1) {
            window.scrollTo(0, 0);
            document.body.style.overflowY = 'hidden';
            if (scrollContainer) scrollContainer.style.display = 'none';
        }
    }

    // --- Screen 0: 3D Tunnel Callback -> Screen 1 ---
    if (typeof initTunnel === 'function') {
        initTunnel('screen-0', () => {
            screen0.classList.remove('active');
            setTimeout(() => { screen0.style.display = 'none'; }, 1000);
            screen1.classList.add('active');
            if (scrollContainer) scrollContainer.style.display = 'block';
            document.body.style.overflowY = 'auto';
            window.isTunnelActive = false;
            window.scrollTo(0, 0);
            spawnMarigoldPetals();
            window.dispatchEvent(new Event('scroll'));
        });
    } else {
        screen0.style.display = 'none';
        screen1.classList.add('active');
        if (scrollContainer) scrollContainer.style.display = 'block';
        document.body.style.overflowY = 'auto';
        window.isTunnelActive = false;
    }

    // --- Falling Marigold Petals Rain ---
    function spawnMarigoldPetals() {
        const container = document.getElementById('parallax-container');
        if (!container) return;
        for (let i = 0; i < 22; i++) {
            const petal = document.createElement('div');
            petal.className = 'marigold-petal';
            const size = 10 + Math.random() * 12;
            petal.style.cssText = `
                left: ${Math.random() * 100}%;
                top: -30px;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${5 + Math.random() * 6}s;
                animation-delay: ${Math.random() * 7}s;
            `;
            container.appendChild(petal);
        }
    }

    // --- Parallax Scroll Interpolation ---
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
    const mapRange = (val, inMin, inMax, outMin, outMax) => {
        if (val <= inMin) return outMin;
        if (val >= inMax) return outMax;
        return outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin));
    };

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!screen1.classList.contains('active')) return;
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateParallaxScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    function updateParallaxScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const p = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;

        const scrollPrompt = document.getElementById('scroll-prompt');
        const heroLayer = document.getElementById('hero-layer');
        const finaleBoxLayer = document.getElementById('finale-box-layer');

        if (scrollPrompt) {
            scrollPrompt.style.opacity = mapRange(p, 0.04, 0.15, 1, 0);
        }

        if (heroLayer) {
            heroLayer.style.opacity = mapRange(p, 0, 0.18, 1, 0);
            heroLayer.style.transform = `translateY(${mapRange(p, 0, 0.18, 0, -60)}px)`;
        }

        if (finaleBoxLayer) {
            const btnOpacity = mapRange(p, 0.92, 0.99, 0, 1);
            const btnScale = mapRange(p, 0.92, 0.99, 0.6, 1);
            finaleBoxLayer.style.opacity = btnOpacity;
            finaleBoxLayer.style.transform = `scale(${btnScale})`;
            finaleBoxLayer.style.pointerEvents = p > 0.95 ? 'auto' : 'none';
        }

        // Fire festive celebration pop near bottom
        if (p > 0.96 && !window.hasFiredScrollPop) {
            window.hasFiredScrollPop = true;
            fireFestiveConfetti();
        } else if (p < 0.9) {
            window.hasFiredScrollPop = false;
        }
    }

    // --- Screen 1 -> Screen 2 (Gift Box Click) ---
    if (btnOpenGiftBox) {
        btnOpenGiftBox.addEventListener('click', () => {
            switchScreen(screen1, screen2);
        });
    }

    // --- Screen 2: Playful Dodging NO Button ---
    const noPhrases = config.noPhrases || [
        "Tujhe remote nahi dungi! 📺",
        "Chocolates sab meri! 🍫",
        "Mom ko sab sach bata dunga! 🤫",
        "Rakhi ka shagun cut! 💸",
        "Achha maan bhi jao! 🥺",
        "Pakka promise! ❤️"
    ];
    let noHoverCount = 0;

    function dodgeNoBtn() {
        btnNo.innerText = noPhrases[noHoverCount % noPhrases.length];
        noHoverCount++;

        const randomX = (Math.random() * 220 - 110);
        const randomY = (Math.random() * 120 - 60);
        btnNo.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    btnNo.addEventListener('mouseover', dodgeNoBtn);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeNoBtn();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeNoBtn();
    });

    // Screen 2 -> Screen 3 (YES Click)
    btnYes.addEventListener('click', () => {
        fireFestiveConfetti();
        switchScreen(screen2, screen3);
    });

    // --- Screen 3: Sibling Gift Selection Hub ---
    const hubItems = document.querySelectorAll('.hub-item');
    hubItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            if (action === 'letter') switchScreen(screen3, screenLetter);
            else if (action === 'thali') switchScreen(screen3, screenThali);
            else if (action === 'wheel') switchScreen(screen3, screenWheel);
            else if (action === 'ceremony') switchScreen(screen3, screenCeremony);
        });
    });

    // --- Screen 4: Prem Patra (Envelope & Scrapbook) ---
    if (envelopeWrapper && envelopeBox) {
        envelopeWrapper.addEventListener('click', () => {
            envelopeBox.classList.add('open');
            setTimeout(() => {
                switchScreen(screenLetter, screenReadLetter);
            }, 1200);
        });
    }

    if (btnNextScrapbook) {
        btnNextScrapbook.addEventListener('click', () => {
            switchScreen(screenReadLetter, screenFinale);
        });
    }

    // --- Screen 6: Sibling Promise Wheel ---
    let isWheelSpinning = false;
    let wheelRotation = 0;
    const promisePrizes = config.promises || [
        "Midnight Maggi Cooked Anytime 🍜",
        "Shopping Spree Fully Paid 🛍️",
        "Remote Control for a Week 📺",
        "All Secrets Safe Forever 🤐",
        "One Wish Granted Unconditionally ✨",
        "Unlimited Hugs & Chai Treats ☕"
    ];

    if (btnSpinWheel) {
        btnSpinWheel.addEventListener('click', () => {
            if (isWheelSpinning) return;
            isWheelSpinning = true;
            if (wheelResultContainer) wheelResultContainer.classList.add('hidden');

            const fullSpins = Math.floor(Math.random() * 4) + 4; // 4 to 7 full spins
            const randomExtraAngle = Math.floor(Math.random() * 360);
            wheelRotation += (fullSpins * 360) + randomExtraAngle;

            spinWheel.style.transform = `rotate(${wheelRotation}deg)`;

            setTimeout(() => {
                isWheelSpinning = false;
                const pointerAngle = (360 - (wheelRotation % 360)) % 360;
                const sliceIndex = Math.floor(pointerAngle / 60) % promisePrizes.length;
                const wonPromise = promisePrizes[sliceIndex];

                if (wheelResultText && wheelResultContainer) {
                    wheelResultText.innerHTML = `Won Promise:<br><strong>${wonPromise}</strong>`;
                    wheelResultContainer.classList.remove('hidden');
                }

                fireFestiveConfetti();
                if (btnNextWheel) btnNextWheel.classList.remove('hidden');
            }, 4000);
        });
    }

    if (btnNextWheel) {
        btnNextWheel.addEventListener('click', () => {
            switchScreen(screenWheel, screenFinale);
        });
    }

    if (btnNextThaliCelebrate) {
        btnNextThaliCelebrate.addEventListener('click', () => {
            switchScreen(screenThaliServe, screenFinale);
        });
    }

    if (btnNextCeremony) {
        btnNextCeremony.addEventListener('click', () => {
            switchScreen(screenCeremony, screenFinale);
        });
    }

    // --- Back Button Navigation ---
    if (btnBackEnvelope) btnBackEnvelope.addEventListener('click', () => switchScreen(screenLetter, screen3));
    if (btnBackScrapbook) btnBackScrapbook.addEventListener('click', () => {
        if (envelopeBox) envelopeBox.classList.remove('open');
        switchScreen(screenReadLetter, screen3);
    });
    if (btnBackThali) btnBackThali.addEventListener('click', () => switchScreen(screenThali, screen3));
    if (btnBackThaliServe) btnBackThaliServe.addEventListener('click', () => switchScreen(screenThaliServe, screen3));
    if (btnBackWheel) btnBackWheel.addEventListener('click', () => switchScreen(screenWheel, screen3));
    if (btnBackCeremony) btnBackCeremony.addEventListener('click', () => switchScreen(screenCeremony, screen3));

    // --- Screen 8: Grand Finale & Musical Tribute Init ---
    let finaleInitialized = false;
    function initGrandFinale() {
        if (finaleInitialized) return;
        finaleInitialized = true;

        // 1. Floating Golden Diya Bokeh Particles
        const bokehContainer = document.getElementById('finale-bokeh');
        if (bokehContainer) {
            const bokehGradients = [
                'rgba(255, 215, 0, 0.45)',
                'rgba(244, 163, 0, 0.4)',
                'rgba(230, 81, 0, 0.35)',
                'rgba(255, 245, 157, 0.5)'
            ];
            for (let i = 0; i < 25; i++) {
                const b = document.createElement('div');
                b.className = 'bokeh-particle';
                const size = Math.random() * 50 + 18;
                b.style.cssText = `
                    width: ${size}px; height: ${size}px;
                    left: ${Math.random() * 100}%;
                    bottom: ${Math.random() * 20 - 10}%;
                    background: ${bokehGradients[Math.floor(Math.random() * bokehGradients.length)]};
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    animation-duration: ${8 + Math.random() * 10}s;
                    animation-delay: ${Math.random() * 8}s;
                `;
                bokehContainer.appendChild(b);
            }
        }

        // 2. Photo Slideshow Carousel
        const finalePortrait = document.getElementById('finale-portrait-img');
        const photoList = config.photos && config.photos.length > 0 ? config.photos : [
            'assets/images/demo/img1.svg',
            'assets/images/demo/img2.svg',
            'assets/images/demo/img3.svg',
            'assets/images/demo/img4.svg',
            'assets/images/demo/img5.svg',
            'assets/images/demo/img6.svg'
        ];

        if (finalePortrait && photoList.length > 0) {
            let currentPhotoIdx = 0;
            finalePortrait.src = photoList[0];

            setInterval(() => {
                finalePortrait.classList.add('fade-out');
                setTimeout(() => {
                    currentPhotoIdx = (currentPhotoIdx + 1) % photoList.length;
                    finalePortrait.src = photoList[currentPhotoIdx];
                    finalePortrait.classList.remove('fade-out');
                }, 800);
            }, 3500);
        }

        fireFestiveConfetti();

        // 3. Audio Auto-Play Attempt
        if (festiveAudio) {
            festiveAudio.volume = 0.75;
            festiveAudio.play().then(() => {
                updateAudioUI(true);
            }).catch(() => {
                // Auto-play prevented by browser policy; user can click Play
                console.log("Audio autoplay waiting for user interaction.");
            });
        }
    }

    // Observer to detect when Screen 8 becomes active
    const finaleObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && screenFinale.classList.contains('active')) {
                initGrandFinale();
                finaleObserver.disconnect();
            }
        }
    });
    if (screenFinale) finaleObserver.observe(screenFinale, { attributes: true, attributeFilter: ['class'] });

    // --- Audio Player Toggle & Fallback Synth ---
    if (btnPlayMusic && festiveAudio) {
        btnPlayMusic.addEventListener('click', () => {
            if (festiveAudio.paused) {
                festiveAudio.play().then(() => {
                    updateAudioUI(true);
                }).catch(() => {
                    // Fallback to Web Audio Ambient Harmony
                    playAmbientSynth();
                    updateAudioUI(true);
                });
            } else {
                festiveAudio.pause();
                updateAudioUI(false);
            }
        });
    }

    function updateAudioUI(isPlaying) {
        const icon = document.getElementById('play-icon');
        if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
        if (vinylDisc) {
            if (isPlaying) vinylDisc.classList.add('playing');
            else vinylDisc.classList.remove('playing');
        }
    }

    // Web Audio API Ambient Harmonizer Fallback
    let audioCtx = null;
    function playAmbientSynth() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        // Auspicious Tanpura/Bansuri harmony chord: Sa (261.63Hz), Pa (392.00Hz), Sa' (523.25Hz)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
        });
    }

    // --- 1-Click WhatsApp Share Generator ---
    if (btnShareWhatsapp) {
        btnShareWhatsapp.addEventListener('click', () => {
            const sister = config.sisterName || 'Sister';
            const brother = config.senderName || 'Brother';
            const currentUrl = window.location.href;
            const message = `🪔 *Happy Raksha Bandhan, ${sister}!* ❤️\n\nHere is a 3D sacred gift created especially for you with our cherished memories, promises, and sweet blessings!\n\nOpen your Rakhi Gift here:\n${currentUrl}\n\n- With love from ${brother} ✨`;
            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });
    }

    // --- Replay Button ---
    if (btnReplay) {
        btnReplay.addEventListener('click', () => {
            if (festiveAudio) {
                festiveAudio.pause();
                festiveAudio.currentTime = 0;
            }
            window.location.reload();
        });
    }
});

// --- Dynamic Config Applicator ---
function applyConfigToDOM(cfg) {
    if (!cfg) return;

    // Kinetic Rows
    if (cfg.kineticRows && cfg.kineticRows.length >= 4) {
        const r1 = document.getElementById('kinetic-row-1');
        const r2 = document.getElementById('kinetic-row-2');
        const r3 = document.getElementById('kinetic-row-3');
        const r4 = document.getElementById('kinetic-row-4');
        if (r1) r1.innerText = cfg.kineticRows[0];
        if (r2) r2.innerText = cfg.kineticRows[1];
        if (r3) r3.innerText = cfg.kineticRows[2];
        if (r4) r4.innerText = cfg.kineticRows[3];
    }

    // Hero zone
    const heroTitle = document.getElementById('hero-title-text');
    const heroSubtitle = document.getElementById('hero-subtitle-text');
    const heroImg = document.getElementById('hero-portrait-img');
    if (heroTitle) heroTitle.innerText = cfg.heroTitle || `HAPPY RAKSHA BANDHAN, ${cfg.sisterName || ''}`;
    if (heroSubtitle) heroSubtitle.innerText = cfg.heroSubtitle || "To the best sister in the entire universe ❤️";
    if (heroImg && cfg.heroImage) heroImg.src = cfg.heroImage;

    // Envelope
    const envelopeName = document.getElementById('envelope-sister-name');
    if (envelopeName) envelopeName.innerText = `Dearest ${cfg.sisterName || 'Sister'} ❤️`;

    // Letter
    if (cfg.letter) {
        const lSalutation = document.getElementById('letter-salutation');
        const lHeading = document.getElementById('letter-heading');
        const lParagraphs = document.getElementById('letter-paragraphs');
        const lSignature = document.getElementById('letter-signature');

        if (lSalutation) lSalutation.innerText = cfg.letter.salutation || `Dearest ${cfg.sisterName || 'Sister'},`;
        if (lHeading) lHeading.innerText = cfg.letter.heading || "Happy Raksha Bandhan to my favorite crime partner! 🪔❤️";
        if (lParagraphs && cfg.letter.bodyParagraphs) {
            lParagraphs.innerHTML = cfg.letter.bodyParagraphs.map(p => `<p>${p}</p>`).join('');
        }
        if (lSignature) lSignature.innerText = cfg.letter.signoff || `Forever your loving Bhai, ${cfg.senderName || 'Aarav'} ❤️`;
    }

    // Polaroids
    if (cfg.photos && cfg.photos.length >= 4) {
        const p1 = document.querySelector('.p-img-1');
        const p2 = document.querySelector('.p-img-2');
        const p3 = document.querySelector('.p-img-3');
        const p4 = document.querySelector('.p-img-4');
        if (p1 && cfg.photos[0]) p1.src = cfg.photos[0];
        if (p2 && cfg.photos[1]) p2.src = cfg.photos[1];
        if (p3 && cfg.photos[2]) p3.src = cfg.photos[2];
        if (p4 && cfg.photos[3]) p4.src = cfg.photos[3];
    }

    // Wheel Slice Labels
    const wheelLabelsContainer = document.getElementById('wheel-slice-labels');
    if (wheelLabelsContainer && cfg.promises) {
        wheelLabelsContainer.innerHTML = '';
        cfg.promises.forEach((pText, i) => {
            const span = document.createElement('span');
            span.className = `wheel-label label-${i + 1}`;
            span.innerText = pText;
            wheelLabelsContainer.appendChild(span);
        });
    }

    // Finale
    const finaleHeadline = document.getElementById('finale-headline-text');
    const finaleSubheading = document.getElementById('finale-subheading-text');
    if (finaleHeadline) finaleHeadline.innerText = `HAPPY RAKSHA BANDHAN, ${cfg.sisterName || 'DEAREST SISTER'}! 🪔`;
    if (finaleSubheading) finaleSubheading.innerText = `Sacred prayers, lifelong protection & deepest love from ${cfg.senderName || 'Brother'}`;

    // Music Meta
    const musicTitle = document.getElementById('music-title-text');
    const musicArtist = document.getElementById('music-artist-text');
    if (musicTitle && cfg.musicTitle) musicTitle.innerText = cfg.musicTitle;
    if (musicArtist && cfg.musicArtist) musicArtist.innerText = cfg.musicArtist;
}

// Global Confetti Burst Utility
function fireFestiveConfetti() {
    if (typeof confetti !== 'function') return;
    const colors = ['#ffd700', '#ff9800', '#d50000', '#ffffff', '#ffeb3b', '#e65100'];
    confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: colors
    });
}
window.fireFestiveConfetti = fireFestiveConfetti;
