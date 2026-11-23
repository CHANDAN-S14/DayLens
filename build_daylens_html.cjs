const fs = require('fs');

const original = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

// Find head, style, and scripts
const headEnd = original.indexOf('</head>');
const bodyTagStart = original.indexOf('<body');
const bodyTagEnd = original.indexOf('>', bodyTagStart) + 1;
const script1Tag = original.indexOf('<script src="secret-pathways-assets/three.min.js">');
const script2Tag = original.indexOf('<script>', script1Tag);
const script2End = original.indexOf('</script>', script2Tag) + 9;

// Extract script 2
let script2 = original.substring(script2Tag, script2End);

// Modify Three.js Wordmark in script 2
script2 = script2.replace("const word = 'KAGE'", "const word = 'DAYLENS'");
script2 = script2.replace("const SZ = 320, TRACK = .40, PAD = 26;", "const SZ = 230, TRACK = .26, PAD = 20;");
script2 = script2.replace("grad.addColorStop(0, 'rgb(226,236,229)');", "grad.addColorStop(0, 'rgb(240,248,243)');");
script2 = script2.replace("grad.addColorStop(.52, 'rgb(198,214,203)');", "grad.addColorStop(.52, 'rgb(175,215,190)');");
script2 = script2.replace("grad.addColorStop(1, 'rgb(150,170,157)');", "grad.addColorStop(1, 'rgb(116,160,134)');");

// Extract CSS style
let style = original.substring(original.indexOf('<style>'), original.indexOf('</style>') + 8);
style = style.replace(
  '--vermilion:#e0231c;',
  '--vermilion:#2D6A4F; --botanical:#1B4332; --sage:#749682; --emerald:#52B788;'
);

