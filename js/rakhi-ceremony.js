/**
 * rakhi-ceremony.js
 * Virtual Rakhi Tying Ceremony Module
 * Interactive ritual with Rakhi placement, Rotating Aarti Diya, and Holy Chant Blessing.
 */

let rakhiTied = false;

function initRakhiCeremony() {
    const rakhiDraggable = document.getElementById('rakhi-draggable');
    const wristTarget = document.getElementById('wrist-target');
    const btnTieRakhi = document.getElementById('btn-tie-rakhi');
    const aartiDiya = document.getElementById('aarti-diya-orbit');
    const ceremonyPrompt = document.getElementById('ceremony-prompt');
    const ceremonyBlessing = document.getElementById('ceremony-blessing');
    const btnNextCeremony = document.getElementById('btn-next-ceremony');

    if (!rakhiDraggable || !wristTarget) return;

    // Direct click/tap on Rakhi or "Tie Rakhi" button
    const performTying = () => {
        if (rakhiTied) return;
        rakhiTied = true;

        // Animate Rakhi onto wrist
        rakhiDraggable.classList.add('tied-on-wrist');
        wristTarget.classList.add('rakhi-secured');

        // Show Holy Mantra & Aarti
        if (ceremonyPrompt) ceremonyPrompt.style.opacity = '0';
        if (btnTieRakhi) btnTieRakhi.style.display = 'none';

        setTimeout(() => {
            if (aartiDiya) aartiDiya.classList.add('active-aarti');
            if (ceremonyBlessing) {
                ceremonyBlessing.classList.add('visible');
                const config = window.RakhiConfig || {};
                ceremonyBlessing.innerHTML = `
                    <div class="mantra-shloka">
                        "येन बद्धो बली राजा दानवेन्द्रो महाबलः।<br>
                        तेन त्वामपि बध्नामि रक्षे मा चल मा चल॥"
                    </div>
                    <div class="blessing-english">
                        Sacred thread tied with love & prayers for <strong>${config.senderName || 'Brother'}</strong> & <strong>${config.sisterName || 'Sister'}</strong>.
                    </div>
                `;
            }

            if (typeof fireFestiveConfetti === 'function') {
                fireFestiveConfetti();
            }

            // Reveal Next Button
            if (btnNextCeremony) {
                btnNextCeremony.classList.remove('hidden');
            }
        }, 800);
    };

    if (btnTieRakhi) {
        btnTieRakhi.addEventListener('click', performTying);
    }
    rakhiDraggable.addEventListener('click', performTying);
}
