/**
 * ==========================================================================
 * RAKSHA BANDHAN DIGITAL EXPERIENCE — MASTER CONFIGURATION
 * Single location to customize names, photos, memories, letter, vows, and music.
 * ==========================================================================
 */

const DEFAULT_RAKHI_CONFIG = {
    // ── Primary Sibling Names ──
    names: {
        sister: "Ananya",
        brother: "Aarav"
    },

    // ── Client Profile Photos (used in the hero and distance scenes) ──
    // Each client can have independent, named photos for both siblings.
    profiles: {
        sister: {
            photo: "assets/images/demo/portrait.svg",
            city: "Mumbai"
        },
        brother: {
            photo: "assets/images/demo/img6.svg",
            city: "London"
        }
    },

    // ── Hero Section ──
    hero: {
        tagline: "Some bonds are tied by a thread.",
        subtagline: "Ours was tied long before the Rakhi.",
        image: "assets/images/editorial/wrist_seamless.png",
        festivalBadge: "HAPPY RAKSHA BANDHAN 🪔"
    },

    // ── Signature Interactive Rakhi ──
    rakhiSection: {
        quote: "A tiny thread. A lifetime of promises.",
        rakhiImage: "assets/images/rakhis/tassel-rakhi.svg"
    },

    // ── Traditional Thali ──
    thali: {
        title: "The Sacred Rakhi Thali",
        subtitle: "Hover or tap each sacred element of the thali to unveil its meaning.",
        elements: {
            rakhi: { label: "Rakhi", meaning: "A sacred promise of eternal protection." },
            diya: { label: "Aarti Diya", meaning: "A divine light guiding our path through every darkness." },
            kumkum: { label: "Roli Kumkum", meaning: "An auspicious blessing for longevity and good health." },
            rice: { label: "Akshat Rice", meaning: "Sacred grains of unbroken prosperity and peace." },
            sweets: { label: "Mithai", meaning: "A little sweetness to celebrate life's joyful moments." },
            flowers: { label: "Marigold Petals", meaning: "A lifetime of vibrant, fragrant memories." }
        }
    },

    // ── "Before We Grew Up" Childhood Gallery ──
    childhoodPhotos: [
        { url: "assets/images/demo/img1.svg", caption: "The unstoppable duo." },
        { url: "assets/images/demo/img2.svg", caption: "Who started this fight?" },
        { url: "assets/images/demo/img3.svg", caption: "Definitely not me." },
        { url: "assets/images/demo/img4.svg", caption: "Mom remembers differently." }
    ],

    // ── Memory Timeline (Continuous Gold Thread) ──
    memories: [
        {
            year: "Era 01",
            title: "The Tiny Humans Era",
            description: "Before we knew how fast time would move. Stealing each other's toys and crying to Mom.",
            image: "assets/images/demo/img1.svg"
        },
        {
            year: "Era 02",
            title: "The Fighting Era",
            description: "Who gets the TV remote? Who took the last slice of pizza? Legendary battles fought and forgotten.",
            image: "assets/images/demo/img2.svg"
        },
        {
            year: "Era 03",
            title: "The Growing Up Era",
            description: "Late-night exam preps, secret crushes, and covering for each other when we came home late.",
            image: "assets/images/demo/img3.svg"
        },
        {
            year: "Era 04",
            title: "The 'Don't Tell Mom' Era",
            description: "The secret unspoken treaties that kept both of us out of trouble.",
            image: "assets/images/demo/img4.svg"
        },
        {
            year: "Era 05",
            title: "We Grew Up But Didn't Really",
            description: "Different cities, busy schedules, but the exact same chaotic kids whenever we meet.",
            image: "assets/images/demo/img5.svg"
        }
    ],

    // ── Sibling Game ("Who Is More Likely?") ──
    siblingGame: [
        { question: "Who steals food from the fridge?", defaultWinner: "sister", commentary: "Caught red-handed at 2 AM! 🍫" },
        { question: "Who gets angry first?", defaultWinner: "brother", commentary: "Zero patience, maximum drama! 😤" },
        { question: "Who says sorry first?", defaultWinner: "brother", commentary: "Because someone has to be the mature one! 🕊️" },
        { question: "Who is more dramatic?", defaultWinner: "sister", commentary: "Deserves an Oscar for everyday reactions! 🎭" },
        { question: "Who gets Mom's support?", defaultWinner: "sister", commentary: "Unfair judicial advantage! 👩‍👧" },
        { question: "Who steals the other's clothes?", defaultWinner: "sister", commentary: "'It looked oversized and cute on me!' 👕" },
        { question: "Who is Mom's favorite?", defaultWinner: "brother", commentary: "A fiercely contested lifelong debate! 🏆" }
    ],

    // ── "Things I'll Never Say Out Loud" Emotional Scroll ──
    unspokenWords: [
        "There are some things I don't say enough.",
        "I'm proud of the person you've become.",
        "You've always had my back, even when I didn't ask.",
        "I don't say it often...",
        "But I am endlessly lucky to have you in this life."
    ],

    // ── Handwritten Royal Letter ──
    letter: {
        salutation: "Dearest Ananya,",
        bodyParagraphs: [
            "We've grown up. We've changed. We've argued. We've laughed. But somehow, through everything life has thrown at us, you've remained one of the most important people in my life.",
            "Whenever the world feels overwhelming, knowing that I have you in my corner gives me quiet strength. Thank you for your wisdom, your unending patience, and your unconditional warmth.",
            "No matter how far life takes us, our bond will remain unbroken. Happy Raksha Bandhan, always."
        ],
        signoff: "Forever your loving brother ❤️, Aarav"
    },

    // ── Draggable Polaroids ──
    polaroids: [
        { url: "assets/images/demo/img1.svg", caption: "Us." },
        { url: "assets/images/demo/img2.svg", caption: "Chaos." },
        { url: "assets/images/demo/img3.svg", caption: "Childhood." },
        { url: "assets/images/demo/img4.svg", caption: "Home." },
        { url: "assets/images/demo/img5.svg", caption: "Always." }
    ],

    // ── Optional Distance Section ──
    distanceSection: {
        enabled: true,
        sisterCity: "Mumbai",
        brotherCity: "London",
        quote: "Different cities. Different lives. Same bond."
    },

    // ── Sibling Vows & Promises ──
    vows: [
        { icon: "🛡️", title: "Fierce Protection", desc: "I promise to stand by your side in every storm, no matter how fierce." },
        { icon: "🍜", title: "2:00 AM Maggi Pass", desc: "Emergency late-night food runs and confidential gossip sessions guaranteed forever." },
        { icon: "🛍️", title: "Shopping Companion", desc: "I promise to be your personal chauffeur, stylist, and occasional bill sponsor." },
        { icon: "🤐", title: "Vault of Secrets", desc: "Every secret, tear, and dream you share with me is locked forever in a steel vault." }
    ],

    // ── Music Configuration ──
    music: {
        enabled: true,
        source: "assets/audio/song.mp3",
        title: "Festive Rakhi Symphony",
        artist: "Acoustic Sitar & Bansuri"
    }
};

