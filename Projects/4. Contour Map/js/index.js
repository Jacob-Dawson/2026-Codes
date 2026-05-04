// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const W        = 640;
const H        = 480;
const COLS     = 160;
const ROWS     = 120;
const CW       = W / COLS;
const CH       = H / ROWS;
const MAX_HOLD = 3000;
const MIN_H    = 0.18;
const MAX_H    = 0.92;
const LINE_DRK = 0.50;

// Brush radius
let sigmaPx = 52;

// Hillshading light direction: NW -45' expressed as a normalised 3-vector (east, south up) space
const RAW_LIGHT = {
    x: -1,
    y: -1,
    z: 1.6
}
const lightLen = Math.sqrt(RAW_LIGHT.x**2 + RAW_LIGHT.y**2 + RAW_LIGHT.z**2)
const LIGHT = {
    x: RAW_LIGHT.x/lightLen,
    y: RAW_LIGHT.y/lightLen,
    z: RAW_LIGHT.z/lightLen
}
const SHADE_AMB = 0.38 // ambient floor
const SHADE_STR = 0.70 // hillshade contribution on top of ambient

const PALETTE = [
    [  8,  28,  78],
    [ 20,  62, 122],
    [ 44, 100, 150],
    [ 65, 132, 108],
    [ 88, 156,  76],
    [116, 174,  68],
    [146, 186,  84],
    [174, 192, 106],
    [190, 170, 104],
    [176, 146,  96],
    [148, 116,  82],
    [120,  94,  68],
    [204, 194, 186],
    [244, 244, 248],
];
const BAND_NAMES = [
    'Deep Ocean','Ocean','Shallow','Shore','Coast','Lowland',
    'Grassland','Upland','Highland','Moor','Mountain Base',
    'Mountain','Snowline','Peak'
];
const N_BANDS = PALETTE.length;

// ─────────────────────────────────────────────
// SHARED STATE
// ─────────────────────────────────────────────
const state = {
    field:      new Float32Array(COLS * ROWS),
    baseField:  null,
    marks:      [],
    mode:       'peak',   // 'peak' | 'depression'
    dirty:      false,
};

// ─────────────────────────────────────────────
// TERRAIN LOGIC  (no p5 globals — uses the sketch ref)
// ─────────────────────────────────────────────
function doGenerate(sk) {
    sk.noiseSeed(Math.floor(Math.random() * 99999));
    state.marks     = [];
    state.baseField = new Float32Array(COLS * ROWS);

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const x = c / COLS, y = r / ROWS;
            const dx = x - 0.5,  dy = y - 0.5;
            const falloff = Math.max(0, 1 - Math.pow(Math.sqrt(dx*dx+dy*dy) / 0.44, 2.5));
            let n = 0, amp = 0.5, freq = 1, maxA = 0;
            for (let o = 0; o < 7; o++) {
                n += sk.noise(x*freq*3.8, y*freq*3.8) * amp;
                maxA += amp; amp *= 0.48; freq *= 2.1;
            }
            state.baseField[r * COLS + c] = (n / maxA) * falloff;
        }
    }
    computeField();
    state.dirty = true;
}

function doClear() {
    state.baseField = null;
    state.marks     = [];
    computeField();
    state.dirty = true;
}

function doUndo() {
    if (state.marks.length === 0) return;
    state.marks.pop();
    computeField();
    state.dirty = true;
}

function doExport(sk){

    // Grab the pixel data straight from the p5 canvas and trigger a download
    try{
        const dataURL = sk.canvas.toDataURL('image/png')
        const a       = document.createElement("a")
        a.href        = dataURL
        a.download    = 'topo-map.png'
        a.click()
    } catch (e) {
        console.warn('Export failed:', e)
    }

}

function computeField() {
    if (state.baseField) { 
        state.field.set(state.baseField); 
    } else { 
        state.field.fill(0.04); 
    }

    for (const mk of state.marks) {
        const pc = (mk.x / W) * COLS;
        const pr = (mk.y / H) * ROWS;
        const sg = (mk.sigma / W) * COLS;
        const t2 = 2 * sg * sg;
        for (let r = 0; r < ROWS; r++) {
            const dr2 = (r - pr) ** 2;
            for (let c = 0; c < COLS; c++) {
                const g   = mk.h * Math.exp(-((c-pc)**2 + dr2) / t2);
                const idx = r * COLS + c;
                state.field[idx] = Math.min(1, Math.max(0, state.field[idx] + mk.sign * g));
            }
        }
    }
}

function commitMark(elapsed, x, y) {
    if(elapsed < 30) return
    const t    = Math.min(elapsed / MAX_HOLD, 1);
    const h    = MIN_H + t * (MAX_H - MIN_H);
    const sign = state.mode === 'depression' ? -1 : 1;
    state.marks.push({ x, y, h, sign, sigma: sigmaPx });
    computeField();
    state.dirty = true;
}

