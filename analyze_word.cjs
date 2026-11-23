const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];
const lines = s.split('\n');

const wordLines = lines.filter(l => l.includes('WORD'));
console.log('WORD occurrences count:', wordLines.length);
wordLines.slice(0, 15).forEach(l => console.log('  ', l.trim()));
