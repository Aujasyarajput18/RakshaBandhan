/**
 * tunnel.js
 * Three.js 3D Infinite Memory Tunnel for Raksha Bandhan
 * Festive Gold & Marigold Neon Grid with Sibling Memory Slabs
 */

const TUNNEL_THEME = {
    background: "#140309", // Deep Royal Burgundy / Maroon
    lineColor: "#f5a623",  // Glowing Warm Saffron Gold
    lineOpacity: 55,
    colors: ["#ffd700", "#ff9800", "#d50000", "#f4a300", "#e65100", "#ffe082"],
    grid: 4,
    speed: 85,
    boost: 260,
    fade: 95
};

const TUNNEL_WIDTH = 2.2;
const TUNNEL_HEIGHT = 1.9;
const SEGMENT_DEPTH = 1.1;
const NUM_SEGMENTS = 16;
const LINE_RADIUS = 0.0035;
const SCROLL_TO_Z = 0.05;
const CAMERA_CHASE = 0.12;
const FADE_IN = 0.8;
const FOG_FAR = NUM_SEGMENTS * SEGMENT_DEPTH * 0.95;

let tunnelScene, tunnelCamera, tunnelRenderer, tunnelRaf, tunnelAlive = false;

function initTunnel(containerId, onStartCallback) {
    const frame = document.getElementById(containerId);
    if (!frame) return;

    const config = window.RakhiConfig || {};
    const photoList = config.photos && config.photos.length > 0 ? config.photos : [
        'assets/images/demo/img1.svg',
        'assets/images/demo/img2.svg',
        'assets/images/demo/img3.svg',
        'assets/images/demo/img4.svg',
        'assets/images/demo/img5.svg',
        'assets/images/demo/img6.svg'
    ];
    const labelText = config.tunnelLabel || "Hold to Enter Sister's World 🪔";

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    frame.appendChild(canvas);

    // Diya Floating Embers / Ambient Glow Element
    const emberOverlay = document.createElement('div');
    emberOverlay.className = 'tunnel-embers';
    frame.appendChild(emberOverlay);

    // Label element
    const cursorLabel = document.createElement('div');
    cursorLabel.className = 'tunnel-label';
    cursorLabel.innerText = labelText;
    frame.appendChild(cursorLabel);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(TUNNEL_THEME.background);

    const fogNear = Math.min(
        FOG_FAR * (1 - Math.min(100, Math.max(0, TUNNEL_THEME.fade)) / 100),
        FOG_FAR - 0.01
    );
    scene.fog = new THREE.Fog(new THREE.Color(TUNNEL_THEME.background), fogNear, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(45, frame.clientWidth / frame.clientHeight, 0.5, 1000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const lineMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(TUNNEL_THEME.lineColor),
        transparent: true,
        opacity: Math.min(100, Math.max(0, TUNNEL_THEME.lineOpacity)) / 100,
    });

    const loader = new THREE.TextureLoader();
    const fading = [];

    let imageIndex = 0;
    let colorIndex = 0;
    let populateIndex = 0;
    let scrollPos = 0;
    let last = 0;
    let pressed = false;
    tunnelAlive = true;

    const hw = TUNNEL_WIDTH / 2;
    const hh = TUNNEL_HEIGHT / 2;

    const cols = Math.max(1, Math.round(TUNNEL_THEME.grid));
    const rows = Math.max(1, Math.round(TUNNEL_THEME.grid));
    const colW = TUNNEL_WIDTH / cols;
    const rowH = TUNNEL_HEIGHT / rows;

    const geoFloor = new THREE.PlaneGeometry(colW, SEGMENT_DEPTH);
    const geoWall = new THREE.PlaneGeometry(SEGMENT_DEPTH, rowH);

    const geoTubeZ = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -SEGMENT_DEPTH)),
        1, LINE_RADIUS, 8
    );
    const geoTubeX = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(TUNNEL_WIDTH, 0, 0)),
        1, LINE_RADIUS, 8
    );
    const geoTubeY = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, TUNNEL_HEIGHT, 0)),
        1, LINE_RADIUS, 8
    );

    const colorMats = TUNNEL_THEME.colors.map(
        (hex) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), side: THREE.DoubleSide })
    );

    const imageMats = photoList.map((url) => {
        const mat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            color: new THREE.Color(1.4, 1.35, 1.2), // Warm ambient lighting on photos
        });
        loader.load(url, (tex) => {
            if (!tunnelAlive) {
                tex.dispose();
                return;
            }
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            mat.map = tex;
            mat.needsUpdate = true;
            fading.push(mat);
        });
        return mat;
    });

    const tube = (geo, x, y, z = 0) => {
        const m = new THREE.Mesh(geo, lineMaterial);
        m.position.set(x, y, z);
        return m;
    };

    const SLOTS = [];
    {
        const z = -SEGMENT_DEPTH / 2;
        for (let i = 0; i < cols; i++) {
            const x = -hw + i * colW + colW / 2;
            SLOTS.push({ geo: geoFloor, pos: new THREE.Vector3(x, -hh, z), rot: new THREE.Euler(-Math.PI / 2, 0, 0) });
            SLOTS.push({ geo: geoFloor, pos: new THREE.Vector3(x, hh, z), rot: new THREE.Euler(Math.PI / 2, 0, 0) });
        }
        for (let i = 0; i < rows; i++) {
            const y = -hh + i * rowH + rowH / 2;
            SLOTS.push({ geo: geoWall, pos: new THREE.Vector3(-hw, y, z), rot: new THREE.Euler(0, Math.PI / 2, 0) });
            SLOTS.push({ geo: geoWall, pos: new THREE.Vector3(hw, y, z), rot: new THREE.Euler(0, -Math.PI / 2, 0) });
        }
    }

    function populate(group) {
        const takesSlabs = populateIndex % 2 === 0;
        populateIndex++;
        const slabs = group.userData.slabs;

        for (const slab of slabs) {
            if (!takesSlabs || Math.random() > 0.52) {
                slab.visible = false;
                continue;
            }
            slab.visible = true;
            if (Math.random() > 0.38 && imageMats.length > 0) {
                slab.material = imageMats[Math.floor(Math.random() * imageMats.length)];
                imageIndex++;
            } else {
                slab.material = colorMats[(5 * colorIndex) % colorMats.length];
                colorIndex++;
            }
        }
    }

    function createSegment(z) {
        const group = new THREE.Group();
        group.position.z = z;

        for (let i = 0; i <= cols; i++) {
            const x = -hw + i * colW;
            group.add(tube(geoTubeZ, x, -hh));
            group.add(tube(geoTubeZ, x, hh));
        }
        for (let i = 1; i < rows; i++) {
            const y = -hh + i * rowH;
            group.add(tube(geoTubeZ, -hw, y));
            group.add(tube(geoTubeZ, hw, y));
        }
        group.add(tube(geoTubeX, -hw, -hh));
        group.add(tube(geoTubeX, -hw, hh));
        group.add(tube(geoTubeY, -hw, -hh));
        group.add(tube(geoTubeY, hw, -hh));

        const slabs = SLOTS.map((slot) => {
            const m = new THREE.Mesh(slot.geo, colorMats[0]);
            m.position.copy(slot.pos);
            m.rotation.copy(slot.rot);
            m.visible = false;
            group.add(m);
            return m;
        });
        group.userData.slabs = slabs;
        populate(group);
        return group;
    }

    const segments = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
        const g = createSegment(-i * SEGMENT_DEPTH);
        scene.add(g);
        segments.push(g);
    }

    const resize = () => {
        const w = Math.max(1, frame.clientWidth);
        const h = Math.max(1, frame.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);
    resize();

    const speedVal = Math.max(0, TUNNEL_THEME.speed) / 100;
    const boostVal = Math.max(0, TUNNEL_THEME.boost) / 10;

    const animate = (now) => {
        if (!tunnelAlive) return;
        tunnelRaf = requestAnimationFrame(animate);
        const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;

        scrollPos += pressed ? boostVal : speedVal;
        const want = -SCROLL_TO_Z * scrollPos;
        camera.position.z += CAMERA_CHASE * (want - camera.position.z);

        const span = NUM_SEGMENTS * SEGMENT_DEPTH;
        const z = camera.position.z;
        for (const seg of segments) {
            if (seg.position.z > z + SEGMENT_DEPTH) {
                let min = 0;
                for (const s of segments) min = Math.min(min, s.position.z);
                seg.position.z = min - SEGMENT_DEPTH;
                populate(seg);
            } else if (seg.position.z < z - span - SEGMENT_DEPTH) {
                let max = -999999;
                for (const s of segments) max = Math.max(max, s.position.z);
                seg.position.z = max + SEGMENT_DEPTH;
                populate(seg);
            }
        }

        for (let i = fading.length - 1; i >= 0; i--) {
            const m = fading[i];
            m.opacity = Math.min(1, m.opacity + dt / FADE_IN);
            if (m.opacity >= 1) fading.splice(i, 1);
        }

        renderer.render(scene, camera);
    };
    tunnelRaf = requestAnimationFrame(animate);

    // Interactions
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover) {
        frame.style.cursor = 'none';
    }

    const onMove = (e) => {
        if (!canHover) return;
        const rect = frame.getBoundingClientRect();
        cursorLabel.style.left = `${e.clientX - rect.left}px`;
        cursorLabel.style.top = `${e.clientY - rect.top}px`;
    };

    const onLeave = () => {
        onUp();
    };

    // Timer and Start Logic
    let isStarted = false;
    let autoStartTimeout;
    let holdTimer = null;
    let holdStartTime = 0;

    const triggerStart = () => {
        if (isStarted) return;
        isStarted = true;
        pressed = true; // Speed boost effect!
        cursorLabel.style.opacity = "0";

        // Wait 1.4s (boost zooming in) then fade out and call callback
        setTimeout(() => {
            frame.style.opacity = "0";
            setTimeout(() => {
                destroyTunnel();
                if (onStartCallback) onStartCallback();
            }, 1000);
        }, 1400);
    };

    const updateLabel = () => {
        if (!pressed || isStarted) return;
        const elapsed = Date.now() - holdStartTime;
        const remaining = Math.max(3 - Math.floor(elapsed / 1000), 1);
        if (elapsed >= 3000) {
            cursorLabel.innerText = "Entering Sister's World... 🪔✨";
        } else {
            cursorLabel.innerText = `Keep holding... ${remaining} 🪔`;
        }
        if (!isStarted && pressed) requestAnimationFrame(updateLabel);
    };

    const onDown = () => {
        if (isStarted) return;
        pressed = true;
        clearTimeout(autoStartTimeout);
        holdStartTime = Date.now();
        cursorLabel.innerText = `Keep holding... 3 🪔`;
        cursorLabel.style.transform = "translate(-50%, -50%) scale(1.1)";
        updateLabel();

        holdTimer = setTimeout(() => {
            triggerStart();
        }, 3000);
    };

    const onUp = () => {
        if (!isStarted) {
            pressed = false;
            clearTimeout(holdTimer);
            cursorLabel.innerText = labelText;
            cursorLabel.style.transform = "translate(-50%, -50%) scale(1)";

            // Restart auto start safety timeout
            clearTimeout(autoStartTimeout);
            autoStartTimeout = setTimeout(() => {
                if (!isStarted) triggerStart();
            }, 10000);
        }
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("touchend", onUp, { passive: true });

    // Auto start safety fallback after 12 seconds
    autoStartTimeout = setTimeout(() => {
        if (!isStarted) triggerStart();
    }, 12000);

    // Expose cleanup
    window.destroyTunnel = () => {
        tunnelAlive = false;
        cancelAnimationFrame(tunnelRaf);
        window.removeEventListener('resize', resize);

        geoFloor.dispose();
        geoWall.dispose();
        geoTubeZ.dispose();
        geoTubeX.dispose();
        geoTubeY.dispose();
        for (const m of colorMats) m.dispose();
        for (const m of imageMats) {
            if (m.map) m.map.dispose();
            m.dispose();
        }
        lineMaterial.dispose();
        renderer.dispose();

        frame.innerHTML = '';
    };
}
