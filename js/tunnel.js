/**
 * tunnel.js  — SUPREME v2.0
 * Three.js 3D Infinite Sacred Geometry Memory Tunnel
 * Features: Glowing gold grid · Floating mandala rings · Diya particle embers
 *           · Photo memory slabs · Sibling memory floaters · Camera sway
 */

'use strict';

const TUNNEL_THEME = {
    background: '#0d0205',
    lineColor:  '#f5a623',
    lineOpacity: 58,
    colors:  ['#ffd700', '#ff9800', '#d50000', '#f4a300', '#e65100', '#ffe082', '#ff6f00'],
    grid:    4,
    speed:   75,
    boost:   280,
    fade:    92
};

const TUNNEL_W        = 2.4;
const TUNNEL_H        = 2.0;
const SEG_D           = 1.2;
const NUM_SEGS        = 18;
const LINE_R          = 0.0032;
const SCROLL_TO_Z     = 0.05;
const CAM_CHASE       = 0.10;
const CAM_SWAY_AMP    = 0.06;   // Camera gentle sway
const FADE_IN         = 0.75;
const FOG_FAR         = NUM_SEGS * SEG_D * 0.93;

let tunnelScene, tunnelCamera, tunnelRenderer, tunnelRaf;
let tunnelAlive = false;

