/**
 * Abrar Shaikh - Semiconductor Visual Replica app.js
 * Renders the background grid circuit, the detailed CPU Die visualizer on the landing page,
 * real-time IST clock ticker, and binds subpage widgets (oscilloscope, skills, contact serial logs).
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initBackgroundAnimation();
    initClockTicker();
    initTypewriterBoot();
    
    // Page specific scripts routing
    if (document.getElementById('chip-canvas')) {
        initChipVisualizer();
    }
    if (document.getElementById('chip-svg-b')) {
        initChipSvgBGlitch();
    }
    if (document.getElementById('oscilloscope-canvas')) {
        initOscilloscope();
    }
    if (document.querySelector('.skills-grid')) {
        initSkillsFilter();
    }
    if (document.getElementById('contact-form')) {
        initContactConsole();
    }
    if (document.getElementById('exp-tabs')) {
        initExperienceTabs();
    }
});


/* ==========================================================================
   Mobile Nav Drawer
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const links = document.querySelectorAll('.mobile-nav-links a');

    if (!toggleBtn || !drawer) return;

    function toggleMenu() {
        toggleBtn.classList.toggle('active');
        drawer.classList.toggle('open');
    }

    toggleBtn.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (drawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   Live Timezone Clock (HH:MM:SS IST)
   ========================================================================== */
