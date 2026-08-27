/**
 * customize.js — MASTER STORY STUDIO ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form Inputs
    const inputSister = document.getElementById('input-sister-name');
    const inputBrother = document.getElementById('input-brother-name');
    const inputTagline = document.getElementById('input-hero-tagline');
    const inputSalutation = document.getElementById('input-letter-salutation');
    const inputSignoff = document.getElementById('input-letter-signoff');
    const inputBody = document.getElementById('input-letter-body');
    const inputSisterCity = document.getElementById('input-sister-city');
    const inputBrotherCity = document.getElementById('input-brother-city');

    // Live Preview
    const prevNames = document.getElementById('prev-names-display');
    const prevTagline = document.getElementById('prev-tagline-display');
    const prevHeroArt = document.getElementById('prev-hero-art');

    const profilePhotos = {
        sister: "assets/images/demo/portrait.svg",
        brother: "assets/images/demo/img6.svg"
    };

    const photos = [
        "assets/images/demo/img1.svg",
        "assets/images/demo/img2.svg",
        "assets/images/demo/img3.svg",
        "assets/images/demo/img4.svg"
    ];

    function updateLivePreview() {
        const sister = inputSister ? (inputSister.value || "SISTER") : "SISTER";
        const brother = inputBrother ? (inputBrother.value || "BROTHER") : "BROTHER";

        if (prevNames) prevNames.textContent = `${sister.toUpperCase()} × ${brother.toUpperCase()}`;
        if (prevTagline && inputTagline) prevTagline.textContent = (inputTagline.value || "").toUpperCase();
    }

    [inputSister, inputBrother, inputTagline].forEach(inp => {
        inp?.addEventListener('input', updateLivePreview);
        inp?.addEventListener('change', updateLivePreview);
    });

    // Presets
    const presetAnanya = document.getElementById('preset-ananya');
    const presetTaran = document.getElementById('preset-taran');
    const presetBlank = document.getElementById('preset-blank');

    presetAnanya?.addEventListener('click', () => {
        setActivePreset(presetAnanya);
        if (inputSister) inputSister.value = "Ananya";
        if (inputBrother) inputBrother.value = "Aarav";
        if (inputTagline) inputTagline.value = "Some bonds are tied by a thread. Ours was tied long before the Rakhi.";
        if (inputSalutation) inputSalutation.value = "Dearest Ananya,";
        if (inputSignoff) inputSignoff.value = "Forever your loving brother ❤️, Aarav";
        if (inputSisterCity) inputSisterCity.value = "Mumbai";
        if (inputBrotherCity) inputBrotherCity.value = "London";
        updateLivePreview();
    });

    presetTaran?.addEventListener('click', () => {
        setActivePreset(presetTaran);
        if (inputSister) inputSister.value = "Taran Kaur";
        if (inputBrother) inputBrother.value = "Aarav Singh";
        if (inputTagline) inputTagline.value = "A sacred thread of eternal love, unspoken promises & lifelong protection.";
        if (inputSalutation) inputSalutation.value = "Dearest Taran Kaur,";
        if (inputSignoff) inputSignoff.value = "Forever your loving brother ❤️, Aarav";
        if (inputSisterCity) inputSisterCity.value = "Amritsar";
        if (inputBrotherCity) inputBrotherCity.value = "Toronto";
        updateLivePreview();
    });

    presetBlank?.addEventListener('click', () => {
        setActivePreset(presetBlank);
        if (inputSister) inputSister.value = "";
        if (inputBrother) inputBrother.value = "";
        if (inputTagline) inputTagline.value = "";
        if (inputSalutation) inputSalutation.value = "Dearest Sister,";
        updateLivePreview();
    });

    function setActivePreset(btn) {
        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // Profile photos are deliberately separate from shared memories: the story uses
    // both at the distance scene and the sister portrait uses the sister photo.
    ["sister", "brother"].forEach(role => {
        const fileInput = document.getElementById(`file-profile-${role}`);
        const imgPrev = document.getElementById(`prev-profile-${role}`);

        fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const compressedBase64 = await compressImage(file, 640, 640, 0.78);
            profilePhotos[role] = compressedBase64;
            if (imgPrev) imgPrev.src = compressedBase64;
            if (role === "sister" && prevHeroArt) prevHeroArt.src = compressedBase64;
        });
    });

    // Shared memory photo compression
    [0, 1, 2, 3].forEach(idx => {
        const fileInput = document.getElementById(`file-${idx}`);
        const imgPrev = document.getElementById(`prev-${idx}`);

        fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const compressedBase64 = await compressImage(file, 400, 400, 0.72);
            photos[idx] = compressedBase64;
            if (imgPrev) imgPrev.src = compressedBase64;
        });
    });

    function compressImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    if (width > height) {
                        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
                    } else {
                        if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/webp', quality));
                };
            };
        });
    }

    // Link Generation
    const btnGenerate = document.getElementById('btn-generate-link');
    const linkBox = document.getElementById('link-box');
    const outputUrl = document.getElementById('output-url');
    const btnCopy = document.getElementById('btn-copy-url');
    const hubExtra = document.getElementById('hub-extra-actions');
    const btnShareWA = document.getElementById('btn-share-wa');
    const btnTestLive = document.getElementById('btn-test-live');

    btnGenerate?.addEventListener('click', () => {
        const bodyText = inputBody ? inputBody.value : "";
        const bodyParagraphs = bodyText.split('\n\n').filter(p => p.trim() !== "");

        const payload = {
            names: {
                sister: inputSister ? inputSister.value : "Ananya",
                brother: inputBrother ? inputBrother.value : "Aarav"
            },
            profiles: {
                sister: {
                    photo: profilePhotos.sister,
                    city: inputSisterCity ? inputSisterCity.value : "Mumbai"
                },
                brother: {
                    photo: profilePhotos.brother,
                    city: inputBrotherCity ? inputBrotherCity.value : "London"
                }
            },
            hero: {
                tagline: inputTagline ? inputTagline.value : "Some bonds are tied by a thread.",
                sisterPhoto: profilePhotos.sister,
                brotherPhoto: profilePhotos.brother
            },
            letter: {
                salutation: inputSalutation ? inputSalutation.value : "Dearest Sister,",
                bodyParagraphs: bodyParagraphs,
                signoff: inputSignoff ? inputSignoff.value : "With all my love ❤️"
            },
            distanceSection: {
                enabled: true,
                sisterCity: inputSisterCity ? inputSisterCity.value : "Mumbai",
                brotherCity: inputBrotherCity ? inputBrotherCity.value : "London"
            },
            childhoodPhotos: [
                { url: photos[0], caption: "Unstoppable Duo" },
                { url: photos[1], caption: "Who started this fight?" },
                { url: photos[2], caption: "Definitely not me" },
                { url: photos[3], caption: "Mom remembers differently" }
            ],
            polaroids: [
                { url: photos[0], caption: "Us." },
                { url: photos[1], caption: "Chaos." },
                { url: photos[2], caption: "Childhood." },
                { url: photos[3], caption: "Always." }
            ]
        };

        const jsonStr = JSON.stringify(payload);
        const compressed = window.LZString.compressToEncodedURIComponent(jsonStr);
        const baseUrl = window.location.href.split('customize.html')[0] + 'index.html';
        const finalUrl = `${baseUrl}#data=${compressed}`;

        if (outputUrl) outputUrl.value = finalUrl;
        if (linkBox) linkBox.style.display = 'flex';
        if (hubExtra) hubExtra.style.display = 'flex';

        btnGenerate.textContent = "✅ Story Link Generated Successfully!";
        setTimeout(() => { btnGenerate.textContent = "✨ Re-generate Client Story Link"; }, 2500);
    });

    btnCopy?.addEventListener('click', () => {
        if (outputUrl) {
            outputUrl.select();
            navigator.clipboard.writeText(outputUrl.value);
            btnCopy.textContent = "✅ Copied!";
            setTimeout(() => { btnCopy.textContent = "📋 Copy"; }, 2000);
        }
    });

    btnShareWA?.addEventListener('click', () => {
        if (outputUrl && outputUrl.value) {
            const sister = inputSister ? inputSister.value : "Sister";
            const text = encodeURIComponent(`🪔 Happy Raksha Bandhan! ✨\n\nI created this personalized interactive digital story for you:\n\n${outputUrl.value}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }
    });

    btnTestLive?.addEventListener('click', () => {
        if (outputUrl && outputUrl.value) {
            window.open(outputUrl.value, '_blank');
        }
    });

    updateLivePreview();
});
