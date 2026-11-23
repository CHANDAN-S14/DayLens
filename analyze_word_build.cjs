const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];
const lines = s.split('\n');

const wordBuild = lines.findIndex(l => l.includes('function buildWord') || l.includes('buildWordmark') || l.includes('WORD_'));
console.log('Wordmark lines:');
console.log(lines.slice(wordBuild - 5, wordBuild + 45).join('\n'));