function initClockTicker() {
    const clockEl = document.getElementById('nav-clock');
    if (!clockEl) return;

    function updateClock() {
        // IST offset is UTC +5:30. Let's construct a target time using Date
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + (3600000 * 5.5)); // add 5.5 hours

        const hh = String(istTime.getHours()).padStart(2, '0');
        const mm = String(istTime.getMinutes()).padStart(2, '0');
        const ss = String(istTime.getSeconds()).padStart(2, '0');
        
        clockEl.textContent = `${hh}:${mm}:${ss} IST`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   Typewriter Boot Text (Hero Section)
   ========================================================================== */
function initTypewriterBoot() {
    const el = document.getElementById('boot-text');
    if (!el) return;

    const fullText = '> initializing bootloader...';
    let i = 0;
    const id = setInterval(() => {
        i++;
        el.textContent = fullText.slice(0, i);
        if (i >= fullText.length) clearInterval(id);
    }, 55);
}

/* ==========================================================================
   Chip SVG B — glitching label rotator
   ========================================================================== */
function initChipSvgBGlitch() {
    const labelEl = document.getElementById('chip-label-b');
    const subEl   = document.getElementById('chip-sub-b');
    if (!labelEl) return;

    const labels = ['CORTEX-A', 'RISC-V64', 'S12Z-MCU', 'CORTEX-M', 'AURIX-TC'];
    const subs   = ['> exec bootrom', '> ok signature', '> verify hash', '> load payload', '> boot complete'];
    let tick = 0;

    setInterval(() => {
        tick++;
        const idx = Math.floor(tick / 22) % labels.length;
        labelEl.textContent = labels[idx];
        if (subEl) subEl.textContent = subs[tick % 40 < 20 ? idx : (idx + 1) % subs.length];
    }, 90);
}

/* ==========================================================================
   Background Canvas Animation — PCB Circuit Electron Flow
   Dense grid-snapped traces with glowing electron comet trails & via pads
   ========================================================================== */
function initBackgroundAnimation() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildNetwork();
    });

    const GRID   = 50;       // snap-to grid (matches pcb-grid CSS)
    const COLS   = Math.ceil(W / GRID) + 1;
    const ROWS   = Math.ceil(H / GRID) + 1;

    /* ── Network of grid nodes and edges ── */
    let edges    = [];   // { x1,y1, x2,y2 }
    let vias     = [];   // { x, y }
    let electrons = [];

    const MAX_ELECTRONS = 55;
    const TRAIL_LEN     = 22;   // comet trail segments

    function buildNetwork() {
        edges  = [];
        vias   = [];
        electrons = [];

        const cols = Math.ceil(W / GRID) + 1;
        const rows = Math.ceil(H / GRID) + 1;

        // Generate a sparse set of grid-snapped traces
        // Horizontal traces
        for (let row = 0; row < rows; row++) {
            if (Math.random() > 0.45) continue; // ~55% of rows get a trace
            const y = row * GRID;
            let x = Math.floor(Math.random() * 3) * GRID;
            const endX = (cols - 1 - Math.floor(Math.random() * 3)) * GRID;
            while (x < endX) {
                const segLen = (1 + Math.floor(Math.random() * 5)) * GRID;
                const nx = Math.min(x + segLen, endX);
                edges.push({ x1: x, y1: y, x2: nx, y2: y });
                // sometimes branch vertically
                if (Math.random() > 0.6) {
                    const bLen = (1 + Math.floor(Math.random() * 3)) * GRID * (Math.random() > 0.5 ? 1 : -1);
                    const vy = Math.max(0, Math.min((rows - 1) * GRID, y + bLen));
                    edges.push({ x1: nx, y1: y, x2: nx, y2: vy });
                    vias.push({ x: nx, y: y });
                    vias.push({ x: nx, y: vy });
                }
                x = nx;
            }
        }

        // Vertical traces
        for (let col = 0; col < cols; col++) {
            if (Math.random() > 0.40) continue;
            const x = col * GRID;
            let y = Math.floor(Math.random() * 3) * GRID;
            const endY = (rows - 1 - Math.floor(Math.random() * 3)) * GRID;
            while (y < endY) {
                const segLen = (1 + Math.floor(Math.random() * 4)) * GRID;
                const ny = Math.min(y + segLen, endY);
                edges.push({ x1: x, y1: y, x2: x, y2: ny });
                y = ny;
            }
        }

        // Keep unique vias
        vias = vias.filter((v, i, arr) =>
            arr.findIndex(u => u.x === v.x && u.y === v.y) === i
        );

        // Spawn electrons
        for (let i = 0; i < MAX_ELECTRONS; i++) {
            electrons.push(new Electron());
        }
    }

    /* ── Electron class with comet trail ── */
    class Electron {
        constructor() { this.spawn(); }

        spawn() {
            if (edges.length === 0) return;
            const e = edges[Math.floor(Math.random() * edges.length)];
            this.x   = e.x1; this.y = e.y1;
            this.tx  = e.x2; this.ty = e.y2;
            const dx = this.tx - this.x;
            const dy = this.ty - this.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const spd = 1.2 + Math.random() * 2.2;
            this.vx  = (dx / len) * spd;
            this.vy  = (dy / len) * spd;
            this.trail = [];
            // amber 70%, green 20%, cyan 10%
            const r = Math.random();
            this.color = r < 0.70 ? '#ffb020'
                       : r < 0.90 ? '#4ade80'
                       :            '#22d3ee';
            this.size  = 1.8 + Math.random() * 1.4;
            this.done  = false;
        }

        update() {
            if (this.done) { this.spawn(); return; }

            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > TRAIL_LEN) this.trail.shift();

            this.x += this.vx;
            this.y += this.vy;

            // Check if passed target
            const toEndX = this.tx - this.x;
            const toEndY = this.ty - this.y;
            if (toEndX * this.vx + toEndY * this.vy < 0) {
                this.done = true;
            }
        }

        draw() {
            // Draw comet trail
            for (let i = 0; i < this.trail.length; i++) {
                const ratio  = i / this.trail.length;
                const alpha  = ratio * 0.55;
                const radius = this.size * ratio * 0.7;
                if (radius < 0.2) continue;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(this.color, alpha);
                ctx.fill();
            }

            // Glow head
            ctx.save();
            ctx.shadowBlur  = 12;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    /* ── Helpers ── */
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function drawTraces() {
        edges.forEach(e => {
            ctx.beginPath();
            ctx.moveTo(e.x1, e.y1);
            ctx.lineTo(e.x2, e.y2);
            ctx.strokeStyle = 'rgba(255,176,32,0.055)';
            ctx.lineWidth   = 1;
            ctx.stroke();
        });

        // Via pads
        vias.forEach(v => {
            ctx.beginPath();
            ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,176,32,0.18)';
            ctx.fill();
            // ring
            ctx.beginPath();
            ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,176,32,0.09)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    buildNetwork();

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawTraces();
        electrons.forEach(e => { e.update(); e.draw(); });
        requestAnimationFrame(loop);
    }
    loop();

}

