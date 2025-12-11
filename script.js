/* ---------------- TIMER (your existing code, unchanged) ---------------- */

const startDate = new Date("2025-05-22T02:16:00+05:30");

function updateTimer() {
  const now = new Date();

  const utcStart = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const utcNow = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const dayDiff = utcNow - utcStart;
  const days = Math.floor(dayDiff / (1000 * 60 * 60 * 24));

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  document.getElementById("timer").innerHTML =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💖`;
}

setInterval(updateTimer, 1000);
updateTimer();



/* ---------------- MUSIC PLAYER ---------------- */

// Add your song files here (must match your filenames exactly)
const songs = [
  "Main Tera.m4a",
  "creep.m4a",
  "pehli dafa.m4a",
  "fly me to the moon.m4a",
  "oo saathi.m4a",
  "perfect.m4a",
  "they call this love.m4a",
  "what do u mean.m4a"
];

let currentSongIndex = 0;
const music = new Audio(songs[currentSongIndex]);
music.volume = 0.9;
music.loop = false;

// When one song finishes, stick to the loop
music.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  music.src = songs[currentSongIndex];
  music.play();
});

// Floating button click → play music
document.getElementById("musicButton").addEventListener("click", () => {
  music.play();
  document.getElementById("musicButton").innerText = "💜"; // changes icon after click
});



/* ---------------- FLOATING HEARTS (optional, from earlier) ---------------- */

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖"; // upright heart emoji
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (3 + Math.random() * 3) + "s";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(createHeart, 400);



/* ---------------- VIRTUAL CAKE: candles, blow detection, slice reveal, confetti ----------------
   This is self-contained in an IIFE so it won't clash with your existing globals.
   Requires these elements in the DOM (you already inserted them):
   - #candles
   - #enableMicBtn
   - #cutBtn
   - #hiddenMessage
   - #confettiCanvas
   - .cake
*/

(function () {
  // config
  const CANDLE_COUNT = 5;
  const blowThreshold = 0.18; // tweak if needed
  const confettiDuration = 4500; // ms

  // elements
  const candlesContainer = document.getElementById('candles');
  const enableMicBtn = document.getElementById('enableMicBtn');
  const cutBtn = document.getElementById('cutBtn');
  const hiddenMessage = document.getElementById('hiddenMessage');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cakeEl = document.querySelector('.cake');

  if (!candlesContainer || !enableMicBtn || !cutBtn || !hiddenMessage || !confettiCanvas || !cakeEl) {
    console.warn('Virtual cake: required DOM nodes missing; script aborted.');
    return;
  }

  /* ---------- Candle creation & basic logic ---------- */
  function makeCandle(i){
    const c = document.createElement('div');
    c.className = 'candle';
    c.setAttribute('data-index', i);
    c.setAttribute('role','button');
    c.setAttribute('aria-pressed','false');
    c.innerHTML = `<div class="wick"></div><div class="flame" aria-hidden="true"></div>`;
    return c;
  }
  for(let i=0;i<CANDLE_COUNT;i++) candlesContainer.appendChild(makeCandle(i));

  function activeCandles(){ return Array.from(candlesContainer.querySelectorAll('.candle:not(.out)')); }
  function allOut(){ return activeCandles().length === 0; }

  function extinguishCandle(el){
    if(!el || el.classList.contains('out')) return false;
    el.classList.add('out');
    el.setAttribute('aria-pressed','true');
    setTimeout(()=> checkReveal(), 520);
    return true;
  }

  candlesContainer.addEventListener('click', (ev)=>{
    const target = ev.target.closest('.candle');
    if(!target) return;
    extinguishCandle(target);
  });

  /* ---------- Microphone (blow detection) ---------- */
  let audioCtx, analyser, micStream, dataArray, sourceNode, rafId;
  async function startMic(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.fftSize);
      sourceNode = audioCtx.createMediaStreamSource(stream);
      sourceNode.connect(analyser);
      micStream = stream;
      monitorMic();
      enableMicBtn.textContent = 'Blow detection active';
      enableMicBtn.disabled = true;
    } catch (err) {
      console.warn('Mic permission denied or unavailable', err);
      enableMicBtn.textContent = 'Mic unavailable';
      enableMicBtn.disabled = true;
    }
  }

  function getRMS(){
    analyser.getByteTimeDomainData(dataArray);
    let sum=0;
    for(let i=0;i<dataArray.length;i++){
      const v = (dataArray[i]-128)/128;
      sum += v*v;
    }
    return Math.sqrt(sum/dataArray.length);
  }

  function monitorMic(){
    const rms = getRMS();
    if(rms > blowThreshold){
      const active = activeCandles();
      if(active.length){
        const toOut = Math.max(1, Math.min(active.length, Math.round(rms*5)));
        for(let i=0;i<toOut;i++){
          const idx = Math.floor(Math.random()*active.length);
          extinguishCandle(active[idx]);
        }
      }
    }
    rafId = requestAnimationFrame(monitorMic);
  }

  enableMicBtn.addEventListener('click', (e)=>{
    startMic();
  });

  /* ---------- Slice creation & animation ---------- */
  // Create the slice element (keeps it around to reuse)
  function createSliceElement(){
    // if slice already exists, return it
    let s = cakeEl.querySelector('.slice');
    if(s) return s;
    s = document.createElement('div');
    s.className = 'slice';
    s.innerHTML = `<div class="slice-candle"><div class="slice-wick"></div></div>`; // optional mini candle on slice
    cakeEl.appendChild(s);
    return s;
  }

  // Play a small chime using WebAudio
  function playChime(){
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 560;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      setTimeout(()=> { o.stop(); ctx.close(); }, 600);
    } catch(e){}
  }

  // Animate slice removal: returns a Promise that resolves when animation ends
  function removeSliceAnimate(){
    return new Promise((resolve)=>{
      const slice = createSliceElement();

      // ensure it's in non-removed state and visible
      slice.classList.remove('removed','cut-slight');
      // small pause to allow DOM to apply base
      requestAnimationFrame(()=>{
        // tiny 'cut-slight' nudge for realism
        slice.classList.add('cut-slight');
        // after brief moment, eject the slice
        setTimeout(()=>{
          slice.classList.remove('cut-slight');
          // add class removed to trigger fly-out
          slice.classList.add('removed');
          // mark cake plate gap (for shadow)
          cakeEl.classList.add('plate-gap');

          // when transition ends, resolve
          const onEnd = (ev) => {
            if(ev.target !== slice) return;
            slice.removeEventListener('transitionend', onEnd);
            resolve();
          };
          // safety timeout in case transitionend doesn't fire
          slice.addEventListener('transitionend', onEnd);
          setTimeout(()=> resolve(), 1100);
        }, 420);
      });
    });
  }

  /* ---------- Cut button behavior ---------- */
  cutBtn.addEventListener('click', async ()=>{
    // if candles still lit, do fail-shake then auto-extinguish and still slice
    if(!allOut()){
      cakeEl.classList.add('cut');
      setTimeout(()=> cakeEl.classList.remove('cut'), 700);
      // extinguish the rest with a small delay
      activeCandles().forEach((c, i)=> setTimeout(()=> extinguishCandle(c), 140*i));
      // after small pause, animate slice and reveal
      setTimeout(async ()=>{
        await removeSliceAnimate();
        playChime();
        revealAndCelebrate();
      }, 900);
    } else {
      // all candles out: normal slice
      cakeEl.classList.add('cut');
      setTimeout(()=> cakeEl.classList.remove('cut'), 700);
      // animate slice, chime, reveal
      await removeSliceAnimate();
      playChime();
      revealAndCelebrate();
    }
  });

  function revealAndCelebrate(){
    hiddenMessage.classList.add('show');
    launchConfetti(confettiCanvas, confettiDuration);
  }

  function checkReveal(){
  if(allOut()){
    // glow pulse
    cakeEl.classList.add("glow-pulse");

    // remove the effect after animation so it can trigger again if needed
    setTimeout(() => {
      cakeEl.classList.remove("glow-pulse");
    }, 1500);

    // then reveal as normal
    setTimeout(()=> revealAndCelebrate(), 420);
  }
}


  /* ---------- Confetti (canvas) ---------- */
  function launchConfetti(canvas, duration = 4000){
    const ctx = canvas.getContext('2d');
    const w = canvas.width = Math.max(window.innerWidth, 300);
    const h = canvas.height = Math.max(window.innerHeight, 300);
    const particles = [];
    const colors = ['#ff6b6b','#ffd86b','#8bd3ff','#ffd0f0','#d6ffb7','#ff9b8a'];

    function rand(min,max){ return Math.random()*(max-min)+min; }
    for(let i=0;i<160;i++){
      particles.push({
        x: rand(w*0.2, w*0.8),
        y: rand(-h*0.2, 0),
        vx: rand(-3,3),
        vy: rand(2,8),
        r: rand(6,12),
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: rand(0,360),
        vr: rand(-12,12),
        ttl: rand(180, 400)
      });
    }

    let start = performance.now();
    function step(now){
      const t = now - start;
      ctx.clearRect(0,0,w,h);
      particles.forEach((p, idx)=>{
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.rot += p.vr;
        p.ttl--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        ctx.restore();
      });
      // remove dead particles
      for(let i=particles.length-1;i>=0;i--){
        if(particles[i].ttl <= 0 || particles[i].y > h + 40) particles.splice(i,1);
      }
      if(t < duration && particles.length){
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0,0,w,h);
      }
    }
    requestAnimationFrame(step);
  }

  // cleanup on page hide
  window.addEventListener('pagehide', ()=>{
    if(micStream){
      micStream.getTracks().forEach(t=>t.stop());
    }
    if(rafId) cancelAnimationFrame(rafId);
  });

})(); // end cake IIFE
/* ===== Hidden-section reveal toggle ===== */
(function(){
  const openBtn = document.getElementById('openCakeBtn');
  const cakeSection = document.getElementById('cakeSection');

  if (!openBtn || !cakeSection) {
    // nothing to do if user didn't add the HTML
    console.warn('Open-cake button or cakeSection missing — reveal toggle not initialized.');
    return;
  }

  // create and insert a small close button inside cake section
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.type = 'button';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close';
  cakeSection.style.position = cakeSection.style.position || 'relative';
  cakeSection.appendChild(closeBtn);

  /* Put this near the top of the cake reveal code (where candlesContainer, cakeEl, hiddenMessage and confettiCanvas are in scope) */

function resetCakeState(){
  // hide message
  hiddenMessage.classList.remove('show');

  // reset slice visual
  const slice = cakeEl.querySelector('.slice');
  if(slice){
    slice.classList.remove('removed','cut-slight');
  }
  cakeEl.classList.remove('plate-gap');

  // reset candles (remove .out)
  const candleEls = candlesContainer.querySelectorAll('.candle');
  candleEls.forEach(c => {
    c.classList.remove('out');
    c.setAttribute('aria-pressed','false');
    // ensure flame element exists (in case something removed it)
    if(!c.querySelector('.flame')){
      c.innerHTML = `<div class="wick"></div><div class="flame" aria-hidden="true"></div>`;
    }
  });

  // clear confetti canvas (stop any visible particles)
  try {
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  } catch(e){ /* ignore if canvas absent */ }
}


function showCake() {
  // reset visuals so opening is clean
  resetCakeState();

  cakeSection.classList.add('show');
  document.getElementById('dimLayer').classList.add('show');
  openBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => cakeSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  openBtn.disabled = true;
  openBtn.style.opacity = '0.8';
}



 function hideCake() {
  cakeSection.classList.remove('show');
  document.getElementById('dimLayer').classList.remove('show');

  openBtn.setAttribute('aria-expanded', 'false');
  openBtn.disabled = false;
  openBtn.style.opacity = '1';

  const container = document.querySelector('.container');
  if (container) container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


  openBtn.addEventListener('click', (e) => {
    showCake();
  });

  closeBtn.addEventListener('click', (e) => {
    hideCake();
  });

  // Optional: if you want clicking outside the cake to close it (mobile-friendly)
  document.addEventListener('click', (e) => {
    if (!cakeSection.classList.contains('show')) return;
    const inside = cakeSection.contains(e.target) || openBtn.contains(e.target);
    // If user clicks outside cakeSection and outside the open button, close
    if (!inside) hideCake();
  });
})();
/* ===== Robust Open/Close Cake Toggle (replace previous toggle) ===== */
(function () {
  // run when DOM ready
  function initOpenCakeToggle() {
    const openBtn = document.getElementById('openCakeBtn');
    const cakeSection = document.getElementById('cakeSection');
    const dimLayer = document.getElementById('dimLayer');

    if (!openBtn) {
      console.error('Open-cake button (#openCakeBtn) not found.');
      return;
    }
    if (!cakeSection) {
      console.error('Cake section (#cakeSection) not found.');
      return;
    }

    // locate cake-related nodes used by reset function (if not present, still continue)
    const candlesContainer = document.getElementById('candles');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cakeEl = document.querySelector('.cake');

    function resetCakeState(){
      // hide message
      if(hiddenMessage) hiddenMessage.classList.remove('show');

      // reset slice visual
      if(cakeEl){
        const slice = cakeEl.querySelector('.slice');
        if(slice){
          slice.classList.remove('removed','cut-slight');
        }
        cakeEl.classList.remove('plate-gap','glow-pulse');
      }

      // reset candles (remove .out)
      if(candlesContainer){
        const candleEls = candlesContainer.querySelectorAll('.candle');
        candleEls.forEach(c => {
          c.classList.remove('out');
          c.setAttribute('aria-pressed','false');
          if(!c.querySelector('.flame')){
            c.innerHTML = `<div class="wick"></div><div class="flame" aria-hidden="true"></div>`;
          }
        });
      }

      // clear confetti canvas
      if(confettiCanvas){
        try {
          const ctx = confettiCanvas.getContext('2d');
          ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
        } catch(e){}
      }
    }

    // open and close handlers
    function showCake() {
      resetCakeState();
      cakeSection.classList.add('show');
      if(dimLayer) dimLayer.classList.add('show');
      openBtn.setAttribute('aria-expanded', 'true');
      // scroll into view after browser paints
      setTimeout(()=> cakeSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
      openBtn.disabled = true;
      openBtn.style.opacity = '0.85';
    }

    function hideCake() {
      cakeSection.classList.remove('show');
      if(dimLayer) dimLayer.classList.remove('show');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.disabled = false;
      openBtn.style.opacity = '1';
      const container = document.querySelector('.container');
      if(container) container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // create close button (if not already present)
    if(!cakeSection.querySelector('.close-btn')){
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.type = 'button';
      closeBtn.innerHTML = '✕';
      closeBtn.title = 'Close';
      cakeSection.style.position = cakeSection.style.position || 'relative';
      cakeSection.appendChild(closeBtn);
      closeBtn.addEventListener('click', hideCake);
    } else {
      // ensure existing close button has handler
      const existing = cakeSection.querySelector('.close-btn');
      existing.addEventListener('click', hideCake);
    }

    // toggle on open button click
    openBtn.addEventListener('click', (e) => {
      try {
        showCake();
      } catch (err) {
        console.error('Error showing cake:', err);
        // attempt graceful fallback
        openBtn.disabled = false;
        openBtn.style.opacity = '1';
      }
    });

    // optional: click outside to close (mobile-friendly)
    document.addEventListener('click', (e) => {
      if (!cakeSection.classList.contains('show')) return;
      const inside = cakeSection.contains(e.target) || openBtn.contains(e.target);
      if (!inside) hideCake();
    });

    // expose a small debug method (in case you want to call from console)
    window._emolette_resetCakeState = resetCakeState;
    console.log('Open-cake toggle initialized.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOpenCakeToggle);
  } else {
    initOpenCakeToggle();
  }
})();





