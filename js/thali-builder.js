/**
 * thali-builder.js
 * Interactive Mithai Thali Builder for Raksha Bandhan
 * Allows customizing sweets on a traditional brass puja plate.
 */

const SWEET_TYPES = {
    'kaju-katli': {
        name: 'Kaju Katli',
        icon: 'assets/images/sweets/kaju-katli.svg',
        desc: 'Royal Cashew Diamond with Silver Vark'
    },
    'laddoo': {
        name: 'Motichoor Laddoo',
        icon: 'assets/images/sweets/laddoo.svg',
        desc: 'Golden Marigold Sweet with Pistachios'
    },
    'gulab-jamun': {
        name: 'Gulab Jamun',
        icon: 'assets/images/sweets/gulab-jamun.svg',
        desc: 'Soft Dumpling in Rose Cardamom Syrup'
    },
    'rasgulla': {
        name: 'Spongy Rasgulla',
        icon: 'assets/images/sweets/rasgulla.svg',
        desc: 'Delicate Chenna in Light Sugar Syrup'
    },
    'diya': {
        name: 'Aarti Diya',
        icon: 'assets/images/ornaments/diya.svg',
        desc: 'Auspicious Clay Lamp with Sacred Flame'
    }
};

let selectedSweets = ['kaju-katli', 'laddoo', 'diya']; // Default curated plate

function initThaliBuilder() {
    const sweetOptionsContainer = document.getElementById('sweet-options');
    const thaliPlatter = document.getElementById('thali-platter-items');
    const btnServeThali = document.getElementById('btn-serve-thali');
    const thaliMessage = document.getElementById('thali-custom-msg');

    if (!sweetOptionsContainer || !thaliPlatter) return;

    // Render interactive sweet selector cards
    sweetOptionsContainer.innerHTML = '';
    Object.keys(SWEET_TYPES).forEach(key => {
        const item = SWEET_TYPES[key];
        const isSelected = selectedSweets.includes(key);

        const card = document.createElement('div');
        card.className = `sweet-card ${isSelected ? 'selected' : ''}`;
        card.dataset.sweet = key;
        card.innerHTML = `
            <div class="sweet-card-icon">
                <img src="${item.icon}" alt="${item.name}">
            </div>
            <div class="sweet-card-title">${item.name}</div>
            <div class="sweet-card-desc">${item.desc}</div>
            <div class="sweet-badge">${isSelected ? '✓ Added' : '+ Add'}</div>
        `;

        card.addEventListener('click', () => {
            toggleSweet(key, card);
        });

        sweetOptionsContainer.appendChild(card);
    });

    renderThaliItems();

    if (btnServeThali) {
        btnServeThali.addEventListener('click', () => {
            if (selectedSweets.length === 0) {
                alert("Please add at least one sweet to the Thali! 🍬");
                return;
            }
            if (typeof fireFestiveConfetti === 'function') {
                fireFestiveConfetti();
            }
            if (thaliMessage) {
                const config = window.RakhiConfig || {};
                thaliMessage.innerHTML = `
                    <h3>🪔 Shubh Raksha Bandhan 🪔</h3>
                    <p>A sweet celebration of love, care, and lifelong companionship for <strong>${config.sisterName || 'Dearest Sister'}</strong>!</p>
                `;
            }
            // Transition to Thali Celebration view
            const screenThali = document.getElementById('screen-thali');
            const screenThaliServe = document.getElementById('screen-thali-serve');
            if (screenThali && screenThaliServe) {
                screenThali.classList.remove('active');
                screenThaliServe.classList.add('active');
            }
        });
    }
}

function toggleSweet(key, cardElement) {
    const idx = selectedSweets.indexOf(key);
    if (idx > -1) {
        if (selectedSweets.length <= 1) {
            alert("Your Thali needs at least one sweet or diya! 🪔");
            return;
        }
        selectedSweets.splice(idx, 1);
        cardElement.classList.remove('selected');
        cardElement.querySelector('.sweet-badge').innerText = '+ Add';
    } else {
        selectedSweets.push(key);
        cardElement.classList.add('selected');
        cardElement.querySelector('.sweet-badge').innerText = '✓ Added';
    }
    renderThaliItems();
}

function renderThaliItems() {
    const platter1 = document.getElementById('thali-platter-items');
    const platter2 = document.getElementById('thali-serve-items');

    [platter1, platter2].forEach(platter => {
        if (!platter) return;
        platter.innerHTML = '';

        // Position items symmetrically in a festive circle around the center
        const total = selectedSweets.length;
        const radius = 105; // px from center
        const centerOffset = 150; // center of 300x300 thali

        selectedSweets.forEach((sweetKey, i) => {
            const sweet = SWEET_TYPES[sweetKey];
            if (!sweet) return;

            const angle = (i / total) * (2 * Math.PI) - (Math.PI / 2);
            const x = centerOffset + radius * Math.cos(angle) - 35;
            const y = centerOffset + radius * Math.sin(angle) - 35;

            const itemEl = document.createElement('div');
            itemEl.className = 'thali-sweet-item float-item';
            itemEl.style.left = `${x}px`;
            itemEl.style.top = `${y}px`;
            itemEl.innerHTML = `<img src="${sweet.icon}" alt="${sweet.name}" class="thali-img">`;

            platter.appendChild(itemEl);
        });

        // Center Tilak & Akshat (Roli-Chawal) in middle of Thali
        const centerTilak = document.createElement('div');
        centerTilak.className = 'thali-center-tilak';
        centerTilak.innerHTML = `
            <div class="tilak-circle">
                <span class="roli-dot"></span>
                <span class="chawal-grain g1"></span>
                <span class="chawal-grain g2"></span>
                <span class="chawal-grain g3"></span>
            </div>
        `;
        platter.appendChild(centerTilak);
    });
}
