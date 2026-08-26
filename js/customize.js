/**
 * customize.js
 * Multi-Client Gift Customizer Engine with In-Browser Photo Compression
 * Generates standalone, zero-server URL payloads with LZ-String encoding.
 */

let uploadedPhotos = [
    'assets/images/demo/img1.svg',
    'assets/images/demo/img2.svg',
    'assets/images/demo/img3.svg',
    'assets/images/demo/img4.svg',
    'assets/images/demo/img5.svg',
    'assets/images/demo/img6.svg'
];

let heroPhoto = 'assets/images/demo/portrait.svg';

document.addEventListener('DOMContentLoaded', () => {
    setupPhotoUploaders();

    const btnGenerate = document.getElementById('btn-generate-gift');
    const outputBox = document.getElementById('output-box');
    const generatedUrlInput = document.getElementById('generated-url');
    const btnCopyLink = document.getElementById('btn-copy-link');
    const btnWaShare = document.getElementById('btn-wa-share');
    const btnOpenTest = document.getElementById('btn-open-test');
    const btnDownloadJson = document.getElementById('btn-download-json');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            const sisterName = document.getElementById('sister-name').value.trim() || 'Ananya';
            const brotherName = document.getElementById('brother-name').value.trim() || 'Aarav';
            const salutation = document.getElementById('letter-salutation-input').value.trim() || `Dearest ${sisterName} Didi,`;
            const heading = document.getElementById('letter-heading-input').value.trim() || "Happy Raksha Bandhan to my favorite crime partner! 🪔❤️";
            const p1 = document.getElementById('letter-p1').value.trim() || "From fighting over the TV remote to secretly sharing midnight snacks, having you as my sister is the best gift life has given me.";
            const p2 = document.getElementById('letter-p2').value.trim() || "Thank you for always listening to my nonsense, guiding me when I was lost, and believing in me even when I doubted myself.";
            const p3 = document.getElementById('letter-p3').value.trim() || "On this auspicious day of Raksha Bandhan, I promise to always protect you, stand by you through every high and low, and cherish this unbreakable bond!";
            const signoff = document.getElementById('letter-signoff-input').value.trim() || `Forever your loving Bhai, ${brotherName} ❤️`;

            const promises = [
                document.getElementById('promise-1').value.trim() || "Midnight Maggi Cooked Anytime 🍜",
                document.getElementById('promise-2').value.trim() || "Shopping Spree Fully Paid 🛍️",
                document.getElementById('promise-3').value.trim() || "Remote Control for a Week 📺",
                document.getElementById('promise-4').value.trim() || "All Secrets Safe Forever 🤐",
                document.getElementById('promise-5').value.trim() || "One Wish Granted Unconditionally ✨",
                document.getElementById('promise-6').value.trim() || "Unlimited Hugs & Chai Treats ☕"
            ];

            const giftPayload = {
                sisterName,
                senderName: brotherName,
                heroTitle: `HAPPY RAKSHA BANDHAN, ${sisterName.toUpperCase()}!`,
                heroSubtitle: `With endless love & blessings from ${brotherName} ❤️`,
                heroImage: heroPhoto,
                photos: uploadedPhotos,
                letter: {
                    salutation,
                    heading,
                    bodyParagraphs: [p1, p2, p3],
                    signoff
                },
                promises: promises,
                musicTitle: "Festive Rakhi Melody",
                musicArtist: "Bansuri & Shehnai Special"
            };

            // Compress payload into URL safe string
            const jsonStr = JSON.stringify(giftPayload);
            const compressed = LZString.compressToEncodedURIComponent(jsonStr);

            // Construct full shareable URL
            const baseUrl = window.location.href.replace(/customize\.html.*$/, 'index.html');
            const fullGiftUrl = `${baseUrl}#data=${compressed}`;

            if (generatedUrlInput) generatedUrlInput.value = fullGiftUrl;
            if (outputBox) outputBox.style.display = 'block';

            // Scroll to output
            outputBox.scrollIntoView({ behavior: 'smooth' });

            // Button actions
            if (btnCopyLink) {
                btnCopyLink.onclick = () => {
                    navigator.clipboard.writeText(fullGiftUrl);
                    btnCopyLink.innerText = "✓ Link Copied!";
                    setTimeout(() => { btnCopyLink.innerText = "📋 Copy Gift Link"; }, 2000);
                };
            }

            if (btnWaShare) {
                btnWaShare.onclick = () => {
                    const waText = `🪔 *Happy Raksha Bandhan, ${sisterName}!* ❤️\n\nHere is a 3D special gift created just for you with our cherished memories, promises & blessings!\n\nOpen your Rakhi Gift:\n${fullGiftUrl}\n\n- With love from ${brotherName} ✨`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
                };
            }

            if (btnOpenTest) {
                btnOpenTest.onclick = () => {
                    window.open(fullGiftUrl, '_blank');
                };
            }

            if (btnDownloadJson) {
                btnDownloadJson.onclick = () => {
                    const blob = new Blob([JSON.stringify(giftPayload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `rakhi_${sisterName.toLowerCase()}_gift.json`;
                    a.click();
                };
            }
        });
    }
});

// Setup In-Browser Photo Compressor Uploaders
function setupPhotoUploaders() {
    for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`photo-slot-${i}`);
        const fileInput = document.getElementById(`photo-input-${i}`);
        const previewImg = document.getElementById(`photo-preview-${i}`);

        if (slot && fileInput) {
            slot.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    compressImage(file, 800, 0.7, (compressedDataUrl) => {
                        uploadedPhotos[i] = compressedDataUrl;
                        if (previewImg) {
                            previewImg.src = compressedDataUrl;
                            previewImg.style.display = 'block';
                        }
                    });
                }
            });
        }
    }
}

/**
 * Client-Side Canvas Image Compressor
 * Resizes image to max dimension & compresses to JPEG/WebP to keep URL string compact.
 */
function compressImage(file, maxDimension, quality, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            callback(compressedDataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
