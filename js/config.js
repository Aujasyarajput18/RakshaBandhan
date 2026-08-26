/**
 * Raksha Bandhan 3D Digital Gift - Core Config & State Engine
 * Supports URL Compression (#data=...), Static JSON (?g=ID), and Resilient Demo Defaults.
 */

// Embedded LZString mini-decompressor for 100% standalone URL hash decoding
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
                context_dictionary= {},
                context_dictionaryToCreate= {},
                context_c="",
                context_wc="",
                context_w="",
                context_enlargeIn= 2,
                context_dictSize= 3,
                context_numBits= 2,
                context_data=[],
                context_data_val=0,
                context_data_position=0,
                ii;

            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
                    context_w = context_wc;
                } else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                        if (context_w.charCodeAt(0)<256) {
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<8 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
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
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<16 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
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
                        for (i=0 ; i<context_numBits ; i++) {
                            context_data_val = (context_data_val << 1) | (value&1);
                            if (context_data_position == bitsPerChar-1) {
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
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                    if (context_w.charCodeAt(0)<256) {
                        for (i=0 ; i<context_numBits ; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i=0 ; i<8 ; i++) {
                            context_data_val = (context_data_val << 1) | (value&1);
                            if (context_data_position == bitsPerChar-1) {
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
                        for (i=0 ; i<context_numBits ; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i=0 ; i<16 ; i++) {
                            context_data_val = (context_data_val << 1) | (value&1);
                            if (context_data_position == bitsPerChar-1) {
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
                    for (i=0 ; i<context_numBits ; i++) {
                        context_data_val = (context_data_val << 1) | (value&1);
                        if (context_data_position == bitsPerChar-1) {
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
            for (i=0 ; i<context_numBits ; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == bitsPerChar-1) {
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
                if (context_data_position == bitsPerChar-1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                }
                else context_data_position++;
            }
            return context_data.join('');
        },
        _decompress: function(length, resetValue, getNextValue) {
            let dictionary = [],
                next,
                enlargeIn = 4,
                dictSize = 4,
                numBits = 3,
                entry = "",
                result = [],
                i,
                w,
                bits, resb, maxpower, power,
                c,
                data = {val:getNextValue(0), position:resetValue, index:1};

            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }

            bits = 0;
            maxpower = Math.pow(2,2);
            power=1;
            while (power!=maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
            }

            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2,8);
                    power=1;
                    while (power!=maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb>0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2,16);
                    power=1;
                    while (power!=maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb>0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return "";
                }

                bits = 0;
                maxpower = Math.pow(2,numBits);
                power=1;
                while (power!=maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb>0 ? 1 : 0) * power;
                    power <<= 1;
                }

                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2,8);
                        power=1;
                        while (power!=maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb>0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize-1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2,16);
                        power=1;
                        while (power!=maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb>0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize-1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }

                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }

                if (dictionary[c]) {
                    entry = dictionary[c];
                } else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0);
                    } else {
                        return null;
                    }
                }
                result.push(entry);

                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;

                w = entry;

                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
    };
})();

// Default Fallback Demo Configuration
const DEFAULT_RAKHI_CONFIG = {
    sisterName: "Ananya",
    senderName: "Aarav",
    relationTitle: "Meri Pyaari Didi",
    tagline: "Happy Raksha Bandhan 🪔",
    tunnelLabel: "Hold to Enter Sister's World 🪔",
    kineticRows: [
        "MY FIRST FRIEND",
        "MY FOREVER PROTECTOR",
        "HAPPY RAKSHA BANDHAN",
        "भाई-बहन का अटूट प्यार 🪔"
    ],
    heroTitle: "HAPPY RAKSHA BANDHAN",
    heroSubtitle: "To the most wonderful sister in the world ❤️",
    heroImage: "assets/images/demo/portrait.svg",
    photos: [
        "assets/images/demo/img1.svg",
        "assets/images/demo/img2.svg",
        "assets/images/demo/img3.svg",
        "assets/images/demo/img4.svg",
        "assets/images/demo/img5.svg",
        "assets/images/demo/img6.svg"
    ],
    letter: {
        envelopeTitle: "Prem Patra 💌",
        salutation: "Dearest Ananya Didi,",
        heading: "Happy Raksha Bandhan, my favorite crime partner! 🪔❤️",
        bodyParagraphs: [
            "From fighting over the TV remote to secretly sharing midnight snacks, from covering up for each other in front of mom to being each other's greatest strength — having you as my sister is the best gift life has given me.",
            "Thank you for always listening to my nonsense, guiding me when I was lost, and believing in me even when I doubted myself. You make our home full of warmth, laughter, and light.",
            "On this auspicious day of Raksha Bandhan, I promise to always protect you, stand by you through every high and low, annoy you forever, and cherish this unbreakable bond we share!"
        ],
        signoff: "Forever your loving Bhai, Aarav ❤️"
    },
    promises: [
        "Midnight Maggi Cooked Anytime 🍜",
        "Shopping Spree Fully Paid 🛍️",
        "Remote Control for a Week 📺",
        "All Secrets Safe Forever 🤐",
        "One Wish Granted Unconditionally ✨",
        "Unlimited Hugs & Chai Treats ☕"
    ],
    noPhrases: [
        "Tujhe remote nahi dungi! 📺",
        "Chocolates sab meri! 🍫",
        "Mom ko sab sach bata dunga! 🤫",
        "Rakhi ka shagun cut! 💸",
        "Achha maan bhi jao! 🥺",
        "Pakka promise! ❤️"
    ],
    musicTitle: "Festive Rakhi Melody",
    musicArtist: "Bansuri & Shehnai Special",
    audioSrc: "assets/audio/song.mp3"
};

// Global App Config Holder
window.RakhiConfig = { ...DEFAULT_RAKHI_CONFIG };

/**
 * Initializes and merges configuration from URL hash (#data=...), query string (?g=...), or fallback.
 */
async function loadRakhiConfig() {
    try {
        // 1. Check for LZ-String compressed data in URL hash (#data=...)
        const hash = window.location.hash;
        if (hash && hash.includes("data=")) {
            const encodedData = hash.split("data=")[1];
            if (encodedData) {
                const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);
                    window.RakhiConfig = deepMerge(DEFAULT_RAKHI_CONFIG, parsed);
                    console.log("✨ Loaded custom client config from URL hash payload!");
                    return window.RakhiConfig;
                }
            }
        }

        // 2. Check for Static Gift ID query param (?g=...)
        const params = new URLSearchParams(window.location.search);
        const giftId = params.get('g') || params.get('gift');
        if (giftId) {
            try {
                const res = await fetch(`gifts/${giftId}.json`);
                if (res.ok) {
                    const parsed = await res.json();
                    window.RakhiConfig = deepMerge(DEFAULT_RAKHI_CONFIG, parsed);
                    console.log(`✨ Loaded gift data for ID: ${giftId}`);
                    return window.RakhiConfig;
                }
            } catch (err) {
                console.warn(`Could not load /gifts/${giftId}.json, falling back to default.`, err);
            }
        }
    } catch (e) {
        console.error("Config load error, using default demo config:", e);
    }

    // 3. Fallback to default demo
    window.RakhiConfig = { ...DEFAULT_RAKHI_CONFIG };
    return window.RakhiConfig;
}

// Deep merge utility
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

// Expose LZString to window for customizer page
window.LZString = LZString;
