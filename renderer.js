const CIRCUMFERENCE = 2 * Math.PI * 108;
const R = 108, CX = 150, CY = 150;
const pad = n => String(n).padStart(2, '0');

// ── DOM refs ──────────────────────────────────
const widget         = document.getElementById('widget');
const timeDisplay    = document.getElementById('timeDisplay');
const timeLabel      = document.getElementById('timeLabel');
const progressCircle = document.getElementById('progressCircle');
const progressShadow = document.getElementById('progressShadow');
const tipDot         = document.getElementById('tipDot');
const startBtn       = document.getElementById('startBtn');
const startIcon      = document.getElementById('startIcon');
const resetBtn       = document.getElementById('resetBtn');
const settingsBtn    = document.getElementById('settingsBtn');
const settingsPanel  = document.getElementById('settingsPanel');
const pinBtn         = document.getElementById('pinBtn');
const closeBtn       = document.getElementById('closeBtn');
const doneOverlay    = document.getElementById('doneOverlay');
const ambientGlow    = document.getElementById('ambientGlow');
const hoursVal       = document.getElementById('hoursVal');
const minutesVal     = document.getElementById('minutesVal');
const secondsVal     = document.getElementById('secondsVal');
const applyBtn       = document.getElementById('applyBtn');
const ticksGroup     = document.getElementById('ticks');

// ── State ─────────────────────────────────────
let total     = 25 * 60;
let remaining = total;
let running   = false;
let pinned    = true;
let settingsOpen = false;
let ticker    = null;
const settingsVals = { hours: 0, minutes: 25, seconds: 0 };

// ── Bootstrap ─────────────────────────────────
progressCircle.style.strokeDasharray = CIRCUMFERENCE;
progressShadow.style.strokeDasharray = CIRCUMFERENCE;
buildTicks();
renderDisplay();
renderRing(1);
pinBtn.classList.add('btn-pin--active');

// ── Tick marks ────────────────────────────────
function buildTicks() {
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 60; i++) {
    const angle   = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const r1 = R + (isMajor ? 14 : 10);
    const r2 = R + (isMajor ? 22 : 15);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', CX + r1 * Math.cos(angle));
    line.setAttribute('y1', CY + r1 * Math.sin(angle));
    line.setAttribute('x2', CX + r2 * Math.cos(angle));
    line.setAttribute('y2', CY + r2 * Math.sin(angle));
    line.setAttribute('stroke', isMajor ? 'rgba(0,229,255,0.28)' : 'rgba(0,229,255,0.1)');
    line.setAttribute('stroke-width', isMajor ? '1.5' : '1');
    line.setAttribute('stroke-linecap', 'round');
    ticksGroup.appendChild(line);
  }
}

