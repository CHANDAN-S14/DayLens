const fs = require('fs');

let html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

// 1. Title and meta
html = html.replace(
  '<title>Kage — Where stillness reveals the unseen</title>',
  '<title>DayLens — Your life, understood through your data</title>'
);
html = html.replace(
  'content="A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL."',
  'content="AI powered personal intelligence platform connecting everyday habits with sleep, activity, screen time, mood and focus."'
);

// 2. Change the 3D Wordmark from KAGE to DAYLENS
html = html.replace(
  "const word = 'KAGE'",
  "const word = 'DAYLENS'"
);
// Adjust tracking and size for 7 letters
html = html.replace(
  "const SZ = 320, TRACK = .40, PAD = 26;",
  "const SZ = 230, TRACK = .26, PAD = 20;"
);
// Adjust gradient from vermilion/bone to botanical/sage
html = html.replace(
  "grad.addColorStop(0, 'rgb(226,236,229)');",
  "grad.addColorStop(0, 'rgb(240,248,243)');"
);
html = html.replace(
  "grad.addColorStop(.52, 'rgb(198,214,203)');",
  "grad.addColorStop(.52, 'rgb(175,215,190)');"
);
html = html.replace(
  "grad.addColorStop(1, 'rgb(150,170,157)');",
  "grad.addColorStop(1, 'rgb(116,160,134)');"
);

// 3. Preloader text
html = html.replace(
  '<div class="pre-jp jp">影の道</div>',
  '<div class="pre-jp jp" style="letter-spacing:0.2em; font-family:Onest,sans-serif; font-size:12px; font-weight:600; color:#749682;">KNOW THYSELF</div>'
);
html = html.replace(
  '<span>Raising the mountain temple</span>',
  '<span>Synthesizing personal intelligence</span>'
);

// 4. Word fallback
html = html.replace(
  '<div class="word-fb" aria-hidden="true">KAGE</div>',
  '<div class="word-fb" aria-hidden="true">DAYLENS</div>'
);

// 5. CSS color accents for botanical / forest feel
html = html.replace(
  '--vermilion:#e0231c;',
  '--vermilion:#2D6A4F; --botanical:#1B4332; --sage:#749682;'
);

fs.writeFileSync('public/landing-pages/daylens.html', html, 'utf8');
console.log('Created base public/landing-pages/daylens.html');
