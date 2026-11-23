const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];
const lines = s.split('\n');

const chap9Start = lines.findIndex(l => l.includes('9 · scroll'));
console.log('Chapter 9 snippet:');
console.log(lines.slice(chap9Start, chap9Start + 80).join('\n'));
