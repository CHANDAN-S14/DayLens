const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];
const lines = s.split('\n');

const camStart = lines.findIndex(l => l.includes('const CAM ='));
console.log('CAM definition:');
console.log(lines.slice(camStart, camStart + 35).join('\n'));