// ── Display helpers ───────────────────────────
function renderDisplay() {
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  timeDisplay.textContent = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function renderRing(progress) {
  const offset = CIRCUMFERENCE * (1 - progress);
  progressCircle.style.strokeDashoffset = offset;
  progressShadow.style.strokeDashoffset = offset;
  // tip dot rotation (-90deg offset so it starts from top)
  const deg = progress * 360;
  tipDot.style.transform = `rotate(${deg}deg)`;
  // warn state when < 60s
  const warn = remaining > 0 && remaining <= 60 && running;
  widget.classList.toggle('widget--warn', warn);
  if (warn) {
    progressCircle.setAttribute('stroke', '#ff2d9b');
    progressShadow.setAttribute('stroke', '#ff2d9b');
  } else {
    progressCircle.setAttribute('stroke', 'url(#arcGrad)');
    progressShadow.setAttribute('stroke', '#00e5ff');
  }
}

// ── Timer core ────────────────────────────────
function tick() {
  if (remaining <= 0) {
    clearInterval(ticker);
    running = false;
    onDone();
    return;
  }
  remaining--;
  renderDisplay();
  renderRing(remaining / total);
}

function startTimer() {
  if (remaining <= 0) return;
  running = true;
  ticker  = setInterval(tick, 1000);
  widget.classList.add('widget--running');
  startBtn.classList.add('btn-start--running');
  startIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  timeLabel.textContent = 'FOCUSING';
  ambientGlow.style.background =
    'radial-gradient(ellipse 220px 220px at 50% 52%, rgba(0,229,255,0.1) 0%, transparent 70%)';
}

function pauseTimer() {
  running = false;
  clearInterval(ticker);
  widget.classList.remove('widget--running');
  startBtn.classList.remove('btn-start--running');
  startIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
  timeLabel.textContent = 'PAUSED';
  ambientGlow.style.background =
    'radial-gradient(ellipse 200px 200px at 50% 52%, rgba(0,229,255,0.04) 0%, transparent 70%)';
}

function resetTimer() {
  clearInterval(ticker);
  running = false;
  remaining = total;
  widget.classList.remove('widget--running', 'widget--warn');
  startBtn.classList.remove('btn-start--running');
  startIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
  timeLabel.textContent = 'FOCUS';
  ambientGlow.style.background =
    'radial-gradient(ellipse 200px 200px at 50% 52%, rgba(0,229,255,0.05) 0%, transparent 70%)';
  progressCircle.setAttribute('stroke', 'url(#arcGrad)');
  progressShadow.setAttribute('stroke', '#00e5ff');
  renderDisplay();
  renderRing(1);
}

function onDone() {
  widget.classList.remove('widget--running', 'widget--warn');
  startBtn.classList.remove('btn-start--running');
  startIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
  timeLabel.textContent = 'DONE';
  progressCircle.setAttribute('stroke', 'url(#arcGrad)');
  progressShadow.setAttribute('stroke', '#00e5ff');
  doneOverlay.classList.add('done-overlay--visible');
  if (Notification.permission === 'granted') {
    new Notification('专注完成 ✓', { body: '倒计时结束，休息一下吧！', silent: false });
  }
}

// ── Button handlers ───────────────────────────
startBtn.addEventListener('click', () => {
  if (remaining <= 0) return;
  running ? pauseTimer() : startTimer();
});

resetBtn.addEventListener('click', resetTimer);

settingsBtn.addEventListener('click', () => {
  settingsOpen = !settingsOpen;
  settingsPanel.classList.toggle('settings-panel--open', settingsOpen);
  settingsBtn.classList.toggle('btn-settings--active', settingsOpen);
});

pinBtn.addEventListener('click', () => {
  pinned = !pinned;
  window.electronAPI.toggleAlwaysOnTop(pinned);
  pinBtn.classList.toggle('btn-pin--active', pinned);
});

closeBtn.addEventListener('click', () => window.electronAPI.closeWindow());

doneOverlay.addEventListener('click', () => {
  doneOverlay.classList.remove('done-overlay--visible');
  resetTimer();
});

// ── Settings panel ────────────────────────────
function syncSettingsUI() {
  hoursVal.textContent   = pad(settingsVals.hours);
  minutesVal.textContent = pad(settingsVals.minutes);
  secondsVal.textContent = pad(settingsVals.seconds);
}

document.querySelectorAll('.btn-adj').forEach(btn => {
  btn.addEventListener('click', () => {
    const unit = btn.dataset.unit;
    const dir  = btn.dataset.dir;
    const max  = unit === 'hours' ? 23 : 59;
    if (dir === 'up')   settingsVals[unit] = settingsVals[unit] >= max ? 0 : settingsVals[unit] + 1;
    if (dir === 'down') settingsVals[unit] = settingsVals[unit] <= 0 ? max : settingsVals[unit] - 1;
    syncSettingsUI();
  });
});

applyBtn.addEventListener('click', () => {
  const t = settingsVals.hours * 3600 + settingsVals.minutes * 60 + settingsVals.seconds;
  if (t <= 0) return;
  total     = t;
  remaining = t;
  pauseTimer();
  renderDisplay();
  renderRing(1);
  settingsOpen = false;
  settingsPanel.classList.remove('settings-panel--open');
  settingsBtn.classList.remove('btn-settings--active');
  timeLabel.textContent = 'FOCUS';
});

// ── Notification permission ───────────────────
Notification.requestPermission();