/* ==========================================================================
   Microprocessor Chip Visualizer (Landing Page Hero)
   ========================================================================== */
function initChipVisualizer() {
    const canvas = document.getElementById('chip-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    let width = canvas.width = container.clientWidth;
    let height = canvas.height = container.clientHeight;

    window.addEventListener('resize', () => {
        if (canvas.parentElement) {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
        }
    });

    const chipSize = 180;
    const numPinsPerSide = 8;
    const pinLength = 35;
    
    let pulses = [];
    let chipMode = 'A'; // 'A' or 'B'

    const toggleContainer = document.getElementById('cpu-toggle');
    const logsBox = document.getElementById('live-logs-box');
    const descText = document.getElementById('cpu-desc');

    if (toggleContainer) {
        const buttons = toggleContainer.querySelectorAll('.btn-cpu-toggle');
        const wrapA = document.getElementById('chip-wrap-a');
        const wrapB = document.getElementById('chip-wrap-b');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                chipMode = btn.getAttribute('data-mode');
                if (chipMode === 'A') {
                    if (logsBox) logsBox.classList.remove('active');
                    if (descText) descText.textContent = 'STATIC + PINS';
                    if (wrapA) wrapA.style.display = '';
                    if (wrapB) wrapB.style.display = 'none';
                } else {
                    if (logsBox) logsBox.classList.add('active');
                    if (descText) descText.textContent = 'ORBITS + PULSE';
                    if (wrapA) wrapA.style.display = 'none';
                    if (wrapB) wrapB.style.display = '';
                }
            });
        });
    }

    // Simulated log stream for Option B
    const logMessages = [
        { text: '[OK] CLK: 12.00 MHz', type: 'ok' },
        { text: '[OK] REG: SP:0x1FFD', type: 'ok' },
        { text: '[OK] BUS: ADDR:0x4002', type: 'ok' },
        { text: '[OK] INTR: IRQ_LEVEL_3', type: 'ok' },
        { text: '[OK] ALU: ADD_RESULT_0x00FF', type: 'ok' },
        { text: '[OK] MEM: WRITE_SUCCESS_0x3FFF', type: 'ok' },
        { text: '[OK] UART: RX_BUFFER_CLEARED', type: 'ok' },
        { text: '[OK] DMA: CHANNEL_0_COMPLETE', type: 'ok' },
        { text: '[WARN] EMI: NOISE_THRESHOLD_8%', type: 'warn' },
        { text: '[OK] SYS: HEALTH_CHECK_PASS', type: 'ok' }
    ];

    function addSimulatedLog() {
        if (chipMode !== 'B' || !logsBox) return;

        const log = logMessages[Math.floor(Math.random() * logMessages.length)];
        const line = document.createElement('div');
        line.className = `log-line ${log.type}`;
        line.textContent = log.text;

        logsBox.appendChild(line);
        logsBox.scrollTop = logsBox.scrollHeight;

        while (logsBox.childElementCount > 4) {
            logsBox.removeChild(logsBox.firstChild);
        }
    }
    setInterval(addSimulatedLog, 800);
    
    class PinPulse {
        constructor(side, index, pinX, pinY, dx, dy, length) {
            this.side = side;
            this.index = index;
            this.x = pinX;
            this.y = pinY;
            this.dx = dx;
            this.dy = dy;
            this.length = length;
            this.progress = 0;
            this.speed = 0.02 + Math.random() * 0.03;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.color = Math.random() > 0.3 ? 'var(--accent-gold)' : 'var(--accent-green)';
        }

        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.progress = 0;
                this.direction = Math.random() > 0.5 ? 1 : -1;
            }
        }

        draw(cx, cy) {
            const offset = (this.index - (numPinsPerSide - 1) / 2) * 16;
            let startX = cx;
            let startY = cy;
            
            if (this.side === 'top' || this.side === 'bottom') {
                startX += offset;
                startY += this.side === 'top' ? -chipSize/2 : chipSize/2;
            } else {
                startX += this.side === 'left' ? -chipSize/2 : chipSize/2;
                startY += offset;
            }

            const endX = startX + this.dx * this.length;
            const endY = startY + this.dy * this.length;

            let px, py;
            if (this.direction === 1) {
                px = startX + (endX - startX) * this.progress;
                py = startY + (endY - startY) * this.progress;
            } else {
                px = endX + (startX - endX) * this.progress;
                py = endY + (startY - endY) * this.progress;
            }

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initPulses() {
        pulses = [];
        for (let i = 0; i < numPinsPerSide; i++) {
            pulses.push(new PinPulse('top', i, 0, 0, 0, -1, pinLength));
            pulses.push(new PinPulse('bottom', i, 0, 0, 0, 1, pinLength));
            pulses.push(new PinPulse('left', i, 0, 0, -1, 0, pinLength));
            pulses.push(new PinPulse('right', i, 0, 0, 1, 0, pinLength));
        }
    }

    initPulses();

    // Option B Orbits
    const orbitSpeeds = [0.008, 0.012, 0.018];
    const orbitRadii = [60, 95, 130];
    let orbitAngles = [0, 0, 0];
    const orbitPulses = [
        { color: 'var(--accent-gold)', shadow: 'var(--accent-gold-glow)' },
        { color: 'var(--accent-green)', shadow: 'var(--accent-green-glow)' },
        { color: 'var(--accent-gold)', shadow: 'var(--accent-gold-glow)' }
    ];

    function drawChip() {
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        if (chipMode === 'A') {
            ctx.strokeStyle = 'rgba(255, 176, 0, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < numPinsPerSide; i++) {
                const offset = (i - (numPinsPerSide - 1) / 2) * 16;
                ctx.beginPath(); ctx.moveTo(cx + offset, cy - chipSize/2); ctx.lineTo(cx + offset, cy - chipSize/2 - pinLength); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + offset, cy + chipSize/2); ctx.lineTo(cx + offset, cy + chipSize/2 + pinLength); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - chipSize/2, cy + offset); ctx.lineTo(cx - chipSize/2 - pinLength, cy + offset); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + chipSize/2, cy + offset); ctx.lineTo(cx + chipSize/2 + pinLength, cy + offset); ctx.stroke();

                ctx.fillStyle = '#07070a';
                ctx.strokeStyle = 'var(--accent-gold)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(cx + offset, cy - chipSize/2 - pinLength, 3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx + offset, cy + chipSize/2 + pinLength, 3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx - chipSize/2 - pinLength, cy + offset, 3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx + chipSize/2 + pinLength, cy + offset, 3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            }

            ctx.fillStyle = '#101116';
            ctx.strokeStyle = 'var(--accent-gold)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(cx - chipSize/2, cy - chipSize/2, chipSize, chipSize, 6);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 176, 0, 0.05)';
            ctx.lineWidth = 1;
            const innerGrid = 15;
            ctx.save();
            ctx.beginPath();
            ctx.rect(cx - chipSize/2 + 5, cy - chipSize/2 + 5, chipSize - 10, chipSize - 10);
            ctx.clip();
            for (let x = cx - chipSize/2; x < cx + chipSize/2; x += innerGrid) {
                ctx.beginPath(); ctx.moveTo(x, cy - chipSize/2); ctx.lineTo(x, cy + chipSize/2); ctx.stroke();
            }
            for (let y = cy - chipSize/2; y < cy + chipSize/2; y += innerGrid) {
                ctx.beginPath(); ctx.moveTo(cx - chipSize/2, y); ctx.lineTo(cx + chipSize/2, y); ctx.stroke();
            }
            ctx.restore();

            ctx.textAlign = 'center';
            ctx.fillStyle = 'var(--accent-gold)';
            ctx.font = 'bold 15px var(--font-mono)';
            ctx.fillText('CORTEX-A', cx, cy - 5);
            ctx.fillStyle = 'var(--accent-green)';
            ctx.font = '10px var(--font-mono)';
            ctx.fillText('v10a · v9a', cx, cy + 18);

            ctx.fillStyle = 'rgba(255, 176, 0, 0.3)';
            ctx.strokeStyle = 'var(--accent-gold)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx - chipSize/2 + 20, cy - chipSize/2 + 20, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            for (let i = 0; i < pulses.length; i++) {
                pulses[i].update();
                pulses[i].draw(cx, cy);
            }
        } else {
            const coreSize = 70;
            ctx.fillStyle = '#101116';
            ctx.strokeStyle = 'var(--accent-gold)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, coreSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = 'var(--accent-gold)';
            ctx.font = 'bold 9px var(--font-mono)';
            ctx.fillText('ARM_CORE', cx, cy + 3);

            for (let i = 0; i < 3; i++) {
                const radius = orbitRadii[i];
                ctx.strokeStyle = 'rgba(255, 176, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.stroke();

                orbitAngles[i] += orbitSpeeds[i];
                const dotX = cx + Math.cos(orbitAngles[i]) * radius;
                const dotY = cy + Math.sin(orbitAngles[i]) * radius;

                ctx.fillStyle = orbitPulses[i].color;
                ctx.beginPath();
                ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
                ctx.shadowBlur = 8;
                ctx.shadowColor = orbitPulses[i].shadow;
                ctx.fill();
                ctx.shadowBlur = 0;

                const dot2X = cx + Math.cos(orbitAngles[i] + Math.PI) * radius;
                const dot2Y = cy + Math.sin(orbitAngles[i] + Math.PI) * radius;
                ctx.fillStyle = 'rgba(0, 230, 118, 0.6)';
                ctx.beginPath();
                ctx.arc(dot2X, dot2Y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestAnimationFrame(drawChip);
    }

    drawChip();
}

/* ==========================================================================
   Oscilloscope Dashboard Controller (Subpage)
   ========================================================================== */
function initOscilloscope() {
    const canvas = document.getElementById('oscilloscope-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const waveSelect = document.getElementById('wave-select');
    const freqSlider = document.getElementById('freq-slider');
    const ampSlider = document.getElementById('amp-slider');
    const noiseToggle = document.getElementById('noise-toggle');
    const freezeToggle = document.getElementById('freeze-toggle');
    const freqReadout = document.getElementById('freq-readout');
    
    const registers = {
        r0: document.getElementById('reg-r0'),
        r1: document.getElementById('reg-r1'),
        sp: document.getElementById('reg-sp'),
        lr: document.getElementById('reg-lr'),
        pc: document.getElementById('reg-pc'),
        cpsr: document.getElementById('reg-cpsr')
    };

    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;
    
    window.addEventListener('resize', () => {
        if (canvas.parentElement) {
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        }
    });

    let phase = 0;
    let noiseEnabled = false;
    let isFrozen = false;
    let frameCount = 0;

    let regValues = {
        r0: 0x00000000,
        r1: 0x000045A1,
        sp: 0x3FFFFE20,
        lr: 0x00008F4C,
        pc: 0x00009A12,
        cpsr: 0x60000013
    };

    noiseToggle.addEventListener('click', () => {
        noiseEnabled = !noiseEnabled;
        noiseToggle.style.backgroundColor = noiseEnabled ? 'var(--accent-gold)' : 'transparent';
        noiseToggle.style.color = noiseEnabled ? '#030305' : 'var(--text-primary)';
    });

    freezeToggle.addEventListener('click', () => {
        isFrozen = !isFrozen;
        freezeToggle.style.backgroundColor = isFrozen ? 'var(--accent-red)' : 'transparent';
        freezeToggle.style.color = isFrozen ? '#030305' : 'var(--text-primary)';
        
        const stateTag = document.querySelector('.register-state');
        if (stateTag) {
            stateTag.textContent = isFrozen ? 'HALTED' : 'RUNNING';
            stateTag.style.color = isFrozen ? 'var(--accent-red)' : 'var(--accent-green)';
        }
    });

    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 176, 0, 0.03)';
        ctx.lineWidth = 1;
        const size = 40;
        
        for (let x = 0; x < width; x += size) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += size) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 176, 0, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
    }

    function updateRegs() {
        if (isFrozen) return;
        frameCount++;
        
        if (frameCount % 12 === 0) {
            regValues.pc = (regValues.pc + 4) & 0xFFFFFFFF;
            if (regValues.pc > 0x0000A200) regValues.pc = 0x00009A12;

            const currentAmp = parseInt(ampSlider.value);
            const currentFreq = parseInt(freqSlider.value);
            regValues.r0 = (currentAmp * currentFreq * Math.floor(Math.random() * 256)) & 0xFFFFFFFF;

            if (Math.random() > 0.7) {
                regValues.r1 = (regValues.r1 + Math.floor(Math.random() * 10 - 5)) & 0xFFFF;
            }

            Object.keys(registers).forEach(key => {
                if (registers[key]) {
                    const hex = '0x' + regValues[key].toString(16).toUpperCase().padStart(8, '0');
                    if (registers[key].textContent !== hex) {
                        registers[key].textContent = hex;
                        registers[key].classList.add('changed');
                        setTimeout(() => registers[key].classList.remove('changed'), 150);
                    }
                }
            });
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        drawGrid();

        const frequency = parseFloat(freqSlider.value) / 1000;
        const amplitude = parseFloat(ampSlider.value) * (height / 24);
        const waveType = waveSelect.value;
        
        freqReadout.textContent = `F: ${parseFloat(freqSlider.value).toFixed(2)} Hz`;

        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'var(--accent-green)'; // Bright green trace
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'var(--accent-green-glow)';

        const centerY = height / 2;

        for (let x = 0; x < width; x++) {
            let y = 0;
            const theta = x * frequency + phase;

            switch (waveType) {
                case 'sine':
                    y = Math.sin(theta);
                    break;
                case 'square':
                    y = Math.sign(Math.sin(theta));
                    break;
                case 'triangle':
                    y = (Math.abs((theta % (Math.PI * 2)) - Math.PI) / Math.PI) * 2 - 1;
                    break;
                case 'noisy':
                    y = Math.sin(theta * 0.7) * 0.7 + Math.sin(theta * 2.1) * 0.3;
                    break;
            }

            y = y * amplitude;

            if (noiseEnabled) {
                y += (Math.random() - 0.5) * (amplitude * 0.25);
            }

            if (x === 0) {
                ctx.moveTo(x, centerY + y);
            } else {
                ctx.lineTo(x, centerY + y);
            }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        if (!isFrozen) {
            phase += parseFloat(freqSlider.value) / 180;
        }

        updateRegs();
        requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   Skills Dynamic Filtering (Subpage)
   ========================================================================== */
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skill-filters .filter-btn');
    const skillCards = document.querySelectorAll('.skills-grid .skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterVal = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   Contact Serial Transmit Feedback Terminal (Subpage)
   ========================================================================== */
function initContactConsole() {
    const form = document.getElementById('contact-form');
    const monitor = document.getElementById('monitor-output');
    const clearBtn = document.getElementById('clear-monitor');
    const txBytesSpan = document.getElementById('tx-bytes');

    if (!form || !monitor) return;

    let txBytesTotal = 0;

    clearBtn.addEventListener('click', () => {
        monitor.innerHTML = `
            <div class="monitor-line system">[SYSTEM] Ready for data transmission.</div>
            <div class="monitor-line system">[SYSTEM] Connect parameters initialized at 115200 8N1.</div>
            <div class="monitor-line cursor-line">rx_buffer_waiting...<span class="cursor">_</span></div>
        `;
        txBytesTotal = 0;
        txBytesSpan.textContent = txBytesTotal;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const message = document.getElementById('message-payload').value;
        const baudRate = document.getElementById('baud-select').value;
        const parity = document.getElementById('parity-select').value;

        const payloadString = `NAME:${name};EMAIL:${email};MSG:${message};`;
        const payloadBytes = new TextEncoder().encode(payloadString).length;

        const cursorLine = monitor.querySelector('.cursor-line');
        if (cursorLine) cursorLine.remove();

        const logs = [
            { text: `[SYSTEM] Preparing packet transfer on virtual port COM4...`, type: "system" },
            { text: `[SYSTEM] Port Parameters -> Baud Rate: ${baudRate} bps, Parity: ${parity === 'none' ? 'None (8N1)' : 'Even (8E1)'}`, type: "system" },
            { text: `[SYSTEM] Serial Bus request: TX_PIN pulled HIGH, clearing buffer...`, type: "system" },
            { text: `[TX_DATA] START_OF_FRAME (0x7E)`, type: "tx-data" },
            { text: `[TX_DATA] SENDER: ${name.toUpperCase().replace(/\s+/g, '_')}`, type: "tx-data" },
            { text: `[TX_DATA] ADDR: ${email}`, type: "tx-data" },
            { text: `[TX_DATA] PAYLOAD: ${message.slice(0, 60)}${message.length > 60 ? '...' : ''}`, type: "tx-data" },
            { text: `[TX_DATA] END_OF_FRAME (0x7D) | PACKET_SIZE: ${payloadBytes} Bytes`, type: "tx-data" },
            { text: `[SYSTEM] Stream transmitted. Waiting for Receiver ACK...`, type: "system" },
            { text: `[SYSTEM] ACK frame received (0x06). Message saved successfully!`, type: "system" },
            { text: `rx_buffer_waiting...`, type: "cursor" }
        ];

        let index = 0;
        function printTxLog() {
            if (index < logs.length) {
                const log = logs[index];
                const line = document.createElement('div');
                
                if (log.type === 'cursor') {
                    line.className = 'monitor-line cursor-line';
                    line.innerHTML = `${log.text}<span class="cursor">_</span>`;
                } else {
                    line.className = `monitor-line ${log.type}`;
                    line.textContent = log.text;
                }

                monitor.appendChild(line);
                monitor.scrollTop = monitor.scrollHeight;

                if (log.type === 'tx-data') {
                    txBytesTotal += Math.floor(payloadBytes / 5);
                    txBytesSpan.textContent = Math.min(txBytesTotal, payloadBytes);
                }

                index++;
                setTimeout(printTxLog, 100 + Math.random() * 150);
            } else {
                txBytesTotal = payloadBytes;
                txBytesSpan.textContent = txBytesTotal;
                form.reset();
            }
        }

        printTxLog();
    });
}

/* ==========================================================================
   Experience Company Tabs switching (Subpage)
   ========================================================================== */
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.exp-tab-btn');
    const detailsPanels = document.querySelectorAll('.exp-details-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetCompany = btn.getAttribute('data-company');

            detailsPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            const activePanel = document.getElementById(`exp-details-${targetCompany}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}