const newBodyContent = `
<body data-layout-hero="b" data-layout-story="b" data-layout-gallery="b"
      data-layout-curriculum="b" data-layout-closing="b" data-layout-footer="b">

<canvas id="gl" aria-hidden="true"></canvas>
<div id="vignette"></div>
<div id="grain"></div>
<div class="cur-dot" id="cursor"></div>

<!-- ============================================================ preloader -->
<div id="pre">
  <div class="pre-in">
    <div class="pre-mark">
      <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="14" stroke="#468963" stroke-width="2.2"/>
        <circle cx="22" cy="22" r="8" fill="#749682" fill-opacity=".8"/>
        <circle cx="22" cy="22" r="3" fill="#ffffff"/>
      </svg>
    </div>
    <div class="pre-jp jp" style="letter-spacing:0.2em; font-family:Onest,sans-serif; font-size:12px; font-weight:600; color:#749682;">KNOW THYSELF</div>
    <div class="pre-bar"><i id="pre-fill"></i></div>
    <div class="pre-meta">
      <span>Synthesizing personal intelligence</span><b><span id="pre-pct">0</span>%</b>
    </div>
  </div>
</div>

<!-- ============================================================ nav -->
<header class="nav" id="nav">
  <a class="brand" href="#top" data-cursor>
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="14" stroke="#468963" stroke-width="2.2"/>
      <circle cx="22" cy="22" r="8" fill="#749682" fill-opacity=".8"/>
      <circle cx="22" cy="22" r="3" fill="#ffffff"/>
    </svg>
    <span class="brand-tx"><b>DAYLENS</b><i>KNOW THYSELF · TRACK 3</i></span>
  </a>
  <nav class="nav-links" id="navlinks">
    <a class="nav-link" href="#problem" data-cursor><span>The Problem</span><span class="alt">01</span></a>
    <a class="nav-link" href="#solution" data-cursor><span>Solution</span><span class="alt">02</span></a>
    <a class="nav-link" href="#patterns" data-cursor><span>Patterns</span><span class="alt">03</span></a>
    <a class="nav-link" href="#experiments" data-cursor><span>Experiments</span><span class="alt">04</span></a>
    <a class="nav-link" href="#privacy" data-cursor><span>Privacy</span><span class="alt">05</span></a>
  </nav>
  <a class="nav-cta" href="#/overview" target="_parent" data-cursor style="margin-left:auto; display:inline-flex; align-items:center; gap:8px; padding:8px 18px; border-radius:100px; background:rgba(45,106,79,.9); border:1px solid rgba(116,150,130,.4); color:#fff; font-size:13px; font-weight:600; text-decoration:none; backdrop-filter:blur(8px); transition:all .3s ease;">
    <span>Enter DayLens</span>
    <svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M3 11 11 3M5 3h6v6" stroke="#fff" stroke-width="1.4"/></svg>
  </a>
  <button class="nav-burger" aria-label="Menu" data-cursor><i></i><i></i></button>
</header>

<div class="page" id="top">

<!-- ============================================================ hero (Scene 1) -->
<section class="hero" id="hero" data-cam="0">
  <div class="hero-top">
    <div class="eyebrow" data-rv="fade"><span class="dot"></span> wHACKiest 2026 · Track 3 — Know Thyself</div>
    <h1 class="display h-hero">
      <span class="mask-line"><span>Your life,</span></span>
      <span class="mask-line"><span>understood through</span></span>
      <span class="mask-line"><span>your data.</span></span>
    </h1>
    <p class="hero-sub body" data-rv="up">Your sleep, focus, activity and everyday habits tell a story. DayLens helps you discover it.</p>
    <div class="hero-actions" data-rv="up" style="display:flex; align-items:center; gap:16px; margin-top:24px;">
      <a class="cta" href="#/overview" target="_parent" data-cursor>
        <i></i><span>Explore Your Day</span>
        <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
      </a>
      <a class="arrowlink" href="#problem" data-cursor style="font-size:14px; font-weight:500; color:#aab4ad;">
        <span>Discover DayLens</span>
        <span class="ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
      </a>
    </div>
  </div>

  <div class="hero-spacer"></div>

  <div class="hero-foot">
    <div class="hero-cue" data-rv="fade"><span>Scroll to explore</span><span class="track"><i></i></span></div>
    <div class="chapters" id="chips">
      <div class="chip" data-chip="0" data-rv="up" data-cursor><span class="num">01</span>
        <span class="tx"><b>Sleep Architecture</b><p>Discover how 7.5h+ windows unlock next-day cognitive clarity.</p></span></div>
      <div class="chip" data-chip="1" data-rv="up" data-cursor><span class="num">02</span>
        <span class="tx"><b>Screen Boundaries</b><p>Observe how evening blue light correlates with afternoon focus.</p></span></div>
      <div class="chip" data-chip="2" data-rv="up" data-cursor><span class="num">03</span>
        <span class="tx"><b>Physical Cadence</b><p>Ground subjective mood in daily movement and outdoor light.</p></span></div>
      <div class="chip" data-chip="3" data-rv="up" data-cursor><span class="num">04</span>
        <span class="tx"><b>Focused Rhythm</b><p>Identify the quiet routines that catalyze your deepest flow state.</p></span></div>
    </div>
  </div>

  <a class="peek" href="#/overview" target="_parent" data-view="3" data-rv="fade" data-cursor aria-label="Open DayLens Application">
    <span class="peek-fr" data-frame></span>
    <span class="peek-play"><svg viewBox="0 0 22 22" fill="none"><path d="M8 5.6 16.4 11 8 16.4z" fill="#dfe7e0"/></svg></span>
    <span class="peek-cap"><b>Dashboard</b><i>Live LocalStorage Engine</i></span>
  </a>

  <div class="word-fb" aria-hidden="true">DAYLENS</div>
  <div class="hero-side" data-rv="up">
    <span class="v jp" style="letter-spacing:0.25em;">KNOW THYSELF</span>
  </div>
</section>

<!-- ============================================================ Scene 2: The Problem -->
<section class="sec" id="problem" data-cam="1">
  <div class="fg" data-fg="gate" aria-hidden="true">
    <span class="fg-el fg-wall" data-fg-in="left">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/temple-wall.webp" alt="" width="1536" height="884" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-pine" data-fg-in="right">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/pine-tree.webp" alt="" width="1024" height="1438" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-grass" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async">
    </span>
  </div>
  <div class="sec-head" data-rv="fade">
    <span class="k"><b>01</b> — The Fragmented Self</span><span class="rule"></span><span class="k jp">THE PROBLEM</span>
  </div>
  <div class="gate-grid">
    <h2 class="display h-sec" data-rv="up">You're collecting data. But are you understanding it?</h2>
    <div class="gate-copy">
      <p class="lead" data-rv="up">Every day, your phone logs screen pickups. Your watch tallies resting heart rate. Your sleep app counts hours. Yet these numbers sit trapped in walled silos, offering disconnected graphs without a single word of meaningful explanation.</p>
      <p class="body" data-rv="up">Knowing you took 8,200 steps or slept 6.8 hours doesn't tell you why you couldn't focus at 2:00 PM, or what simple routine change would restore your energy. DayLens bridges the gaps between your biometrics, your screen boundaries, and your lived experience.</p>
      <a class="arrowlink" href="#solution" data-rv="fade" data-cursor>
        <span>Discover the unified DayLens solution</span>
        <span class="ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
      </a>
    </div>
  </div>
  <div class="gate-stats" data-rv="up">
    <div><b>06</b><span>Tracked Pipelines</span></div>
    <div><b>100%</b><span>Local Browser Data</span></div>
    <div><b>r=+0.64</b><span>Sleep/Focus Observed</span></div>
    <div><b>0</b><span>External Trackers</span></div>
  </div>
</section>

<!-- ============================================================ Scene 3: The Solution -->
<section class="sec" id="solution" data-cam="2">
  <div class="fg" data-fg="pathways" aria-hidden="true">
    <span class="fg-el fg-sakura fg-el--sway" data-fg-in="left">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/sakura-branch.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-leaves fg-el--sway" data-fg-in="right">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/maple-leaves.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-lantern" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/stone-lantern.webp" alt="" width="1024" height="1499" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-bush" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/garden-bush.webp" alt="" width="1717" height="876" loading="lazy" decoding="async">
    </span>
  </div>
  <div class="sec-head" data-rv="fade">
    <span class="k"><b>02</b> — Unified Intelligence</span><span class="rule"></span><span class="k jp">THE SOLUTION</span>
  </div>
  <div class="cur-head">
    <h2 class="display h-sec" data-rv="up">One place. A clearer picture of you.</h2>
    <p class="body-lg" data-rv="up">DayLens unites phone activity, smartwatch streams, sleep stages, screen limits, mood reflections, and cognitive ratings into one cohesive personal intelligence landscape.</p>
  </div>
  <div class="cards" id="cards">
    <article class="card" data-rv="up" data-view="0" data-cursor onclick="window.parent.location.hash='#/data'">
      <div class="card-fr" data-frame>
        <span class="card-ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
        <i class="glow" style="--gx:80.2%; --gy:23.9%; --gr:22%; --gt:6.1s; --gt2:9.7s; --gc1:rgba(116,150,130,.50); --gc2:rgba(45,106,79,.30)"></i>
        <div class="card-lab"><b>Biometrics</b><span class="jp">SLEEP & REST</span></div>
      </div>
      <div class="card-meta"><span>Restorative sleep architecture</span><span>01 / 03</span></div>
    </article>
    <article class="card" data-rv="up" data-view="1" data-cursor onclick="window.parent.location.hash='#/data'">
      <div class="card-fr" data-frame>
        <span class="card-ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
        <i class="glow glow--flame" style="--gx:70.5%; --gy:47.2%; --gr:14%; --gt:3.7s; --gt2:5.3s; --gc1:rgba(201,162,74,.62); --gc2:rgba(116,150,130,.30)"></i>
        <div class="card-lab"><b>Digital Rhythm</b><span class="jp">SCREEN BOUNDARIES</span></div>
      </div>
      <div class="card-meta"><span>Screen time vs mental fatigue</span><span>02 / 03</span></div>
    </article>
    <article class="card" data-rv="up" data-view="2" data-cursor onclick="window.parent.location.hash='#/insights'">
      <div class="card-fr" data-frame>
        <span class="card-ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
        <i class="glow" style="--gx:48.0%; --gy:16.8%; --gr:20%; --gt:7.3s; --gt2:11.2s; --gc1:rgba(116,150,130,.52); --gc2:rgba(27,67,50,.35)"></i>
        <div class="card-lab"><b>Cognitive Focus</b><span class="jp">FLOW & CLARITY</span></div>
      </div>
      <div class="card-meta"><span>Self-reported clarity & deep flow</span><span>03 / 03</span></div>
    </article>
  </div>
</section>

<!-- ============================================================ Scene 4: Discover Patterns -->
<section class="sec" id="patterns" data-cam="3">
  <div class="fg" data-fg="lessons" aria-hidden="true">
    <span class="fg-el fg-wall fg-el--flip" data-fg-in="right">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/temple-wall.webp" alt="" width="1536" height="884" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-stones" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/basalt-stones.webp" alt="" width="1536" height="996" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-grass" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async">
    </span>
  </div>
  <div class="sec-head" data-rv="fade">
    <span class="k"><b>03</b> — Discover Patterns</span><span class="rule"></span><span class="k jp">PATTERNS</span>
  </div>
  <div class="cur-head">
    <h2 class="display h-sec" data-rv="up">Your habits have patterns. Discover them.</h2>
    <p class="body-lg" data-rv="up">Authentic mathematical associations derived from your stored daily logs. DayLens computes Pearson correlation coefficients (r) directly in your browser without fabricated statistics.</p>
  </div>
  <div class="cur" id="cur">
    <div class="les" data-les="0" data-cursor onclick="window.parent.location.hash='#/insights'">
      <span class="k">01</span>
      <h3>Sleep Duration & Next-Day Focus<em class="jp" style="font-family:Onest,sans-serif; letter-spacing:0.05em; font-size:13px; color:#52B788;">r = +0.64</em></h3>
      <p>Days following 7.5+ hours of sleep average 8.2/10 focus compared to 6.1/10 following shorter sleep windows.</p>
      <span class="t">Strong evidence</span><i class="bar"></i>
    </div>
    <div class="les" data-les="1" data-cursor onclick="window.parent.location.hash='#/insights'">
      <span class="k">02</span>
      <h3>Screen Time & Focus Stability<em class="jp" style="font-family:Onest,sans-serif; letter-spacing:0.05em; font-size:13px; color:#52B788;">r = -0.58</em></h3>
      <p>Days exceeding 5.5 hours of screen time exhibit noticeable afternoon focus drops and mental fatigue.</p>
      <span class="t">Moderate evidence</span><i class="bar"></i>
    </div>
    <div class="les" data-les="2" data-cursor onclick="window.parent.location.hash='#/insights'">
      <span class="k">03</span>
      <h3>Physical Movement & Emotional Tone<em class="jp" style="font-family:Onest,sans-serif; letter-spacing:0.05em; font-size:13px; color:#52B788;">r = +0.52</em></h3>
      <p>Reaching 8,500+ daily steps is consistently paired with higher subjective mood ratings and lower reported lethargy.</p>
      <span class="t">High evidence</span><i class="bar"></i>
    </div>
    <div class="les" data-les="3" data-cursor onclick="window.parent.location.hash='#/insights'">
      <span class="k">04</span>
      <h3>Weekend Wake-Up Consistency<em class="jp" style="font-family:Onest,sans-serif; letter-spacing:0.05em; font-size:13px; color:#52B788;">r = +0.41</em></h3>
      <p>Standardized wake-up schedules eliminate social jetlag and promote steady Monday morning alertness.</p>
      <span class="t">Emerging trend</span><i class="bar"></i>
    </div>
  </div>
</section>

<!-- ============================================================ Scene 5 & 6: Experiments & Privacy -->
<section class="sec fin" id="experiments" data-cam="4">
  <div class="fg" data-fg="eternity" aria-hidden="true">
    <span class="fg-el fg-hill" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/hill.webp" alt="" width="1774" height="887" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-ruins" data-fg-in="left">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/shrine-ruins.webp" alt="" width="1536" height="1001" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-grass" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-sakura" data-fg-in="left">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/sakura-branch.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async">
    </span>
  </div>
  <div class="eyebrow" data-rv="fade">04 & 05 — Experiment Lab & Privacy</div>
  <h2 class="display" data-rv="up">Small experiments. Meaningful discoveries.</h2>
  <p class="body-lg" data-rv="up">Do not guess how habit changes affect you. Design structured 14-day personal experiments in your lab. Track consistency, measure before and after distributions, and understand your real rhythms with complete client-side privacy.</p>
  <div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center; margin-top:28px;" data-rv="fade">
    <a class="cta" href="#/experiments" target="_parent" data-cursor>
      <i></i><span>Open Experiment Lab</span>
      <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
    </a>
    <a class="arrowlink" href="#/privacy" target="_parent" data-cursor style="font-size:15px; color:#aab4ad;">
      <span>Explore Privacy Controls</span>
      <span class="ar"><svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg></span>
    </a>
  </div>
</section>

<!-- ============================================================ Scene 7: Final CTA & Footer -->
<footer class="foot" data-cam="5">
  <div class="fg" data-fg="foot" aria-hidden="true">
    <span class="fg-el fg-bush" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/garden-bush.webp" alt="" width="1717" height="876" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-grass" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async">
    </span>
    <span class="fg-el fg-stones" data-fg-in="up">
      <img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/basalt-stones.webp" alt="" width="1536" height="996" loading="lazy" decoding="async">
    </span>
  </div>
  <div class="foot-grid">
    <div class="foot-brand">
      <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
        <circle cx="22" cy="22" r="14" stroke="#468963" stroke-width="2.2"/>
        <circle cx="22" cy="22" r="8" fill="#749682" fill-opacity=".8"/>
        <circle cx="22" cy="22" r="3" fill="#ffffff"/>
      </svg>
      <h3 style="margin:12px 0 6px; font-size:20px; font-weight:600; color:#dfe7e0;">Start understanding yourself.</h3>
      <p>DayLens is an AI-powered personal intelligence platform connecting everyday habits with sleep, activity, screen time, mood and focus.</p>
      <div style="margin-top:16px;">
        <a class="cta" href="#/overview" target="_parent" data-cursor>
          <i></i><span>Enter DayLens Dashboard</span>
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
        </a>
      </div>
    </div>
    <div><h4>Navigation</h4><ul>
      <li><a href="#/overview" target="_parent" data-cursor>Dashboard Overview</a></li>
      <li><a href="#/data" target="_parent" data-cursor>My Personal Data</a></li>
      <li><a href="#/insights" target="_parent" data-cursor>Pattern Discovery</a></li>
      <li><a href="#/experiments" target="_parent" data-cursor>Experiment Lab</a></li>
      <li><a href="#/assistant" target="_parent" data-cursor>DayLens AI Assistant</a></li>
    </ul></div>
    <div><h4>Data Sovereignty</h4><ul>
      <li><a href="#/privacy" target="_parent" data-cursor>Privacy Centre</a></li>
      <li><a href="#/privacy" target="_parent" data-cursor>Local Storage Engine</a></li>
      <li><a href="#/data" target="_parent" data-cursor>CSV Export & Import</a></li>
      <li><a href="#/privacy" target="_parent" data-cursor>Zero Cloud Retention</a></li>
    </ul></div>
    <div><h4>Hackathon</h4><ul>
      <li><a href="#top" data-cursor>wHACKiest 2026</a></li>
      <li><a href="#top" data-cursor>Track 3 — Know Thyself</a></li>
      <li><a href="#/settings" target="_parent" data-cursor>System Settings</a></li>
    </ul></div>
  </div>
  <div class="foot-base">
    <span>© 2026 DayLens — Personal Intelligence Prototype</span>
    <span class="jp" style="font-family:Onest,sans-serif; letter-spacing:0.15em;">KNOW THYSELF</span>
    <span>wHACKiest 2026 · Track 3 · WebGL Three.js</span>
  </div>
</footer>

</div><!-- /.page -->

<div id="fg-sky" aria-hidden="true"></div>
<div class="rail" id="rail"></div>

<script src="secret-pathways-assets/three.min.js"></script>
`;

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>DayLens — Your life, understood through your data</title>
<meta name="description" content="AI powered personal intelligence platform connecting everyday habits with sleep, activity, screen time, mood and focus.">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%231B4332'/><circle cx='16' cy='16' r='8' fill='%23749682'/><circle cx='16' cy='16' r='3' fill='%23FFFFFF'/></svg>">
<link rel="stylesheet" href="secret-pathways-assets/fonts.css">
${style}
</head>
${newBodyContent}
${script2}
</body>
</html>
`;

fs.writeFileSync('public/landing-pages/daylens.html', finalHtml, 'utf8');
console.log('Successfully written public/landing-pages/daylens.html. Size:', finalHtml.length);