function initTunnel(containerId, onStartCallback) {
    const frame = document.getElementById(containerId);
    if (!frame) return;

    const cfg        = window.RakhiConfig || {};
    const photoList  = (cfg.photos && cfg.photos.length > 0) ? cfg.photos : [
        'assets/images/demo/img1.svg','assets/images/demo/img2.svg',
        'assets/images/demo/img3.svg','assets/images/demo/img4.svg',
        'assets/images/demo/img5.svg','assets/images/demo/img6.svg'
    ];
    const labelText  = cfg.tunnelLabel || "Hold to Enter Sister's World 🪔";

    /* ── Canvas ── */
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    frame.appendChild(canvas);

    /* ── Vignette overlay ── */
    const vignette = document.createElement('div');
    vignette.className = 'tunnel-embers';
    frame.appendChild(vignette);

    /* ── Floating diya embers ── */
    for (let i = 0; i < 22; i++) createEmber(frame);

    /* ── Hold label ── */
    const cursorLabel = document.createElement('div');
    cursorLabel.className = 'tunnel-label';
    cursorLabel.innerText  = labelText;
    frame.appendChild(cursorLabel);

    /* ── THREE Setup ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(TUNNEL_THEME.background);

    const fogNear = Math.min(
        FOG_FAR * (1 - Math.min(100, Math.max(0, TUNNEL_THEME.fade)) / 100),
        FOG_FAR - 0.01
    );
    scene.fog = new THREE.FogExp2(new THREE.Color(TUNNEL_THEME.background), 0.048);

    const camera = new THREE.PerspectiveCamera(55, frame.clientWidth / frame.clientHeight, 0.4, 1000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping    = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    /* ── Point Lights ── */
    const ambientLight = new THREE.AmbientLight(0xffa040, 0.5);
    scene.add(ambientLight);

    const goldLight1 = new THREE.PointLight(0xffd700, 1.8, 6);
    goldLight1.position.set(0, 0, -2);
    scene.add(goldLight1);

    const goldLight2 = new THREE.PointLight(0xff6600, 1.2, 8);
    goldLight2.position.set(0, 0, -6);
    scene.add(goldLight2);

    /* ── Materials ── */
    const lineMat = new THREE.MeshBasicMaterial({
        color:       new THREE.Color(TUNNEL_THEME.lineColor),
        transparent: true,
        opacity:     TUNNEL_THEME.lineOpacity / 100,
    });

    const colorMats = TUNNEL_THEME.colors.map(h =>
        new THREE.MeshBasicMaterial({ color: new THREE.Color(h), side: THREE.DoubleSide, transparent: true, opacity: 0.72 })
    );

    const loader  = new THREE.TextureLoader();
    const fading  = [];

    const imageMats = photoList.map((url) => {
        const mat = new THREE.MeshBasicMaterial({
            transparent: true, opacity: 0, side: THREE.DoubleSide,
            color: new THREE.Color(1.3, 1.25, 1.1),
        });
        loader.load(url, (tex) => {
            if (!tunnelAlive) { tex.dispose(); return; }
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            mat.map = tex;
            mat.needsUpdate = true;
            fading.push(mat);
        });
        return mat;
    });

    /* ── Sacred Mandala Rings ── */
    const mandalaRings = [];
    for (let i = 0; i < 6; i++) {
        const ring = createMandalaRing(i);
        ring.position.z = -(i * 3.5 + 2);
        scene.add(ring);
        mandalaRings.push(ring);
    }

    /* ── Star Field particles ── */
    const starGeo = new THREE.BufferGeometry();
    const starCount = 280;
    const starVerts = [];
    for (let i = 0; i < starCount; i++) {
        starVerts.push(
            (Math.random() - 0.5) * 4.5,
            (Math.random() - 0.5) * 3.8,
            -(Math.random() * NUM_SEGS * SEG_D)
        );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.018, transparent: true, opacity: 0.65, sizeAttenuation: true });
    const stars   = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Geometry primitives ── */
    const hw   = TUNNEL_W / 2, hh = TUNNEL_H / 2;
    const cols = Math.max(1, Math.round(TUNNEL_THEME.grid));
    const rows = Math.max(1, Math.round(TUNNEL_THEME.grid));
    const colW = TUNNEL_W / cols;
    const rowH = TUNNEL_H / rows;

    const geoFloor = new THREE.PlaneGeometry(colW, SEG_D);
    const geoWall  = new THREE.PlaneGeometry(SEG_D, rowH);
    const geoTubeZ = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-SEG_D)), 1, LINE_R, 8);
    const geoTubeX = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(TUNNEL_W,0,0)), 1, LINE_R, 8);
    const geoTubeY = new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,TUNNEL_H,0)), 1, LINE_R, 8);

    const SLOTS = buildSlots(hw, hh, cols, rows, colW, rowH, SEG_D, geoFloor, geoWall);

    let populateIndex = 0, colorIndex = 0;

    function buildSlots(hw, hh, cols, rows, colW, rowH, SEG_D, geoFloor, geoWall) {
        const s = [];
        const z = -SEG_D / 2;
        for (let i = 0; i < cols; i++) {
            const x = -hw + i * colW + colW / 2;
            s.push({ geo: geoFloor, pos: new THREE.Vector3(x, -hh, z), rot: new THREE.Euler(-Math.PI/2,0,0) });
            s.push({ geo: geoFloor, pos: new THREE.Vector3(x,  hh, z), rot: new THREE.Euler( Math.PI/2,0,0) });
        }
        for (let i = 0; i < rows; i++) {
            const y = -hh + i * rowH + rowH / 2;
            s.push({ geo: geoWall, pos: new THREE.Vector3(-hw, y, z), rot: new THREE.Euler(0, Math.PI/2,0) });
            s.push({ geo: geoWall, pos: new THREE.Vector3( hw, y, z), rot: new THREE.Euler(0,-Math.PI/2,0) });
        }
        return s;
    }

    function populate(group) {
        const takesSlabs = populateIndex % 2 === 0;
        populateIndex++;
        for (const slab of group.userData.slabs) {
            if (!takesSlabs || Math.random() > 0.55) { slab.visible = false; continue; }
            slab.visible = true;
            if (Math.random() > 0.35 && imageMats.length > 0) {
                slab.material = imageMats[Math.floor(Math.random() * imageMats.length)];
            } else {
                slab.material = colorMats[(5 * colorIndex) % colorMats.length];
                colorIndex++;
            }
        }
    }

    function tube(geo, x, y, z = 0) {
        const m = new THREE.Mesh(geo, lineMat);
        m.position.set(x, y, z);
        return m;
    }

    function createSegment(z) {
        const group = new THREE.Group();
        group.position.z = z;

        for (let i = 0; i <= cols; i++) {
            const x = -hw + i * colW;
            group.add(tube(geoTubeZ, x, -hh));
            group.add(tube(geoTubeZ, x,  hh));
        }
        for (let i = 1; i < rows; i++) {
            const y = -hh + i * rowH;
            group.add(tube(geoTubeZ, -hw, y));
            group.add(tube(geoTubeZ,  hw, y));
        }
        group.add(tube(geoTubeX, -hw, -hh));
        group.add(tube(geoTubeX, -hw,  hh));
        group.add(tube(geoTubeY, -hw, -hh));
        group.add(tube(geoTubeY,  hw, -hh));

        const slabs = SLOTS.map(slot => {
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
    for (let i = 0; i < NUM_SEGS; i++) {
        const g = createSegment(-i * SEG_D);
        scene.add(g);
        segments.push(g);
    }

    /* ── Resize ── */
    const resize = () => {
        const w = Math.max(1, frame.clientWidth);
        const h = Math.max(1, frame.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);
    resize();

    /* ── Animation Loop ── */
    const speedVal = Math.max(0, TUNNEL_THEME.speed) / 100;
    const boostVal = Math.max(0, TUNNEL_THEME.boost) / 10;

    let scrollPos = 0, last = 0, pressed = false;
    let swayPhase = 0;
    tunnelAlive   = true;

    const animate = (now) => {
        if (!tunnelAlive) return;
        tunnelRaf    = requestAnimationFrame(animate);
        const dt     = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;

        scrollPos += pressed ? boostVal : speedVal;
        const want = -SCROLL_TO_Z * scrollPos;
        camera.position.z += CAM_CHASE * (want - camera.position.z);

        /* Gentle camera sway */
        swayPhase += dt * 0.35;
        camera.position.x = Math.sin(swayPhase) * CAM_SWAY_AMP;
        camera.position.y = Math.cos(swayPhase * 0.7) * CAM_SWAY_AMP * 0.6;

        /* Scroll segments */
        const span = NUM_SEGS * SEG_D;
        const z    = camera.position.z;
        for (const seg of segments) {
            if (seg.position.z > z + SEG_D) {
                let min = 0;
                for (const s of segments) min = Math.min(min, s.position.z);
                seg.position.z = min - SEG_D;
                populate(seg);
            } else if (seg.position.z < z - span - SEG_D) {
                let max = -999999;
                for (const s of segments) max = Math.max(max, s.position.z);
                seg.position.z = max + SEG_D;
                populate(seg);
            }
        }

        /* Fade-in textures */
        for (let i = fading.length - 1; i >= 0; i--) {
            const m = fading[i];
            m.opacity = Math.min(1, m.opacity + dt / FADE_IN);
            if (m.opacity >= 1) fading.splice(i, 1);
        }

        /* Animate mandala rings */
        for (let i = 0; i < mandalaRings.length; i++) {
            mandalaRings[i].rotation.z += dt * (0.12 + i * 0.04) * (i % 2 === 0 ? 1 : -1);
            mandalaRings[i].position.z = -(((scrollPos * SCROLL_TO_Z + i * 3.5 + 2) % (NUM_SEGS * SEG_D)) + 2);
        }

        /* Pulsing lights */
        goldLight1.intensity = 1.8 + Math.sin(now * 0.002) * 0.5;
        goldLight1.position.z = camera.position.z - 2.5;
        goldLight2.position.z = camera.position.z - 7;

        /* Star field movement */
        stars.position.z = camera.position.z;

        renderer.render(scene, camera);
    };
    tunnelRaf = requestAnimationFrame(animate);

    /* ── Interaction ── */
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover) frame.style.cursor = 'none';

    const onMove = (e) => {
        if (!canHover) return;
        const rect = frame.getBoundingClientRect();
        cursorLabel.style.left = `${e.clientX - rect.left}px`;
        cursorLabel.style.top  = `${e.clientY - rect.top}px`;
    };

    let isStarted = false, autoStartTimeout, holdTimer = null, holdStartTime = 0;

    const triggerStart = () => {
        if (isStarted) return;
        isStarted = true;
        pressed   = true;
        cursorLabel.style.opacity = '0';
        setTimeout(() => {
            frame.style.transition = 'opacity 1.2s ease';
            frame.style.opacity    = '0';
            setTimeout(() => {
                destroyTunnel();
                if (onStartCallback) onStartCallback();
            }, 1200);
        }, 1400);
    };

    const updateLabel = () => {
        if (!pressed || isStarted) return;
        const elapsed   = Date.now() - holdStartTime;
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
        cursorLabel.style.transform = 'translate(-50%,-50%) scale(1.12)';
        updateLabel();
        holdTimer = setTimeout(triggerStart, 3000);
    };

    const onUp = () => {
        if (!isStarted) {
            pressed = false;
            clearTimeout(holdTimer);
            cursorLabel.innerText   = labelText;
            cursorLabel.style.transform = 'translate(-50%,-50%) scale(1)';
            clearTimeout(autoStartTimeout);
            autoStartTimeout = setTimeout(() => { if (!isStarted) triggerStart(); }, 10000);
        }
    };

    frame.addEventListener('pointermove', onMove);
    frame.addEventListener('pointerleave', onUp);
    frame.addEventListener('pointerdown', onDown);
    frame.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchend', onUp, { passive: true });

    // Auto-start safety fallback
    autoStartTimeout = setTimeout(() => { if (!isStarted) triggerStart(); }, 12000);

    /* ── Cleanup ── */
    window.destroyTunnel = () => {
        tunnelAlive = false;
        cancelAnimationFrame(tunnelRaf);
        window.removeEventListener('resize', resize);
        geoFloor.dispose(); geoWall.dispose();
        geoTubeZ.dispose(); geoTubeX.dispose(); geoTubeY.dispose();
        for (const m of colorMats) m.dispose();
        for (const m of imageMats) { if (m.map) m.map.dispose(); m.dispose(); }
        lineMat.dispose();
        starGeo.dispose(); starMat.dispose();
        renderer.dispose();
        frame.innerHTML = '';
    };
}

/* ─── Mandala Ring Creator ─────────────────────────────────────────── */
function createMandalaRing(index) {
    const group = new THREE.Group();
    const petals = 12 + index * 2;
    const radius = 0.7 + index * 0.12;
    const goldColors = [0xffd700, 0xff9800, 0xf4a300, 0xffe082, 0xd4af37];
    const col   = goldColors[index % goldColors.length];
    const mat   = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.18 + index * 0.04, side: THREE.DoubleSide });

    for (let i = 0; i < petals; i++) {
        const angle  = (i / petals) * Math.PI * 2;
        const pGeo   = new THREE.TorusGeometry(0.03, 0.008, 4, 8);
        const pMesh  = new THREE.Mesh(pGeo, mat);
        pMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        group.add(pMesh);
    }

    // Outer circle
    const cirGeo = new THREE.TorusGeometry(radius, 0.006, 4, 60);
    const cirMesh = new THREE.Mesh(cirGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28 }));
    group.add(cirMesh);

    return group;
}

/* ─── Floating Diya Ember ─────────────────────────────────────────── */
function createEmber(container) {
    const el = document.createElement('div');
    const size = Math.random() * 6 + 3;
    el.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff9c4, #ff9800 60%, transparent);
        box-shadow: 0 0 ${size * 2}px ${Math.random() > 0.5 ? '#ffd700' : '#ff9800'};
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 30}%;
        pointer-events: none;
        animation: emberFloat ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 6}s infinite;
    `;
    container.appendChild(el);

    if (!document.getElementById('ember-style')) {
        const style = document.createElement('style');
        style.id = 'ember-style';
        style.textContent = `
            @keyframes emberFloat {
                0%   { transform: translateY(0) scale(1);   opacity: 0; }
                10%  { opacity: 0.85; }
                90%  { opacity: 0.5; }
                100% { transform: translateY(-90vh) scale(0.4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