// ─────────────────────────────────────────────
// RENDER INTO BUFFER
// ─────────────────────────────────────────────
function renderMap(sk, buf) {

    // 1. Band assignment
    const bands = new Uint8Array(COLS * ROWS);
    for (let i = 0; i < state.field.length; i++) {
        bands[i] = Math.min(Math.floor(state.field[i] * N_BANDS), N_BANDS - 1);
    }

    // 2. Hillshading

    const shade = new Float32Array(COLS * ROWS)

    for(let r = 0; r < ROWS; r++){

        for(let c = 0; c < COLS; c++){

            const r0 = Math.max(0, r - 1), r1 = Math.min(ROWS - 1, r + 1)
            const c0 = Math.max(0, c - 1), c1 = Math.min(COLS - 1, c + 1)
            const dhdx = (state.field[r * COLS + c1] - state.field[r * COLS + c0]) / (c1 - c0) * 8
            const dhdy = (state.field[r1 * COLS + c] - state.field[r0 * COLS + c]) / (r1 - r0) * 8
            // Surface normal: (-dhdx, -dhdy, 1) then normalised
            const nLen = Math.sqrt(dhdx*dhdx + dhdy*dhdy + 1)
            const dot = (-dhdx * LIGHT.x + -dhdy * LIGHT.y + LIGHT.z) / nLen
            shade[r * COLS + c] = SHADE_AMB + SHADE_STR * Math.max(0, dot)

        }

    }

    // 3. Fill pixel buffer
    buf.loadPixels();
    const px = buf.pixels;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const [R,G,B] = PALETTE[bands[r*COLS+c]];
            const s       = shade[r * COLS + c]
            const fr      = R * s | 0
            const fg      = G * s | 0
            const fb      = B * s | 0

            for (let dy = 0; dy < CH; dy++) {
                const rb = ((r*CH+dy)*W + c*CW) * 4;
                for (let dx = 0; dx < CW; dx++) {
                    const i = rb + dx*4;
                    px[i]=fr; px[i+1]=fg; px[i+2]=fb; px[i+3]=255;
                }
            }
        }
    }

    // 4. Contour lines

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const b = bands[r*COLS+c];
            if (c < COLS-1 && bands[r*COLS+c+1] !== b) {
                const bx = (c+1)*CW;
                for (let dy = 0; dy < CH; dy++) {
                    const i = ((r*CH+dy)*W + bx)*4;
                    px[i]=px[i]*LINE_DRK|0; 
                    px[i+1]=px[i+1]*LINE_DRK|0; 
                    px[i+2]=px[i+2]*LINE_DRK|0;
                }
            }
            if (r < ROWS-1 && bands[(r+1)*COLS+c] !== b) {
                const by = (r+1)*CH;
                for (let dx = 0; dx < CW; dx++) {
                    const i = (by*W + c*CW+dx)*4;
                    px[i]=px[i]*LINE_DRK|0; 
                    px[i+1]=px[i+1]*LINE_DRK|0; 
                    px[i+2]=px[i+2]*LINE_DRK|0;
                }
            }
        }
    }

    buf.updatePixels();

    // ── 5. Elevation labels ──
    // Each band boundary = a contour line at a known elevation (0–1300 m in 100 m steps).
    // We collect boundary midpoints per band level and place labels spaced ≥120 px apart
    // so they never crowd together. A small white knockout behind each label keeps it
    // readable on any terrain colour.
    const LABEL_SPACING = 120; // min px between labels on the same level
    const ELEV_STEP     = 100; // metres per band

    buf.push();
    //buf.textFont('monospace');
    //buf.textSize(7.5);
    buf.textAlign(buf.CENTER, buf.CENTER);

    // For each band transition level (0→1, 1→2 … 12→13) collect candidate positions
    for (let level = 0; level < N_BANDS - 1; level++) {
        const elevM   = (level + 1) * ELEV_STEP; // e.g. 100, 200 … 1300
        const isIndex = elevM % 500 === 0
        const label   = elevM + 'm';
        const placed  = []; // {x, y} of labels already drawn for this level

        // Scan right-boundaries first, then bottom-boundaries
        const candidates = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 1; c++) {
                if (bands[r * COLS + c] === level && bands[r * COLS + c + 1] === level + 1) {
                    candidates.push({
                        x: (c + 1) * CW,
                        y: r * CH + CH / 2,
                    });
                }
            }
        }
        for (let r = 0; r < ROWS - 1; r++) {
            for (let c = 0; c < COLS; c++) {
                if (bands[r * COLS + c] === level && bands[(r + 1) * COLS + c] === level + 1) {
                    candidates.push({
                        x: c * CW + CW / 2,
                        y: (r + 1) * CH,
                    });
                }
            }
        }

        // Place a label every LABEL_SPACING px, skipping if too close to an existing one
        // Sample evenly through the candidate list rather than clustering at the top-left
        const step = Math.max(1, Math.floor(candidates.length / 12));
        for (let i = 0; i < candidates.length; i += step) {
            const {x, y} = candidates[i];

            // Check distance from all already-placed labels on this level
            let tooClose = false;
            for (const p of placed) {
                const dx = x - p.x, dy = y - p.y;
                if (dx * dx + dy * dy < LABEL_SPACING * LABEL_SPACING) { tooClose = true; break; }
            }
            if (tooClose) continue;

            // White knockout rectangle
            const tw = isIndex ? 26 : 20;
            const th = isIndex ? 10 : 9;
            buf.noStroke();
            buf.fill(255, 255, 255, isIndex ? 175 : 140);
            buf.rect(x - tw / 2, y - th / 2, tw, th, 1);

            // Label text — dark brown, readable on any band colour
            buf.textFont('monospace');
            buf.textSize(isIndex ? 8.5 : 7.5);
            buf.fill(isIndex ? buf.color(20, 12, 4, 230) : buf.color(40, 28, 12, 190));
            buf.noStroke();
            buf.text(label, x, y);

            placed.push({x, y});
        }
    }

    buf.pop();
}