// ── LZString Mini Engine for 100% Serverless URL Hash Sharing ──
const LZString = (function() {
    const f = String.fromCharCode;
    const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    const getBaseValue = (alphabet, character) => alphabet.indexOf(character);

    return {
        decompressFromEncodedURIComponent: function(input) {
            if (input === null || input === "") return "";
            input = input.replace(/ /g, "+");
            return LZString._decompress(input.length, 32, function(index) {
                return getBaseValue(keyStrUriSafe, input.charAt(index));
            });
        },
        compressToEncodedURIComponent: function(input) {
            if (input === null) return "";
            return LZString._compress(input, 6, function(a) {
                return keyStrUriSafe.charAt(a);
            });
        },
        _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed === null) return "";
            let i, value,
                context_dictionary = {},
                context_dictionaryToCreate = {},
                context_c = "",
                context_wc = "",
                context_w = "",
                context_enlargeIn = 2,
                context_dictSize = 3,
                context_numBits = 2,
                context_data = [],
                context_data_val = 0,
                context_data_position = 0,
                ii;

            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                } else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        } else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    } else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }

            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    } else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                } else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }

            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                } else {
                    context_data_position++;
                }
                value = value >> 1;
            }

            while (true) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                } else context_data_position++;
            }
            return context_data.join('');
        },
        _decompress: function(length, resetValue, getNextValue) {
            let dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) dictionary[i] = i;
            bits = 0; maxpower = Math.pow(2, 2); power = 1;
            while (power != maxpower) {
                resb = data.val & data.position; data.position >>= 1;
                if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
            }
            switch (next = bits) {
                case 0: bits = 0; maxpower = Math.pow(2, 8); power = 1; while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); } bits |= (resb > 0 ? 1 : 0) * power; power <<= 1; } c = f(bits); break;
                case 1: bits = 0; maxpower = Math.pow(2, 16); power = 1; while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); } bits |= (resb > 0 ? 1 : 0) * power; power <<= 1; } c = f(bits); break;
                case 2: return "";
            }
            dictionary[3] = c; w = c; result.push(c);
            while (true) {
                if (data.index > length) return "";
                bits = 0; maxpower = Math.pow(2, numBits); power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position; data.position >>= 1;
                    if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
                    bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
                }
                switch (c = bits) {
                    case 0: bits = 0; maxpower = Math.pow(2, 8); power = 1; while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); } bits |= (resb > 0 ? 1 : 0) * power; power <<= 1; } dictionary[dictSize++] = f(bits); c = dictSize - 1; enlargeIn--; break;
                    case 1: bits = 0; maxpower = Math.pow(2, 16); power = 1; while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); } bits |= (resb > 0 ? 1 : 0) * power; power <<= 1; } dictionary[dictSize++] = f(bits); c = dictSize - 1; enlargeIn--; break;
                    case 2: return result.join('');
                }
                if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
                if (dictionary[c]) entry = dictionary[c];
                else { if (c === dictSize) entry = w + w.charAt(0); else return null; }
                result.push(entry); dictionary[dictSize++] = w + entry.charAt(0); enlargeIn--; w = entry;
                if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
            }
        }
    };
})();

