const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const lines = html.split('\n');
const htmlHead = lines.slice(0, 50).join('\n');
console.log('--- HEAD ---');
console.log(htmlHead);

const script2Start = lines.findIndex(l => l.includes('/* =====================================================================') && l.includes('KAGE'));
console.log('Script 2 starts at line:', script2Start);
console.log('HTML before script 2 (lines', script2Start - 60, 'to', script2Start, '):');
console.log(lines.slice(script2Start - 60, script2Start).join('\n'));