// ─────────────────────────────────────────────
// OVERLAYS
// ─────────────────────────────────────────────
function drawHoldIndicator(sk, x, y, t, isDepress) {
    const radius = 20 + t * 42;
    const c1 = isDepress ? sk.color(80,160,255,210)  : sk.color(255,220, 80,210);
    const c2 = isDepress ? sk.color(20, 60,200,220)  : sk.color(255, 70, 20,220);
    const col = sk.lerpColor(c1, c2, t);

    sk.push();
    sk.noFill(); 
    sk.stroke(0,0,0,80); sk.strokeWeight(5); sk.circle(x, y, radius*2);

    sk.stroke(isDepress ? sk.color(100,180,255,18) : sk.color(255,255,200,18));
    sk.strokeWeight(1); sk.circle(x, y, sigmaPx*2);

    sk.stroke(col); sk.strokeWeight(3);
    sk.arc(x, y, radius*2, radius*2, -sk.HALF_PI, -sk.HALF_PI + t*sk.TWO_PI);

    sk.noStroke(); sk.fill(col); sk.circle(x, y, 9);

    if (t > 0.02) {
        sk.noStroke(); sk.fill(255,255,210,200);
        sk.textFont('monospace'); sk.textSize(10); sk.textAlign(sk.CENTER, sk.CENTER);
        sk.text((isDepress ? '▼ ' : '▲ ') + Math.floor(t*100) + '%', x, y + radius + 10);
    }
    sk.pop();
}

function drawHoverPreview(sk, x, y, isDepress) {
    if (x < 0 || x > W || y < 0 || y > H) return;
    sk.push();
    sk.noFill();
    sk.stroke(isDepress ? sk.color(100,180,255,40) : sk.color(255,255,200,40));
    sk.strokeWeight(1); sk.circle(x, y, sigmaPx*2);
    sk.noStroke();
    sk.fill(isDepress ? sk.color(100,180,255,70) : sk.color(255,255,200,70));
    sk.circle(x, y, 5);
    sk.pop();
}

// ─────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────
function buildLegend() {
    const el = document.getElementById('legend');
    if(!el) return
    PALETTE.forEach(([r,g,b], i) => {
        const d = document.createElement('div');
        d.className = 'ls';
        d.style.background = `rgb(${r},${g},${b})`;
        d.title = BAND_NAMES[i];
        el.appendChild(d);
    });
}

// Brush label helper
function brushLabel(px){

    if(px <= 36) return 'Brush: XS'
    if(px <= 52) return 'Brush: S'
    if(px <= 72) return 'Brush: M'
    if(px <= 96) return 'Brush: L'
    return 'Brush: XL'

}