// Global config instance
window.rakhiConfig = { ...DEFAULT_RAKHI_CONFIG };

/**
 * Loads and merges custom config from URL hash, JSON, or defaults.
 */
async function loadRakhiConfig() {
    try {
        const hash = window.location.hash;
        if (hash && hash.includes("data=")) {
            const encodedData = hash.split("data=")[1];
            if (encodedData) {
                const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);
                    window.rakhiConfig = deepMerge(DEFAULT_RAKHI_CONFIG, parsed);
                    return window.rakhiConfig;
                }
            }
        }
        const params = new URLSearchParams(window.location.search);
        const giftId = params.get('g') || params.get('gift');
        if (giftId) {
            try {
                const res = await fetch(`gifts/${giftId}.json`);
                if (res.ok) {
                    const parsed = await res.json();
                    window.rakhiConfig = deepMerge(DEFAULT_RAKHI_CONFIG, parsed);
                    return window.rakhiConfig;
                }
            } catch (err) {}
        }
    } catch (e) {}

    window.rakhiConfig = { ...DEFAULT_RAKHI_CONFIG };
    return window.rakhiConfig;
}

function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) Object.assign(output, { [key]: source[key] });
                else output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

window.LZString = LZString;
window.loadRakhiConfig = loadRakhiConfig;