// ─────────────────────────────────────────────
// P5 INSTANCE MODE  ← key fix
// The sketch is scoped to the canvas wrap only.
// Touch/mouse handlers are attached to the canvas
// element directly — they do NOT intercept the
// rest of the document (buttons, etc.)
// ─────────────────────────────────────────────
new p5(function(sk) {
    let mapBuf;
    let holdStart   = null;
    let holdX = 0, holdY = 0;
    let hoverX = -999, hoverY = -999;

    // ── canvas-local helpers ──
    function canvasPos(clientX, clientY) {
        // Convert a clientX/Y into canvas-space coordinates,
        // accounting for any CSS scaling (max-width: 100%).
        const rect  = sk.canvas.getBoundingClientRect();
        if(!rect.width || !rect.height) return {x: 0, y: 0}
        return {
            x: (clientX - rect.left) * (W / rect.width),
            y: (clientY - rect.top)  * (H / rect.height),
        };
    }

    sk.setup = function() {
        const cnv = sk.createCanvas(W, H);
        cnv.parent('canvas-wrap');
        sk.pixelDensity(1);

        mapBuf = sk.createGraphics(W, H);
        mapBuf.pixelDensity(1);

        buildLegend();

        // ── Attach touch handlers DIRECTLY to the canvas element ──
        // This way they only fire for canvas touches, not button taps.
        const el = sk.canvas;

        el.addEventListener('touchstart', (e) => {
            e.preventDefault(); // prevent scroll on canvas only
            const t0 = e.touches[0];
            if(!t0) return
            const {x, y} = canvasPos(t0.clientX, t0.clientY);
            holdStart = performance.now();
            holdX = x; holdY = y;
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (holdStart !== null) {
                commitMark(performance.now() - holdStart, holdX, holdY);
                holdStart = null;
            }
            hoverX = -999; hoverY = -999;
        }, { passive: false });

        el.addEventListener('touchcancel', () => { 
            holdStart = null; 
            hoverX = -999; 
            hoverY = -999; 
        });

        // Wire up buttons now that p5 is ready
        document.getElementById('btn-generate')?.addEventListener('click', () => doGenerate(sk));
        document.getElementById('btn-undo')?.addEventListener('click', doUndo);
        document.getElementById('btn-clear')?.addEventListener('click', doClear);
        document.getElementById('btn-export')?.addEventListener('click', () => doExport(sk))

        document.getElementById('btn-peak')?.addEventListener('click', () => {
            state.mode = 'peak';
            document.getElementById('btn-peak')?.classList.add('active');
            document.getElementById('btn-depression')?.classList.remove('active');
        });

        document.getElementById('btn-depression')?.addEventListener('click', () => {
            state.mode = 'depression';
            document.getElementById('btn-depression')?.classList.add('active');
            document.getElementById('btn-peak')?.classList.remove('active');
        });

        // Brush slider
        const slider = document.getElementById("brush-slider")
        const label = document.getElementById("brush-label")
        slider?.addEventListener('input', () => {
            sigmaPx = parseInt(slider.value, 10)
            if(label) label.textContent = brushLabel(sigmaPx)
        })

        doGenerate(sk);

        // Mark as touch device on first touchstart (permanent — mixed input is rare)
        //sk.canvas.addEventListener('touchstart', () => { isTouch = true; }, { once: true });
    };

    sk.draw = function() {
        if (state.dirty) { 
            renderMap(sk, mapBuf); 
            state.dirty = false; 
        }
        sk.clear();
        sk.image(mapBuf, 0, 0);

        const isDepress = state.mode === 'depression';
        if (holdStart !== null) {
            const t = Math.min((performance.now() - holdStart) / MAX_HOLD, 1);
            drawHoldIndicator(sk, holdX, holdY, t, isDepress);
        } else {
            drawHoverPreview(sk, hoverX, hoverY, isDepress);
        }

        if (!state.baseField && state.marks.length === 0 && holdStart === null) {
            sk.noStroke(); sk.fill(255,255,200,28);
            sk.textFont('monospace'); sk.textSize(11); sk.textAlign(sk.CENTER, sk.CENTER);
            sk.text('TAP AND HOLD TO SCULPT TERRAIN', W/2, H/2);
        }
    };

    // ── Block p5 from converting touch events into mouse events ──
    // Without this, p5 fires mouseMoved/mousePressed/mouseReleased on every touch,
    // which updates hoverX/Y and double-fires commit logic on mobile.
    sk.touchStarted  = function() { return false; };
    sk.touchMoved    = function() { return false; };
    sk.touchEnded    = function() { return false; };

    // ── Mouse input (desktop only) ──
    let isTouch = false; // set true the first time a real touch is detected

    sk.mouseMoved = function() {
        if (isTouch) return; // ignore synthetic mouse events from touch
        hoverX = sk.mouseX;
        hoverY = sk.mouseY;
    };

    sk.mousePressed = function() {
        if (isTouch) return;
        if (sk.mouseX < 0 || sk.mouseX > W || sk.mouseY < 0 || sk.mouseY > H) return;
        holdStart = performance.now();
        holdX = sk.mouseX; holdY = sk.mouseY;
    };

    sk.mouseReleased = function() {
        if (isTouch || holdStart === null) return;
        commitMark(performance.now() - holdStart, holdX, holdY);
        holdStart = null;
    };

    // Mark as touch device on first touchstart (permanent — mixed input is rare)
    //sk.canvas.addEventListener('touchstart', () => { isTouch = true; }, { once: true });
    //sk.canvas.addEventListener('mousedown', () => {isTouch = true; }, {once: true})

}, 'canvas-wrap'); // ← scope the sketch to the canvas container